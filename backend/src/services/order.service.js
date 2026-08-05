import orderRepository from '../repositories/order.repository.js';
import productRepository from '../repositories/product.repository.js';
import inventoryRepository from '../repositories/inventory.repository.js';
import couponRepository from '../repositories/coupon.repository.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { MESSAGES } from '../constants/messages.js';
import { STATUS_TRANSITIONS } from '../constants/orderStatuses.js';
import logger from '../config/logger.js';

class OrderService {
  async createOrder({ userId, guestEmail, items, shippingAddress, billingAddress, paymentMethod, couponCode, discount = 0, notes, isGift, giftMessage }) {
    if (!items || items.length === 0) {
      throw new AppError('Order must contain at least one item', 400);
    }

    const orderItems = [];
    let subtotal = 0;
    let totalTax = 0;

    for (const item of items) {
      const product = await productRepository.model.findById(item.productId);
      if (!product || product.isDeleted) {
        throw new AppError(`${MESSAGES.PRODUCT.NOT_FOUND}: ${item.productId}`, 404);
      }

      if (product.status !== 'active') {
        throw new AppError(`${product.name} is not available`, 400);
      }

      if (item.quantity < (product.minOrderQuantity || 1)) {
        throw new AppError(`Minimum order quantity for ${product.name} is ${product.minOrderQuantity || 1}`, 400);
      }

      if (product.maxOrderQuantity && item.quantity > product.maxOrderQuantity) {
        throw new AppError(`Maximum order quantity for ${product.name} is ${product.maxOrderQuantity}`, 400);
      }

      const available = await this.checkStock(item.productId, item.quantity);
      if (!available) {
        throw new AppError(`${MESSAGES.INVENTORY.INSUFFICIENT_STOCK}: ${product.name}`, 400);
      }

      const itemTotal = product.price * item.quantity;
      const itemTax = Math.round(itemTotal * (product.gstRate || 0) / 100 * 100) / 100;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        sku: product.sku,
        price: product.price,
        quantity: item.quantity,
        weight: product.weightInGrams,
        images: product.images && product.images.length > 0
          ? [{ url: product.images[0].url, publicId: product.images[0].publicId }]
          : [],
        itemTotal,
        tax: itemTax,
        hsnCode: product.hsnCode,
        gstRate: product.gstRate || 0,
      });

      subtotal += itemTotal;
      totalTax += itemTax;
    }

    const shippingCost = this.calculateShipping(subtotal);
    const total = subtotal - discount + shippingCost + totalTax;
    const orderNumber = await this.getNextOrderNumber();

    const order = await orderRepository.model.create({
      orderNumber,
      userId,
      guestEmail,
      status: 'pending',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      items: orderItems,
      subtotal,
      discount,
      couponCode,
      shippingCost,
      tax: totalTax,
      total: Math.round(total * 100) / 100,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      notes,
      isGift,
      giftMessage,
      statusHistory: [{ status: 'pending', timestamp: new Date(), note: 'Order placed' }],
    });

    for (const item of items) {
      await this.reserveStock(item.productId, item.quantity);
      await productRepository.model.findByIdAndUpdate(item.productId, { $inc: { totalSold: item.quantity } });
    }

    if (couponCode) {
      await couponRepository.model.findOneAndUpdate({ code: couponCode }, { $inc: { usedCount: 1 } });
    }

    logger.info('Order created', { orderId: order._id, orderNumber, userId, total: order.total });
    return order;
  }

  async getOrderById(orderId, userId) {
    const filter = { _id: orderId };
    if (userId) filter.userId = userId;

    const order = await orderRepository.model.findOne(filter).populate('userId', 'firstName lastName email phone');
    if (!order) {
      throw new AppError(MESSAGES.ORDER.NOT_FOUND, 404);
    }
    return order;
  }

  async getOrdersByUser(userId, { page = 1, limit = 20, status } = {}) {
    const filter = { userId };
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      orderRepository.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      orderRepository.model.countDocuments(filter),
    ]);

    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async cancelOrder(orderId, userId, reason) {
    const order = await orderRepository.model.findOne({ _id: orderId, userId });
    if (!order) {
      throw new AppError(MESSAGES.ORDER.NOT_FOUND, 404);
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      throw new AppError(MESSAGES.ORDER.CANNOT_CANCEL, 400);
    }

    for (const item of order.items) {
      await this.releaseStock(item.productId, item.quantity);
      await productRepository.model.findByIdAndUpdate(item.productId, { $inc: { totalSold: -item.quantity } });
    }

    if (order.couponCode) {
      await couponRepository.model.findOneAndUpdate({ code: order.couponCode, usedCount: { $gt: 0 } }, { $inc: { usedCount: -1 } });
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelReason = reason;
    order.statusHistory.push({ status: 'cancelled', timestamp: new Date(), note: reason || 'Cancelled by customer' });
    await order.save();

    logger.info('Order cancelled', { orderId, userId, reason });
    return order;
  }

  async requestReturn(orderId, userId, reason) {
    const order = await orderRepository.model.findOne({ _id: orderId, userId });
    if (!order) {
      throw new AppError(MESSAGES.ORDER.NOT_FOUND, 404);
    }

    if (order.status !== 'delivered') {
      throw new AppError('Return can only be requested for delivered orders', 400);
    }

    const deliveredDate = order.deliveredAt ? new Date(order.deliveredAt) : new Date();
    const returnDeadline = new Date(deliveredDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    if (new Date() > returnDeadline) {
      throw new AppError(MESSAGES.ORDER.RETURN_PERIOD_EXPIRED || 'Return period has expired', 400);
    }

    order.status = 'returned';
    order.statusHistory.push({ status: 'returned', timestamp: new Date(), note: reason || 'Return requested' });
    await order.save();

    for (const item of order.items) {
      await this.releaseStock(item.productId, item.quantity);
    }

    logger.info('Return requested', { orderId, userId });
    return order;
  }

  async getOrderTracking(orderId) {
    const order = await orderRepository.model.findById(orderId).select('orderNumber status trackingNumber carrier shippedAt deliveredAt statusHistory');
    if (!order) {
      throw new AppError(MESSAGES.ORDER.NOT_FOUND, 404);
    }
    return {
      orderNumber: order.orderNumber,
      status: order.status,
      trackingNumber: order.trackingNumber,
      carrier: order.carrier,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt,
      history: order.statusHistory,
    };
  }

  async getOrderInvoice(orderId) {
    const order = await orderRepository.model.findById(orderId).populate('userId', 'firstName lastName email');
    if (!order) {
      throw new AppError(MESSAGES.ORDER.NOT_FOUND, 404);
    }
    return order;
  }

  async guestTrackOrder(orderNumber, email) {
    const order = await orderRepository.model.findOne({ orderNumber, guestEmail: email });
    if (!order) {
      throw new AppError(MESSAGES.ORDER.NOT_FOUND, 404);
    }
    return {
      orderNumber: order.orderNumber,
      status: order.status,
      items: order.items,
      total: order.total,
      trackingNumber: order.trackingNumber,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt,
    };
  }

  async getNextOrderNumber() {
    const last = await orderRepository.model.findOne({}).sort({ createdAt: -1 }).lean();
    let nextNumber = 1;
    if (last && last.orderNumber) {
      const match = last.orderNumber.match(/ORD-(\d+)/);
      if (match) nextNumber = parseInt(match[1], 10) + 1;
    }
    return `ORD-${String(nextNumber).padStart(6, '0')}`;
  }

  async getAllOrders({ status, search, startDate, endDate, page = 1, limit = 20, paymentStatus }) {
    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { guestEmail: { $regex: search, $options: 'i' } },
      ];
    }
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      orderRepository.model.find(filter).populate('userId', 'firstName lastName email').sort({ createdAt: -1 }).skip(skip).limit(limit),
      orderRepository.model.countDocuments(filter),
    ]);

    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateOrderStatus(orderId, { status, note, updatedBy, trackingNumber, carrier }) {
    const order = await orderRepository.model.findById(orderId);
    if (!order) {
      throw new AppError(MESSAGES.ORDER.NOT_FOUND, 404);
    }

    const allowedTransitions = STATUS_TRANSITIONS[order.status] || [];
    const normalizedStatus = status.toLowerCase();
    if (!allowedTransitions.includes(normalizedStatus) && !allowedTransitions.includes(status)) {
      throw new AppError(`Cannot transition from ${order.status} to ${status}`, 400);
    }

    order.status = normalizedStatus;
    order.statusHistory.push({
      status: normalizedStatus,
      timestamp: new Date(),
      note: note || `Status updated to ${normalizedStatus}`,
      updatedBy,
    });

    if (normalizedStatus === 'shipped') {
      order.shippedAt = new Date();
      if (trackingNumber) order.trackingNumber = trackingNumber;
      if (carrier) order.carrier = carrier;
    }
    if (normalizedStatus === 'delivered') {
      order.deliveredAt = new Date();
      order.paymentStatus = 'paid';
    }
    if (normalizedStatus === 'cancelled') {
      order.cancelledAt = new Date();
    }

    await order.save();

    logger.info('Order status updated', { orderId, status: normalizedStatus, updatedBy });
    return order;
  }

  async checkStock(productId, quantity) {
    const inventories = await inventoryRepository.model.find({ productId, isDeleted: false });
    if (inventories.length === 0) {
      const product = await productRepository.model.findById(productId);
      return product && product.status === 'active';
    }
    const totalAvailable = inventories.reduce((sum, inv) => sum + (inv.quantity - (inv.reservedQuantity || 0)), 0);
    return totalAvailable >= quantity;
  }

  async reserveStock(productId, quantity) {
    const inventories = await inventoryRepository.model.find({ productId, isDeleted: false }).sort({ quantity: -1 });
    let remaining = quantity;

    for (const inv of inventories) {
      const available = inv.quantity - (inv.reservedQuantity || 0);
      if (available >= remaining) {
        inv.reservedQuantity = (inv.reservedQuantity || 0) + remaining;
        await inv.save();
        remaining = 0;
        break;
      } else if (available > 0) {
        inv.reservedQuantity = (inv.reservedQuantity || 0) + available;
        await inv.save();
        remaining -= available;
      }
    }

    return remaining === 0;
  }

  async releaseStock(productId, quantity) {
    const inventories = await inventoryRepository.model.find({ productId, isDeleted: false }).sort({ reservedQuantity: -1 });
    let remaining = quantity;

    for (const inv of inventories) {
      if (remaining <= 0) break;
      const toRelease = Math.min(inv.reservedQuantity || 0, remaining);
      if (toRelease > 0) {
        inv.reservedQuantity = (inv.reservedQuantity || 0) - toRelease;
        await inv.save();
        remaining -= toRelease;
      }
    }
  }

  async getOrderStats() {
    const [totalOrders, pendingOrders, deliveredOrders, cancelledOrders, totalRevenue] = await Promise.all([
      orderRepository.model.countDocuments({}),
      orderRepository.model.countDocuments({ status: 'pending' }),
      orderRepository.model.countDocuments({ status: 'delivered' }),
      orderRepository.model.countDocuments({ status: 'cancelled' }),
      orderRepository.model.aggregate([
        { $match: { status: { $nin: ['cancelled', 'failed'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
    ]);
    return {
      totalOrders,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
    };
  }

  async getOrders(user, { status, page = 1, limit = 20 } = {}) {
    const userId = user._id || user;
    return this.getOrdersByUser(userId, { status, page, limit });
  }

  async trackOrder(user, orderId) {
    return this.getOrderTracking(orderId);
  }

  calculateShipping(subtotal) {
    if (subtotal >= 999) return 0;
    return 99;
  }
}

export default new OrderService();
