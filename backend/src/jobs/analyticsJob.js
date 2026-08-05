import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';
import { getRedis } from '../config/redis.js';
import logger from '../config/logger.js';

const ANALYTICS_TTL = 3600;

async function aggregateDailyRevenue() {
  const redis = await getRedis();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  const [todayRevenue, yesterdayRevenue] = await Promise.all([
    Order.aggregate([
      { $match: { createdAt: { $gte: todayStart }, status: { $nin: ['cancelled', 'failed'] } } },
      { $group: { _id: null, revenue: { $sum: '$total' }, count: { $sum: 1 }, avgValue: { $avg: '$total' } } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: yesterdayStart, $lt: todayStart }, status: { $nin: ['cancelled', 'failed'] } } },
      { $group: { _id: null, revenue: { $sum: '$total' }, count: { $sum: 1 }, avgValue: { $avg: '$total' } } },
    ]),
  ]);

  const today = todayRevenue[0] || { revenue: 0, count: 0, avgValue: 0 };
  const yesterday = yesterdayRevenue[0] || { revenue: 0, count: 0, avgValue: 0 };

  const data = {
    todayRevenue: today.revenue,
    todayOrderCount: today.count,
    todayAvgOrderValue: today.avgValue,
    yesterdayRevenue: yesterday.revenue,
    yesterdayOrderCount: yesterday.count,
    revenueChange: yesterday.revenue > 0 ? ((today.revenue - yesterday.revenue) / yesterday.revenue * 100).toFixed(2) : 0,
    updatedAt: now.toISOString(),
  };

  await redis.setex('analytics:daily_revenue', ANALYTICS_TTL, JSON.stringify(data));
  logger.info('Daily revenue analytics aggregated');
  return data;
}

async function aggregateOrderCounts() {
  const redis = await getRedis();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

  const [todayOrders, weekOrders, monthOrders, statusBreakdown] = await Promise.all([
    Order.countDocuments({ createdAt: { $gte: todayStart } }),
    Order.countDocuments({ createdAt: { $gte: weekAgo } }),
    Order.countDocuments({ createdAt: { $gte: monthAgo } }),
    Order.aggregate([
      { $match: { createdAt: { $gte: monthAgo } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
  ]);

  const data = {
    todayOrders,
    weekOrders,
    monthOrders,
    statusBreakdown: statusBreakdown.reduce((acc, item) => { acc[item._id] = item.count; return acc; }, {}),
    updatedAt: now.toISOString(),
  };

  await redis.setex('analytics:order_counts', ANALYTICS_TTL, JSON.stringify(data));
  logger.info('Order count analytics aggregated');
  return data;
}

async function aggregateUserGrowth() {
  const redis = await getRedis();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

  const [totalUsers, newToday, newThisWeek, newThisMonth, activeUsers] = await Promise.all([
    User.countDocuments({ isDeleted: { $ne: true } }),
    User.countDocuments({ createdAt: { $gte: todayStart }, isDeleted: { $ne: true } }),
    User.countDocuments({ createdAt: { $gte: weekAgo }, isDeleted: { $ne: true } }),
    User.countDocuments({ createdAt: { $gte: monthAgo }, isDeleted: { $ne: true } }),
    User.countDocuments({ lastLoginAt: { $gte: weekAgo }, isDeleted: { $ne: true } }),
  ]);

  const data = {
    totalUsers,
    newToday,
    newThisWeek,
    newThisMonth,
    activeUsersWeek: activeUsers,
    updatedAt: now.toISOString(),
  };

  await redis.setex('analytics:user_growth', ANALYTICS_TTL, JSON.stringify(data));
  logger.info('User growth analytics aggregated');
  return data;
}

async function aggregateProductPerformance() {
  const redis = await getRedis();
  const now = new Date();
  const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

  const [topSelling, mostViewed, recentlyAdded, categoryPerformance] = await Promise.all([
    Product.find({ isDeleted: { $ne: true }, isActive: true })
      .select('name slug totalSold price averageRating')
      .sort({ totalSold: -1 })
      .limit(10)
      .lean(),
    Product.find({ isDeleted: { $ne: true }, isActive: true })
      .select('name slug viewCount totalSold price')
      .sort({ viewCount: -1 })
      .limit(10)
      .lean(),
    Product.countDocuments({ createdAt: { $gte: monthAgo }, isDeleted: { $ne: true } }),
    Product.aggregate([
      { $match: { isDeleted: { $ne: true }, isActive: true } },
      {
        $group: {
          _id: '$categoryId',
          productCount: { $sum: 1 },
          totalSold: { $sum: '$totalSold' },
          totalRevenue: { $sum: { $multiply: ['$price', '$totalSold'] } },
          avgPrice: { $avg: '$price' },
        },
      },
      {
        $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category', pipeline: [{ $project: { name: 1, slug: 1 } }] },
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      { $sort: { totalRevenue: -1 } },
    ]),
  ]);

  const data = {
    topSelling,
    mostViewed,
    newProductsThisMonth: recentlyAdded,
    categoryPerformance,
    updatedAt: now.toISOString(),
  };

  await redis.setex('analytics:product_performance', ANALYTICS_TTL, JSON.stringify(data));
  logger.info('Product performance analytics aggregated');
  return data;
}

async function runFullAnalytics() {
  const [revenue, orders, users, products] = await Promise.all([
    aggregateDailyRevenue(),
    aggregateOrderCounts(),
    aggregateUserGrowth(),
    aggregateProductPerformance(),
  ]);

  return { revenue, orders, users, products };
}

export {
  aggregateDailyRevenue,
  aggregateOrderCounts,
  aggregateUserGrowth,
  aggregateProductPerformance,
  runFullAnalytics,
};
