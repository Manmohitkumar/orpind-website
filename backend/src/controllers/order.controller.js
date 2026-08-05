import orderService from '../services/order.service.js';

class OrderController {
  async createOrder(req, res, next) {
    try {
      const { items, addressId, paymentMethod, couponCode, isGift, giftMessage } = req.body;
      const data = await orderService.createOrder({ userId: req.user._id, items, shippingAddress: addressId, paymentMethod, couponCode, isGift, giftMessage });
      res.status(201).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getOrders(req, res, next) {
    try {
      const { status, page, limit } = req.query;
      const data = await orderService.getOrdersByUser(req.user._id, { status, page: parseInt(page) || 1, limit: parseInt(limit) || 20 });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req, res, next) {
    try {
      const data = await orderService.getOrderById(req.params.id, req.user._id);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async cancelOrder(req, res, next) {
    try {
      const { reason } = req.body;
      const data = await orderService.cancelOrder(req.params.id, req.user._id, reason);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async requestReturn(req, res, next) {
    try {
      const { reason } = req.body;
      const data = await orderService.requestReturn(req.params.id, req.user._id, reason);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async trackOrder(req, res, next) {
    try {
      const data = await orderService.getOrderTracking(req.params.id);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async guestTrackOrder(req, res, next) {
    try {
      const { orderNumber, email } = req.query;
      const data = await orderService.guestTrackOrder(orderNumber, email);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getOrderInvoice(req, res, next) {
    try {
      const data = await orderService.getOrderInvoice(req.params.id);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getAllOrders(req, res, next) {
    try {
      const { status, search, page, limit, startDate, endDate } = req.query;
      const data = await orderService.getAllOrders({ status, search, page, limit, startDate, endDate });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req, res, next) {
    try {
      const { status, note, trackingNumber } = req.body;
      const data = await orderService.updateOrderStatus(req.params.id, { status, note, trackingNumber });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }
}

const orderController = new OrderController();

export const {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  requestReturn,
  trackOrder,
  guestTrackOrder,
  getOrderInvoice,
  getAllOrders,
  updateOrderStatus,
} = orderController;

export default orderController;