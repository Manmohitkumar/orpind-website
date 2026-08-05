import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { createStripePaymentIntent } from '@/lib/payment/stripe';
import prisma from '@/lib/db';
import { apiError } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: user.id },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.paymentStatus === 'COMPLETED') {
      return NextResponse.json({ error: 'Order already paid' }, { status: 400 });
    }

    const paymentIntent = await createStripePaymentIntent({
      amount: Math.round(order.total * 100),
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerEmail: user.email,
      customerName: `${user.firstName} ${user.lastName}`,
    });

    await prisma.order.update({
      where: { id: orderId },
      data: { razorpayOrderId: paymentIntent.id },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    return apiError(error, 'POST /api/payments/stripe');
  }
}
