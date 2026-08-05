import orderRepository from '../repositories/order.repository.js';
import productRepository from '../repositories/product.repository.js';
import userRepository from '../repositories/user.repository.js';
import couponRepository from '../repositories/coupon.repository.js';

class ReportService {
  async getSalesReport(startDate, endDate, groupBy = 'day') {
    const match = { status: { $nin: ['cancelled', 'failed'] } };
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }
    const groupId = groupBy === 'day' ? { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
      : groupBy === 'month' ? { $dateToString: { format: '%Y-%m', date: '$createdAt' } }
      : { $dateToString: { format: '%Y', date: '$createdAt' } };
    return orderRepository.model.aggregate([
      { $match: match },
      { $group: { _id: groupId, revenue: { $sum: '$total' }, orders: { $sum: 1 }, avgOrderValue: { $avg: '$total' }, itemsSold: { $sum: { $size: '$items' } } } },
      { $sort: { _id: 1 } },
    ]);
  }

  async getProductReport() {
    const [topSellers, worstPerformers, categoryBreakdown] = await Promise.all([
      productRepository.model.find({ isDeleted: { $ne: true } }).sort({ totalSold: -1 }).limit(10).select('name slug totalSold averageRating price'),
      productRepository.model.find({ isDeleted: { $ne: true }, totalSold: { $gt: 0 } }).sort({ totalSold: 1 }).limit(10).select('name slug totalSold averageRating price'),
      productRepository.model.aggregate([{ $match: { isDeleted: { $ne: true }, isActive: true } }, { $group: { _id: '$categoryId', products: { $sum: 1 }, totalSold: { $sum: '$totalSold' }, revenue: { $sum: { $multiply: ['$price', '$totalSold'] } } } }, { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category', pipeline: [{ $project: { name: 1, slug: 1 } }] } }, { $unwind: '$category' }, { $sort: { revenue: -1 } }]),
    ]);
    return { topSellers, worstPerformers, categoryBreakdown };
  }

  async getCustomerReport() {
    const now = new Date();
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const [newCustomers, returningCustomers, topSpenders] = await Promise.all([
      userRepository.model.countDocuments({ createdAt: { $gte: monthAgo }, isDeleted: { $ne: true } }),
      orderRepository.model.aggregate([{ $group: { _id: '$userId', orderCount: { $sum: 1 } } }, { $match: { orderCount: { $gt: 1 } } }, { $count: 'count' }]),
      orderRepository.model.aggregate([{ $group: { _id: '$userId', totalSpent: { $sum: '$total' }, orderCount: { $sum: 1 } } }, { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user', pipeline: [{ $project: { firstName: 1, lastName: 1, email: 1 } }] } }, { $unwind: '$user' }, { $sort: { totalSpent: -1 } }, { $limit: 10 }]),
    ]);
    return { newCustomers, returningCustomers: returningCustomers[0]?.count || 0, topSpenders };
  }

  async getCouponReport() {
    return couponRepository.model.find({ isDeleted: { $ne: true } }).select('code discountType discountValue usedCount usageLimit isActive').sort({ usedCount: -1 });
  }

  async exportCSV(data, columns) {
    const header = columns.join(',');
    const rows = data.map(row => columns.map(col => {
      const val = typeof row[col] === 'string' && row[col].includes(',') ? `"${row[col]}"` : row[col];
      return val ?? '';
    }).join(','));
    return [header, ...rows].join('\n');
  }
}

export default new ReportService();
