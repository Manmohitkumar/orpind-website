import BaseRepository from './base.repository.js';
import Order from '../models/order.model.js';

class OrderRepository extends BaseRepository {
  constructor() {
    super(Order);
  }

  async findByOrderNumber(orderNumber) {
    return this.findOne({ orderNumber });
  }

  async findByUser(userId, { page = 1, limit = 10, status } = {}) {
    const filter = { user: userId, isDeleted: false };
    if (status) filter.status = status;
    return this.paginate(filter, { page, limit, sort: { createdAt: -1 } });
  }

  async updateStatus(orderId, status, note) {
    const update = { status, statusHistory: { status, timestamp: new Date(), note: note || '' } };
    return this.model.findByIdAndUpdate(orderId, { $set: { status }, $push: { statusHistory: update.statusHistory } }, { new: true });
  }

  async getNextOrderNumber() {
    const last = await this.model.findOne({}).sort({ createdAt: -1 }).select('orderNumber');
    const num = last ? parseInt(last.orderNumber.replace('ORD-', ''), 10) + 1 : 1001;
    return `ORD-${num}`;
  }

  async getSalesReport(startDate, endDate) {
    return this.model.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate }, status: { $nin: ['cancelled'] }, isDeleted: { $ne: true } } },
      { $group: { _id: null, totalSales: { $sum: '$total' }, totalOrders: { $sum: 1 }, averageOrderValue: { $avg: '$total' } } },
    ]);
  }

  async getUserOrders(userId) {
    return this.model.find({ user: userId, isDeleted: { $ne: true } }).sort({ createdAt: -1 });
  }

  async cancelOrder(orderId, reason) {
    return this.model.findByIdAndUpdate(orderId, { $set: { status: 'cancelled', cancellationReason: reason }, $push: { statusHistory: { status: 'cancelled', timestamp: new Date(), note: reason } } }, { new: true });
  }
}

export default new OrderRepository();
