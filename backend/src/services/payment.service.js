import crypto from 'crypto';
import Razorpay from 'razorpay';
import Stripe from 'stripe';
import paymentRepository from '../repositories/payment.repository.js';
import orderRepository from '../repositories/order.repository.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { MESSAGES } from '../constants/messages.js';
import config from '../config/index.js';
import logger from '../config/logger.js';

let razorpay;
let stripe;

function getRazorpay() {
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: config.razorpayKeyId,
      key_secret: config.razorpayKeySecret,
    });
  }
  return razorpay;
}

class PaymentService {
  async createRazorpayOrder({ amount, currency = 'INR', receipt, userId }) {
    if (!amount || amount <= 0) {
      throw new AppError(MESSAGES.PAYMENT.INVALID_AMOUNT, 400);
    }

    const amountInPaise = Math.round(amount * 100);

    try {
      const razorpayOrder = await getRazorpay().orders.create({
        amount: amountInPaise,
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
      });

      const payment = await paymentRepository.model.create({
        orderId: receipt,
        userId,
        provider: 'razorpay',
        providerOrderId: razorpayOrder.id,
        amount: amount,
        currency,
        status: 'created',
      });

      logger.info('Razorpay order created', { razorpayOrderId: razorpayOrder.id, amount });

      return {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        paymentId: payment._id,
        keyId: config.razorpayKeyId,
      };
    } catch (err) {
      logger.error('Razorpay order creation failed', { error: err.message });
      throw new AppError(MESSAGES.PAYMENT.RAZORPAY_ERROR, 500);
    }
  }

  async verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId }) {
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', config.razorpayKeySecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      throw new AppError(MESSAGES.PAYMENT.WEBHOOK_INVALID, 400);
    }

    const payment = await paymentRepository.model.findOne({ providerOrderId: razorpay_order_id });
    if (payment) {
      payment.providerPaymentId = razorpay_payment_id;
      payment.status = 'captured';
      payment.metadata = new Map([['signature', razorpay_signature]]);
      await payment.save();
    }

    if (orderId) {
      await orderRepository.model.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid',
        paymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
      });
    }

    logger.info('Payment verified', { razorpay_payment_id, orderId });
    return { verified: true, paymentId: razorpay_payment_id };
  }

  async createRefund({ paymentId, amount, reason }) {
    const payment = await paymentRepository.model.findById(paymentId);
    if (!payment) {
      throw new AppError(MESSAGES.PAYMENT.TRANSACTION_NOT_FOUND, 404);
    }

    if (payment.status === 'refunded') {
      throw new AppError(MESSAGES.PAYMENT.ALREADY_REFUNDED, 400);
    }

    const refundAmount = amount || payment.amount;
    if (refundAmount > payment.amount) {
      throw new AppError(MESSAGES.PAYMENT.INVALID_AMOUNT, 400);
    }

    try {
      const refund = await getRazorpay().payments.refund(payment.providerPaymentId, {
        amount: Math.round(refundAmount * 100),
        notes: { reason: reason || 'Refund requested' },
      });

      payment.refundAmount = refundAmount;
      payment.refundId = refund.id;
      payment.refundStatus = 'processed';
      payment.refundReason = reason;
      payment.refundedAt = new Date();
      payment.status = refundAmount === payment.amount ? 'refunded' : 'captured';
      await payment.save();

      const orderStatus = refundAmount === payment.amount ? 'refunded' : 'partially_refunded';
      await orderRepository.model.findByIdAndUpdate(payment.orderId, {
        paymentStatus: orderStatus,
        refundId: refund.id,
        refundAmount,
        refundReason: reason,
      });

      logger.info('Refund created', { paymentId, refundId: refund.id, amount: refundAmount });
      return { refundId: refund.id, amount: refundAmount, status: 'processed' };
    } catch (err) {
      logger.error('Refund failed', { error: err.message, paymentId });
      throw new AppError(MESSAGES.PAYMENT.REFUND_FAILED, 500);
    }
  }

  async handleWebhook(body, signature) {
    const expectedSignature = crypto
      .createHmac('sha256', config.razorpayWebhookSecret)
      .update(JSON.stringify(body))
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new AppError(MESSAGES.PAYMENT.WEBHOOK_INVALID, 401);
    }

    const event = body.event;
    const payload = body.payload;

    logger.info('Webhook received', { event });

    switch (event) {
      case 'payment.captured': {
        const paymentData = payload.payment?.entity;
        if (paymentData) {
          const payment = await paymentRepository.model.findOne({ providerOrderId: paymentData.order_id });
          if (payment) {
            payment.providerPaymentId = paymentData.id;
            payment.status = 'captured';
            payment.method = paymentData.method;
            payment.webhookReceivedAt = new Date();
            if (paymentData.card) {
              payment.cardLast4 = paymentData.card.last4;
            }
            if (paymentData.vpa) {
              payment.upiId = paymentData.vpa;
            }
            await payment.save();
          }

          await orderRepository.model.findOneAndUpdate(
            { razorpayOrderId: paymentData.order_id },
            { paymentStatus: 'paid', paymentId: paymentData.id }
          );
        }
        break;
      }
      case 'payment.failed': {
        const paymentData = payload.payment?.entity;
        if (paymentData) {
          const payment = await paymentRepository.model.findOne({ providerOrderId: paymentData.order_id });
          if (payment) {
            payment.status = 'failed';
            payment.webhookReceivedAt = new Date();
            await payment.save();
          }

          await orderRepository.model.findOneAndUpdate(
            { razorpayOrderId: paymentData.order_id },
            { paymentStatus: 'failed' }
          );
        }
        break;
      }
      case 'refund.created': {
        const refundData = payload.refund?.entity;
        if (refundData) {
          const payment = await paymentRepository.model.findOne({ providerPaymentId: refundData.payment_id });
          if (payment) {
            payment.refundId = refundData.id;
            payment.refundAmount = refundData.amount / 100;
            payment.refundStatus = refundData.status === 'processed' ? 'processed' : 'pending';
            payment.refundedAt = new Date();
            await payment.save();
          }
        }
        break;
      }
      default:
        logger.info('Unhandled webhook event', { event });
    }

    return { received: true };
  }

  async handleRazorpayWebhook(body, signature) {
    return this.handleWebhook(body, signature);
  }

  async handleStripeWebhook(body, signature) {
    try {
      if (!stripe) {
        stripe = new Stripe(config.stripeSecretKey);
      }
      const event = stripe.webhooks.constructEvent(body, signature, config.stripeWebhookSecret);

      logger.info('Stripe webhook received', { event: event.type });

      switch (event.type) {
        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object;
          const orderId = paymentIntent.metadata?.orderId;

          if (orderId) {
            await orderRepository.model.findByIdAndUpdate(orderId, {
              paymentStatus: 'paid',
              paymentId: paymentIntent.id,
            });

            const payment = await paymentRepository.model.findOne({ providerPaymentId: paymentIntent.id });
            if (payment) {
              payment.status = 'captured';
              payment.webhookReceivedAt = new Date();
              await payment.save();
            }
          }
          break;
        }
        case 'payment_intent.payment_failed': {
          const paymentIntent = event.data.object;
          const orderId = paymentIntent.metadata?.orderId;

          if (orderId) {
            await orderRepository.model.findByIdAndUpdate(orderId, {
              paymentStatus: 'failed',
            });
          }
          break;
        }
        case 'charge.refunded': {
          const charge = event.data.object;
          const payment = await paymentRepository.model.findOne({ providerPaymentId: charge.payment_intent });
          if (payment) {
            payment.refundId = charge.refund?.id;
            payment.refundAmount = charge.amount_refunded / 100;
            payment.refundStatus = 'processed';
            payment.refundedAt = new Date();
            payment.status = charge.amount_refunded >= charge.amount ? 'refunded' : 'captured';
            await payment.save();

            await orderRepository.model.findByIdAndUpdate(payment.orderId, {
              paymentStatus: charge.amount_refunded >= charge.amount ? 'refunded' : 'partially_refunded',
            });
          }
          break;
        }
        default:
          logger.info('Unhandled Stripe webhook event', { event: event.type });
      }

      return { received: true };
    } catch (err) {
      logger.error('Stripe webhook error', { error: err.message });
      throw new AppError(MESSAGES.PAYMENT.WEBHOOK_INVALID, 401);
    }
  }

  async getPaymentByOrder(orderId) {
    const payments = await paymentRepository.model.find({ orderId }).sort({ createdAt: -1 });
    return payments;
  }

  async getPaymentHistory(userId, { page = 1, limit = 20 } = {}) {
    const filter = {};
    if (userId) filter.userId = userId;

    const skip = (page - 1) * limit;
    const [payments, total] = await Promise.all([
      paymentRepository.model.find(filter).populate('orderId', 'orderNumber total').sort({ createdAt: -1 }).skip(skip).limit(limit),
      paymentRepository.model.countDocuments(filter),
    ]);

    return {
      payments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export default new PaymentService();
