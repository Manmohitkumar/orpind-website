import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpayWebhook, verifyRazorpayPayment } from '@/lib/payment';
import { sendOrderConfirmation } from '@/lib/email';
import prisma from '@/lib/db';
import { apiError } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || '';

    if (!verifyRazorpayWebhook(body, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    switch (event.event) {
      case 'payment.authorized':
        await handlePaymentAuthorized(event.payload.payment.entity);
        break;
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity);
        break;
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity);
        break;
      case 'refund.created':
        await handleRefundCreated(event.payload.refund.entity);
        break;
      case 'refund.processed':
        await handleRefundProcessed(event.payload.refund.entity);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return apiError(error, 'POST /api/payments/webhook');
  }
}

async function handlePaymentAuthorized(payment: any) {
  const order = await prisma.order.findFirst({
    where: { razorpayOrderId: payment.order_id },
  });

  if (!order) return;

  await prisma.order.update({
    where: { id: order.id },
    data: {
      razorpayPaymentId: payment.id,
      paymentStatus: 'PROCESSING',
    },
  });
}

async function handlePaymentCaptured(payment: any) {
  const order = await prisma.order.findFirst({
    where: { razorpayOrderId: payment.order_id },
    include: { user: true },
  });

  if (!order) return;

  await prisma.order.update({
    where: { id: order.id },
    data: {
      razorpayPaymentId: payment.id,
      paymentStatus: 'COMPLETED',
      orderStatus: 'CONFIRMED',
      paidAt: new Date(),
    },
  });

  // Send order confirmation email
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

async function handlePaymentFailed(payment: any) {
  const order = await prisma.order.findFirst({
    where: { razorpayOrderId: payment.order_id },
  });

  if (!order) return;

  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: 'FAILED',
      orderStatus: 'CANCELLED',
    },
  });

  // Restore stock
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

async function handleRefundCreated(refund: any) {
  const order = await prisma.order.findFirst({
    where: { razorpayPaymentId: refund.payment_id },
  });

  if (!order) return;

  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: 'REFUNDED',
      orderStatus: 'RETURNED',
    },
  });
}

async function handleRefundProcessed(refund: any) {
  // Additional processing if needed
  console.log('Refund processed:', refund.id);
}
