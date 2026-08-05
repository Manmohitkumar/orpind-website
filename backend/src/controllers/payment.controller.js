import paymentService from '../services/payment.service.js';

class PaymentController {
  async createRazorpayOrder(req, res, next) {
    try {
      const { amount, currency, receipt } = req.body;
      const data = await paymentService.createRazorpayOrder({ amount, currency, receipt, userId: req.user._id });
      res.status(201).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async verifyPayment(req, res, next) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
      const data = await paymentService.verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async createRefund(req, res, next) {
    try {
      const { amount, reason } = req.body;
      const data = await paymentService.createRefund({ paymentId: req.params.orderId, amount, reason });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getPaymentHistory(req, res, next) {
    try {
      const data = await paymentService.getPaymentHistory(req.user);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async handleRazorpayWebhook(req, res, next) {
    try {
      const signature = req.headers['x-razorpay-signature'];
      const data = await paymentService.handleRazorpayWebhook(req.body, signature);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async handleStripeWebhook(req, res, next) {
    try {
      const signature = req.headers['stripe-signature'];
      const data = await paymentService.handleStripeWebhook(req.body, signature);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getPaymentHistory(req, res, next) {
    try {
      const data = await paymentService.getPaymentHistory(req.user._id);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }
}

const paymentController = new PaymentController();

export const {
  createRazorpayOrder,
  verifyPayment,
  createRefund,
  getPaymentHistory,
  handleRazorpayWebhook,
  handleStripeWebhook,
} = paymentController;

export default paymentController;