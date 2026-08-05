import orderRepository from '../repositories/order.repository.js';
import productRepository from '../repositories/product.repository.js';
import userRepository from '../repositories/user.repository.js';
import { logger } from '../config/logger.js';

class AnalyticsService {
  async trackPageView(data) { logger.info('Page view tracked', data); return { tracked: true }; }

  async trackProductView(productId, userId) {
    await productRepository.model.findByIdAndUpdate(productId, { $inc: { viewCount: 1 } });
    logger.info('Product view tracked', { productId, userId });
    return { tracked: true };
  }

  async trackSearch(query, resultsCount, userId) { logger.info('Search tracked', { query, resultsCount, userId }); return { tracked: true }; }

  async trackCartEvent(event, data) { logger.info('Cart event tracked', { event, ...data }); return { tracked: true }; }

  async trackOrderEvent(event, data) { logger.info('Order event tracked', { event, ...data }); return { tracked: true }; }

  async getDashboardStats() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const [totalRevenue, todayOrders, weekRevenue, monthRevenue, totalUsers, totalProducts, recentOrders, pendingOrders] = await Promise.all([
      orderRepository.model.aggregate([{ $match: { status: { $nin: ['cancelled', 'failed'] } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      orderRepository.model.countDocuments({ createdAt: { $gte: todayStart } }),
      orderRepository.model.aggregate([{ $match: { createdAt: { $gte: weekAgo }, status: { $nin: ['cancelled', 'failed'] } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      orderRepository.model.aggregate([{ $match: { createdAt: { $gte: monthAgo }, status: { $nin: ['cancelled', 'failed'] } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      userRepository.model.countDocuments({ isDeleted: { $ne: true } }),
      productRepository.model.countDocuments({ isDeleted: { $ne: true }, isActive: true }),
      orderRepository.model.find({}).sort({ createdAt: -1 }).limit(5).select('orderNumber total status createdAt'),
      orderRepository.model.countDocuments({ status: 'pending' }),
    ]);

    return {
      totalRevenue: totalRevenue[0]?.total || 0,
      todayOrders,
      weekRevenue: weekRevenue[0]?.total || 0,
      monthRevenue: monthRevenue[0]?.total || 0,
      totalUsers,
      totalProducts,
      recentOrders,
      pendingOrders,
    };
  }

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
      { $group: { _id: groupId, revenue: { $sum: '$total' }, orders: { $sum: 1 }, avgOrderValue: { $avg: '$total' } } },
      { $sort: { _id: 1 } },
    ]);
  }

  async getProductPerformance() {
    return productRepository.model.aggregate([
      { $match: { isDeleted: { $ne: true }, isActive: true } },
      { $project: { name: 1, slug: 1, totalSold: 1, averageRating: 1, totalReviews: 1, price: 1, revenue: { $multiply: ['$price', '$totalSold'] } } },
      { $sort: { totalSold: -1 } },
      { $limit: 20 },
    ]);
  }

  async trackEvent({ event, type, data }) {
    logger.info('Event tracked', { event, type, data });
    return { tracked: true };
  }

  async getCustomerAnalytics() {
    const now = new Date();
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const [totalCustomers, newThisMonth, orderStats] = await Promise.all([
      userRepository.model.countDocuments({ isDeleted: { $ne: true } }),
      userRepository.model.countDocuments({ createdAt: { $gte: monthAgo }, isDeleted: { $ne: true } }),
      orderRepository.model.aggregate([
        { $group: { _id: '$userId', orderCount: { $sum: 1 }, totalSpent: { $sum: '$total' } } },
        { $group: { _id: null, avgOrders: { $avg: '$orderCount' }, avgSpend: { $avg: '$totalSpent' }, repeatCustomers: { $sum: { $cond: [{ $gt: ['$orderCount', 1] }, 1, 0] } } } },
      ]),
    ]);
    return { totalCustomers, newThisMonth, avgOrders: orderStats[0]?.avgOrders || 0, avgSpend: orderStats[0]?.avgSpend || 0, repeatCustomers: orderStats[0]?.repeatCustomers || 0 };
  }
}

export default new AnalyticsService();
