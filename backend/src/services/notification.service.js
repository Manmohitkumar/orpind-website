import notificationRepository from '../repositories/notification.repository.js';
import { logger } from '../config/logger.js';

class NotificationService {
  async createNotification({ userId, type, title, message, data, channels = {} }) {
    const notification = await notificationRepository.model.create({
      userId, type, title, message, data,
      channels: { inApp: { sent: true, read: false }, email: channels.email || {}, sms: channels.sms || {}, whatsapp: channels.whatsapp || {} },
    });
    return notification;
  }

  async getNotifications(userId, { page = 1, limit = 20, type } = {}) {
    const filter = { userId, isDeleted: { $ne: true } };
    if (type) filter.type = type;
    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
      notificationRepository.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      notificationRepository.model.countDocuments(filter),
    ]);
    return { notifications, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async markAsRead(id, userId) {
    return notificationRepository.model.findOneAndUpdate({ _id: id, userId }, { isRead: true, readAt: new Date(), 'channels.inApp.read': true }, { new: true });
  }

  async markAllAsRead(userId) {
    return notificationRepository.model.updateMany({ userId, isRead: false }, { isRead: true, readAt: new Date(), 'channels.inApp.read': true });
  }

  async getUnreadCount(userId) {
    return notificationRepository.model.countDocuments({ userId, isRead: false, isDeleted: { $ne: true } });
  }

  async deleteNotification(id, userId) {
    return notificationRepository.model.findOneAndUpdate({ _id: id, userId }, { isDeleted: true }, { new: true });
  }

  async sendOrderUpdate(order, status) {
    const messages = {
      confirmed: { title: 'Order Confirmed', message: `Your order ${order.orderNumber} has been confirmed.` },
      shipped: { title: 'Order Shipped', message: `Your order ${order.orderNumber} has been shipped. Track: ${order.trackingNumber}` },
      delivered: { title: 'Order Delivered', message: `Your order ${order.orderNumber} has been delivered.` },
      cancelled: { title: 'Order Cancelled', message: `Your order ${order.orderNumber} has been cancelled.` },
    };
    const msg = messages[status] || { title: 'Order Update', message: `Your order ${order.orderNumber} status: ${status}` };
    return this.createNotification({ userId: order.userId, type: 'order_update', ...msg, data: { orderId: order._id, orderNumber: order.orderNumber, status } });
  }

  async sendPromo(userId, title, message, data) {
    return this.createNotification({ userId, type: 'promo', title, message, data });
  }

  async getAllNotifications({ page = 1, limit = 20, type, isRead } = {}) {
    const filter = { isDeleted: { $ne: true } };
    if (type) filter.type = type;
    if (isRead !== undefined) filter.isRead = isRead;
    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
      notificationRepository.model.find(filter).populate('userId', 'firstName lastName').sort({ createdAt: -1 }).skip(skip).limit(limit),
      notificationRepository.model.countDocuments(filter),
    ]);
    return { notifications, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async deleteOld(days = 90) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return notificationRepository.model.deleteMany({ createdAt: { $lt: cutoff } });
  }
}

export default new NotificationService();
