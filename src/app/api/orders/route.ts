import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import prisma from '@/lib/db';
import { apiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const status = searchParams.get('status');

  const where: any = { userId: user.id };
  if (status) where.orderStatus = status;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        items: {
          select: {
            id: true,
            productName: true,
            quantity: true,
            price: true,
            weight: true,
            image: true,
          },
        },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return NextResponse.json({
    orders,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
  } catch (error) {
    return apiError(error, 'GET /api/orders');
  }
}

export async function POST(request: NextRequest) {
  try {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { items, shippingAddress, paymentMethod } = await request.json();

  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'No items in order' }, { status: 400 });
  }

  const productIds = items.map((item: any) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  });

  if (products.length !== productIds.length) {
    return NextResponse.json({ error: 'Some products are no longer available' }, { status: 400 });
  }

  let subtotal = 0;
  const orderItems = items.map((item: any) => {
    const product = products.find(p => p.id === item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found`);
    if (product.stockCount < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }
    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;
    return {
      productId: product.id,
      productName: product.name,
      weight: item.weight || product.weight?.[0] || '',
      quantity: item.quantity,
      price: product.price,
      total: itemTotal,
      image: product.images?.[0] || null,
    };
  });

  const shipping = subtotal >= 999 ? 0 : 49;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const orderCount = await prisma.order.count();
  const orderNumber = `ORD-${String(orderCount + 1).padStart(6, '0')}`;

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        orderNumber,
        userId: user.id,
        subtotal,
        discount: 0,
        shippingCost: shipping,
        tax,
        total,
        paymentMethod: (paymentMethod || 'COD') as any,
        paymentStatus: 'PENDING',
        orderStatus: 'PLACED',
        items: { create: orderItems },
      },
      include: { items: true },
    });

    for (const item of orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stockCount: { decrement: item.quantity } },
      });
    }

    await tx.cartItem.deleteMany({ where: { userId: user.id } });

    return newOrder;
  });

  return NextResponse.json({
    message: 'Order placed successfully',
    order: {
      id: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
      status: order.orderStatus,
      createdAt: order.createdAt,
    },
  }, { status: 201 });
  } catch (error) {
    return apiError(error, 'POST /api/orders');
  }
}
