import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import prisma from '@/lib/db';
import { apiError } from '@/lib/api-utils';

function isAdmin(role: string) {
  return role === 'ADMIN' || role === 'SUPER_ADMIN';
}

async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {};
    if (status) where.orderStatus = status;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          items: { select: { productName: true, quantity: true, price: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return apiError(error, 'Admin GET /api/admin/orders');
  }
}

async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, action, trackingNumber, carrier } = body;

    if (!orderId || !action) {
      return NextResponse.json({ error: 'Order ID and action are required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    switch (action) {
      case 'confirm':
        await prisma.order.update({
          where: { id: orderId },
          data: { orderStatus: 'CONFIRMED' },
        });
        break;

      case 'ship':
        if (!trackingNumber || !carrier) {
          return NextResponse.json({ error: 'Tracking number and carrier required' }, { status: 400 });
        }
        await prisma.order.update({
          where: { id: orderId },
          data: {
            orderStatus: 'SHIPPED',
            trackingNumber,
            carrier,
            estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          },
        });
        break;

      case 'deliver':
        await prisma.order.update({
          where: { id: orderId },
          data: { orderStatus: 'DELIVERED', deliveredAt: new Date() },
        });
        break;

      case 'cancel':
        await prisma.order.update({
          where: { id: orderId },
          data: {
            orderStatus: 'CANCELLED',
            paymentStatus: order.paymentStatus === 'COMPLETED' ? 'REFUNDED' : undefined,
          },
        });
        for (const item of order.items) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stockCount: { increment: item.quantity } },
          });
        }
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ message: `Order ${action} successfully` });
  } catch (error) {
    return apiError(error, 'Admin PUT /api/admin/orders');
  }
}

export { GET, PUT };
