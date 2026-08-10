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

  const allowedPaymentMethods = new Set(['COD', 'RAZORPAY', 'STRIPE']);
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return NextResponse.json({ error: 'Order must contain between 1 and 50 items' }, { status: 400 });
  }
  if (paymentMethod && !allowedPaymentMethods.has(paymentMethod)) {
    return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 });
  }
  for (const item of items) {
    if (typeof item?.productId !== 'string' || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) {
      return NextResponse.json({ error: 'Each item must have a valid product and quantity' }, { status: 400 });
    }
  }

  const productIds = [...new Set(items.map((item: { productId: string }) => item.productId))];
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

  const orderNumber = `ORD-${crypto.randomUUID().replaceAll('-', '').slice(0, 12).toUpperCase()}`;

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
      const updated = await tx.product.updateMany({
        where: { id: item.productId, isActive: true, stockCount: { gte: item.quantity } },
        data: { stockCount: { decrement: item.quantity } },
      });
      if (updated.count !== 1) {
        throw new Error(`Insufficient stock for ${item.productName}`);
      }
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
