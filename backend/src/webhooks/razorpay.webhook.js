import crypto from 'crypto';
import config from '../config/index.js';
import logger from '../config/logger.js';
import Payment from '../models/payment.model.js';
import Order from '../models/order.model.js';

const SIGNATURE_ALGO = 'sha256';

function verifySignature(body, signature) {
  const expectedSignature = crypto
    .createHmac(SIGNATURE_ALGO, config.razorpayWebhookSecret)
    .update(JSON.stringify(body))
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));
}

async function handlePaymentCaptured(paymentData) {
  const idempotencyKey = `captured_${paymentData.id}`;
  const existing = await Payment.findOne({ idempotencyKey });
  if (existing) {
    logger.info('Duplicate payment.captured webhook ignored', { paymentId: paymentData.id });
    return { handled: true, duplicate: true };
  }

  const payment = await Payment.findOne({ providerOrderId: paymentData.order_id });
  if (!payment) {
    logger.warn('Payment not found for captured event', { orderId: paymentData.order_id });
    return { handled: false, reason: 'payment_not_found' };
  }

  const updates = {
    providerPaymentId: paymentData.id,
    status: 'captured',
    webhookReceivedAt: new Date(),
    idempotencyKey,
  };

  if (paymentData.method) updates.method = paymentData.method;
  if (paymentData.card?.last4) updates.cardLast4 = paymentData.card.last4;
  if (paymentData.vpa) updates.upiId = paymentData.vpa;

  await Payment.findByIdAndUpdate(payment._id, { $set: updates });

  await Order.findOneAndUpdate(
    { razorpayOrderId: paymentData.order_id },
    { $set: { paymentStatus: 'paid', paymentId: paymentData.id } }
  );

  const order = await Order.findOne({ razorpayOrderId: paymentData.order_id }).populate('userId', 'firstName lastName email');
  if (order && order.userId) {
    logger.info('Order payment confirmed', { orderId: order._id, orderNumber: order.orderNumber });
  }

  logger.info('Payment captured processed', { paymentId: paymentData.id, orderId: paymentData.order_id });
  return { handled: true };
}

async function handlePaymentFailed(paymentData) {
  const idempotencyKey = `failed_${paymentData.id}`;
  const existing = await Payment.findOne({ idempotencyKey });
  if (existing) {
    logger.info('Duplicate payment.failed webhook ignored', { paymentId: paymentData.id });
    return { handled: true, duplicate: true };
  }

  const payment = await Payment.findOne({ providerOrderId: paymentData.order_id });
  if (!payment) {
    logger.warn('Payment not found for failed event', { orderId: paymentData.order_id });
    return { handled: false, reason: 'payment_not_found' };
  }

  await Payment.findByIdAndUpdate(payment._id, {
    $set: {
      status: 'failed',
      webhookReceivedAt: new Date(),
      idempotencyKey,
    },
  });

  await Order.findOneAndUpdate(
    { razorpayOrderId: paymentData.order_id },
    { $set: { paymentStatus: 'failed' } }
  );

  logger.info('Payment failed processed', { paymentId: paymentData.id, orderId: paymentData.order_id });
  return { handled: true };
}

async function handleRefundCreated(refundData) {
  const idempotencyKey = `refund_created_${refundData.id}`;
  const existing = await Payment.findOne({ idempotencyKey });
  if (existing) {
    logger.info('Duplicate refund.created webhook ignored', { refundId: refundData.id });
    return { handled: true, duplicate: true };
  }

  const payment = await Payment.findOne({ providerPaymentId: refundData.payment_id });
  if (!payment) {
    logger.warn('Payment not found for refund event', { paymentId: refundData.payment_id });
    return { handled: false, reason: 'payment_not_found' };
  }

  await Payment.findByIdAndUpdate(payment._id, {
    $set: {
      refundId: refundData.id,
      refundAmount: refundData.amount / 100,
      refundStatus: 'pending',
      refundedAt: new Date(),
      idempotencyKey,
    },
  });

  logger.info('Refund created processed', { refundId: refundData.id, paymentId: refundData.payment_id });
  return { handled: true };
}

async function handleRefundProcessed(refundData) {
  const idempotencyKey = `refund_processed_${refundData.id}`;
  const existing = await Payment.findOne({ idempotencyKey });
  if (existing) {
    logger.info('Duplicate refund.processed webhook ignored', { refundId: refundData.id });
    return { handled: true, duplicate: true };
  }

  const payment = await Payment.findOne({ providerPaymentId: refundData.payment_id });
  if (!payment) {
    logger.warn('Payment not found for refund processed event', { paymentId: refundData.payment_id });
    return { handled: false, reason: 'payment_not_found' };
  }

  const refundAmount = refundData.amount / 100;
  const isFullRefund = refundAmount >= payment.amount;

  await Payment.findByIdAndUpdate(payment._id, {
    $set: {
      refundStatus: 'processed',
      refundedAt: new Date(),
      status: isFullRefund ? 'refunded' : payment.status,
      idempotencyKey,
    },
  });

  const orderPaymentStatus = isFullRefund ? 'refunded' : 'partially_refunded';
  await Order.findByIdAndUpdate(payment.orderId, {
    $set: {
      paymentStatus: orderPaymentStatus,
      refundId: refundData.id,
      refundAmount,
    },
  });

  logger.info('Refund processed', { refundId: refundData.id, amount: refundAmount, fullRefund: isFullRefund });
  return { handled: true };
}

const EVENT_HANDLERS = {
  'payment.captured': handlePaymentCaptured,
  'payment.failed': handlePaymentFailed,
  'refund.created': handleRefundCreated,
  'refund.processed': handleRefundProcessed,
};

export async function handleRazorpayWebhook(req, res) {
  const signature = req.headers['x-razorpay-signature'];

  if (!signature) {
    logger.warn('Razorpay webhook missing signature');
    return res.status(400).json({ error: 'Missing webhook signature' });
  }

  if (!verifySignature(req.body, signature)) {
    logger.warn('Razorpay webhook signature verification failed');
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  const { event, payload } = req.body;
  logger.info('Razorpay webhook received', { event });

  const handler = EVENT_HANDLERS[event];
  if (!handler) {
    logger.info('Unhandled Razorpay webhook event', { event });
    return res.status(200).json({ received: true, event });
  }

  const entityData = payload?.payment?.entity || payload?.refund?.entity;
  if (!entityData) {
    logger.warn('Razorpay webhook missing payload entity', { event });
    return res.status(400).json({ error: 'Invalid payload' });
  }

  try {
    const result = await handler(entityData);
    return res.status(200).json({ received: true, event, ...result });
  } catch (error) {
    logger.error('Razorpay webhook handler error', { event, error: error.message, stack: error.stack });
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
