import { NextRequest, NextResponse } from 'next/server';
import { verifyStripeWebhook } from '@/lib/payment/stripe';
import { sendOrderConfirmation } from '@/lib/email';
import prisma from '@/lib/db';
import { apiError } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || '';

    let event;
    try {
      event = verifyStripeWebhook(body, signature);
    } catch {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      case 'charge.refunded':
        await handleRefundUpdated(event.data.object);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return apiError(error, 'POST /api/payments/stripe-webhook');
  }
}

async function handlePaymentSucceeded(paymentIntent: any) {
  const order = await prisma.order.findFirst({
    where: { razorpayOrderId: paymentIntent.id },
    include: { user: true },
  });

  if (!order) return;

  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentId: paymentIntent.id,
      paymentStatus: 'COMPLETED',
      orderStatus: 'CONFIRMED',
      paidAt: new Date(),
    },
  });

  if (order.user) {
    try {
      await sendOrderConfirmation(order.user.email, {
        orderNumber: order.orderNumber,
        items: [],
        total: order.total,
        shippingAddress: 'Address on file',
        estimatedDelivery: '3-5 business days',
      });
    } catch (error) {
      console.error('Failed to send order confirmation:', error);
    }
  }
}

async function handlePaymentFailed(paymentIntent: any) {
  const order = await prisma.order.findFirst({
    where: { razorpayOrderId: paymentIntent.id },
  });

  if (!order) return;

  if (order.paymentStatus === 'COMPLETED') return;

  await prisma.order.updateMany({
    where: { id: order.id, paymentStatus: { not: 'COMPLETED' } },
    data: {
      paymentStatus: 'COMPLETED',
      orderStatus: 'CONFIRMED',
      paidAt: new Date(),
    },
  });

  const orderItems = await prisma.orderItem.findMany({
    where: { orderId: order.id },
  });

  for (const item of orderItems) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stockCount: { increment: item.quantity } },
    });
  }
}

async function handleRefundUpdated(charge: any) {
  const order = await prisma.order.findFirst({
    where: { paymentId: charge.payment_intent },
  });

  if (!order) return;

  if (order.paymentStatus === 'FAILED' || order.paymentStatus === 'CANCELLED' || order.paymentStatus === 'COMPLETED') return;

  const cancelled = await prisma.order.updateMany({
    where: { id: order.id, paymentStatus: { notIn: ['FAILED', 'CANCELLED', 'COMPLETED'] } },
    data: {
      paymentStatus: 'FAILED',
      orderStatus: 'CANCELLED',
    },
  });
  if (cancelled.count === 0) return;
}
