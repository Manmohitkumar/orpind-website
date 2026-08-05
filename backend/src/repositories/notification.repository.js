import BaseRepository from './base.repository.js';
import Notification from '../models/notification.model.js';

class NotificationRepository extends BaseRepository {
  constructor() {
    super(Notification);
  }

  async findByUser(userId, { page = 1, limit = 20, type } = {}) {
    const filter = { userId, isDeleted: { $ne: true } };
    if (type) filter.type = type;
    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
      this.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { notifications, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async markAsRead(id) {
    return this.model.findByIdAndUpdate(id, { isRead: true, readAt: new Date(), 'channels.inApp.read': true, 'channels.inApp.readAt': new Date() }, { new: true });
  }

  async markAllAsRead(userId) {
    return this.model.updateMany({ userId, isRead: false }, { isRead: true, readAt: new Date(), 'channels.inApp.read': true, 'channels.inApp.readAt': new Date() });
  }

  async getUnreadCount(userId) {
    return this.model.countDocuments({ userId, isRead: false, isDeleted: { $ne: true } });
  }

  async deleteOld(days = 90) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return this.model.deleteMany({ createdAt: { $lt: cutoff } });
  }

  async findAll({ page = 1, limit = 20, type, isRead } = {}) {
    const filter = { isDeleted: { $ne: true } };
    if (type) filter.type = type;
    if (isRead !== undefined) filter.isRead = isRead === 'true';
    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
      this.model.find(filter).populate('userId', 'firstName lastName email').sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { notifications, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

export default new NotificationRepository();
