import eventBus from './eventBus.js';
import emailService from '../services/email.service.js';
import notificationService from '../services/notification.service.js';
import smsService from '../services/sms.service.js';
import whatsappService from '../services/whatsapp.service.js';
import logger from '../config/logger.js';

const EVENTS = {
  ORDER_CREATED: 'order.created',
  ORDER_CONFIRMED: 'order.confirmed',
  ORDER_SHIPPED: 'order.shipped',
  ORDER_DELIVERED: 'order.delivered',
  ORDER_CANCELLED: 'order.cancelled',
  PAYMENT_SUCCESS: 'payment.success',
  PAYMENT_FAILED: 'payment.failed',
  PAYMENT_REFUNDED: 'payment.refunded',
  USER_REGISTERED: 'user.registered',
  USER_LOGGED_IN: 'user.logged_in',
  PRODUCT_VIEWED: 'product.viewed',
  CART_UPDATED: 'cart.updated',
  REVIEW_CREATED: 'review.created',
  COUPON_APPLIED: 'coupon.applied',
  INVENTORY_LOW: 'inventory.low',
  IN_STOCK: 'inventory.in_stock',
};

eventBus.on(EVENTS.USER_REGISTERED, async (data) => {
  try {
    await emailService.sendWelcomeEmail(data.user);
    await notificationService.createNotification({
      userId: data.user._id,
      type: 'welcome',
      title: 'Welcome to Orpind!',
      message: `Hi ${data.user.firstName}, welcome to Orpind! Explore our range of organic spices from Punjab.`,
    });
  } catch (error) {
    logger.error('Failed to process user.registered event', { error: error.message });
  }
});

eventBus.on(EVENTS.ORDER_CREATED, async (data) => {
  try {
    const { order, user } = data;
    await emailService.sendOrderConfirmation(user, order);
    await notificationService.sendOrderUpdate(order, 'created');
  } catch (error) {
    logger.error('Failed to process order.created event', { error: error.message });
  }
});

eventBus.on(EVENTS.ORDER_CONFIRMED, async (data) => {
  try {
    const { order, user } = data;
    await notificationService.sendOrderUpdate(order, 'confirmed');
  } catch (error) {
    logger.error('Failed to process order.confirmed event', { error: error.message });
  }
});

eventBus.on(EVENTS.ORDER_SHIPPED, async (data) => {
  try {
    const { order, user } = data;
    await emailService.sendOrderShipped(user, order);
    await notificationService.sendOrderUpdate(order, 'shipped');
    if (user.phone) {
      await smsService.sendOrderUpdateSMS(user.phone, order.orderNumber, 'shipped');
    }
    if (user.phone) {
      await whatsappService.sendOrderUpdateWhatsApp(user.phone, order.orderNumber, 'shipped');
    }
  } catch (error) {
    logger.error('Failed to process order.shipped event', { error: error.message });
  }
});

eventBus.on(EVENTS.ORDER_DELIVERED, async (data) => {
  try {
    const { order, user } = data;
    await emailService.sendOrderDelivered(user, order);
    await notificationService.sendOrderUpdate(order, 'delivered');
    if (user.phone) {
      await smsService.sendOrderUpdateSMS(user.phone, order.orderNumber, 'delivered');
    }
  } catch (error) {
    logger.error('Failed to process order.delivered event', { error: error.message });
  }
});

eventBus.on(EVENTS.ORDER_CANCELLED, async (data) => {
  try {
    const { order, user } = data;
    await notificationService.sendOrderUpdate(order, 'cancelled');
  } catch (error) {
    logger.error('Failed to process order.cancelled event', { error: error.message });
  }
});

eventBus.on(EVENTS.PAYMENT_SUCCESS, async (data) => {
  try {
    const { order, user, payment } = data;
    await notificationService.createNotification({
      userId: user._id,
      type: 'payment',
      title: 'Payment Received',
      message: `Payment of ₹${payment.amount} received for order ${order.orderNumber}.`,
      data: { orderId: order._id, paymentId: payment._id },
    });
  } catch (error) {
    logger.error('Failed to process payment.success event', { error: error.message });
  }
});

eventBus.on(EVENTS.PAYMENT_FAILED, async (data) => {
  try {
    const { user, order } = data;
    await notificationService.createNotification({
      userId: user._id,
      type: 'payment_failed',
      title: 'Payment Failed',
      message: `Payment for order ${order.orderNumber} failed. Please try again.`,
      data: { orderId: order._id },
    });
  } catch (error) {
    logger.error('Failed to process payment.failed event', { error: error.message });
  }
});

eventBus.on(EVENTS.PAYMENT_REFUNDED, async (data) => {
  try {
    const { user, order, amount } = data;
    await emailService.sendRefundConfirmation(user, order, amount);
    await notificationService.createNotification({
      userId: user._id,
      type: 'refund',
      title: 'Refund Processed',
      message: `Your refund of ₹${amount} for order ${order.orderNumber} has been processed.`,
      data: { orderId: order._id },
    });
  } catch (error) {
    logger.error('Failed to process payment.refunded event', { error: error.message });
  }
});

eventBus.on(EVENTS.PRODUCT_VIEWED, async (data) => {
  try {
    const Product = (await import('../models/product.model.js')).default;
    await Product.findByIdAndUpdate(data.productId, { $inc: { viewCount: 1 } });
  } catch (error) {
    logger.error('Failed to process product.viewed event', { error: error.message });
  }
});

eventBus.on(EVENTS.INVENTORY_LOW, async (data) => {
  try {
    const { product, quantity, threshold } = data;
    await notificationService.createNotification({
      userId: data.adminId || null,
      type: 'inventory_alert',
      title: 'Low Stock Alert',
      message: `${product.name} is low on stock. Current: ${quantity}, Threshold: ${threshold}`,
      data: { productId: product._id, quantity, threshold },
    });
  } catch (error) {
    logger.error('Failed to process inventory.low event', { error: error.message });
  }
});

eventBus.on(EVENTS.REVIEW_CREATED, async (data) => {
  try {
    const { review, user } = data;
    await notificationService.createNotification({
      userId: user._id,
      type: 'review',
      title: 'Review Submitted',
      message: 'Your review has been submitted and is pending approval.',
      data: { reviewId: review._id, productId: review.productId },
    });
  } catch (error) {
    logger.error('Failed to process review.created event', { error: error.message });
  }
});

export { eventBus, EVENTS };
export default eventBus;
