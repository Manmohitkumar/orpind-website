import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';
import Coupon from '../models/coupon.model.js';
import emailService from '../services/email.service.js';
import { getRedis } from '../config/redis.js';
import logger from '../config/logger.js';

async function generateDailySalesReport() {
  try {
    const redis = await getRedis();
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    const [todayData, yesterdayData, hourlyBreakdown] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: todayStart }, status: { $nin: ['cancelled', 'failed'] } } },
        { $group: { _id: null, revenue: { $sum: '$total' }, orders: { $sum: 1 }, avgOrderValue: { $avg: '$total' }, itemsSold: { $sum: { $size: '$items' } } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: yesterdayStart, $lt: todayStart }, status: { $nin: ['cancelled', 'failed'] } } },
        { $group: { _id: null, revenue: { $sum: '$total' }, orders: { $sum: 1 }, avgOrderValue: { $avg: '$total' } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: todayStart }, status: { $nin: ['cancelled', 'failed'] } } },
        { $group: { _id: { $hour: '$createdAt' }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const today = todayData[0] || { revenue: 0, orders: 0, avgOrderValue: 0, itemsSold: 0 };
    const yesterday = yesterdayData[0] || { revenue: 0, orders: 0 };

    const report = {
      date: todayStart.toISOString().split('T')[0],
      revenue: { today: today.revenue, yesterday: yesterday.revenue, change: yesterday.revenue > 0 ? ((today.revenue - yesterday.revenue) / yesterday.revenue * 100).toFixed(1) : 'N/A' },
      orders: { today: today.orders, yesterday: yesterday.orders, change: yesterday.orders > 0 ? ((today.orders - yesterday.orders) / yesterday.orders * 100).toFixed(1) : 'N/A' },
      avgOrderValue: today.avgOrderValue,
      itemsSold: today.itemsSold,
      hourlyBreakdown: hourlyBreakdown.map(h => ({ hour: h._id, revenue: h.revenue, orders: h.orders })),
    };

    await redis.setex('report:daily_sales', 86400, JSON.stringify(report));
    logger.info('Daily sales report generated', { date: report.date, revenue: today.revenue });
    return report;
  } catch (error) {
    logger.error('Daily sales report failed', { error: error.message });
    throw error;
  }
}

async function generateWeeklyPerformanceReport() {
  try {
    const redis = await getRedis();
    const now = new Date();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);

    const [thisWeek, lastWeek, topProducts, newUsers, cancelledOrders] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: weekAgo }, status: { $nin: ['cancelled', 'failed'] } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: twoWeeksAgo, $lt: weekAgo }, status: { $nin: ['cancelled', 'failed'] } } },
        { $group: { _id: null, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
      ]),
      Product.find({ isDeleted: { $ne: true } }).sort({ totalSold: -1 }).limit(5).select('name slug totalSold price averageRating'),
      User.countDocuments({ createdAt: { $gte: weekAgo }, isDeleted: { $ne: true } }),
      Order.countDocuments({ createdAt: { $gte: weekAgo }, status: 'cancelled' }),
    ]);

    const thisWeekTotal = thisWeek.reduce((sum, day) => sum + day.revenue, 0);
    const thisWeekOrders = thisWeek.reduce((sum, day) => sum + day.orders, 0);
    const lastWeekData = lastWeek[0] || { revenue: 0, orders: 0 };

    const report = {
      period: `${weekAgo.toISOString().split('T')[0]} to ${now.toISOString().split('T')[0]}`,
      revenue: { thisWeek: thisWeekTotal, lastWeek: lastWeekData.revenue, change: lastWeekData.revenue > 0 ? ((thisWeekTotal - lastWeekData.revenue) / lastWeekData.revenue * 100).toFixed(1) : 'N/A' },
      orders: { thisWeek: thisWeekOrders, lastWeek: lastWeekData.orders },
      dailyBreakdown: thisWeek,
      topProducts,
      newUsers,
      cancelledOrders,
    };

    await redis.setex('report:weekly_performance', 86400, JSON.stringify(report));
    logger.info('Weekly performance report generated');
    return report;
  } catch (error) {
    logger.error('Weekly performance report failed', { error: error.message });
    throw error;
  }
}

async function generateMonthlySummaryReport() {
  try {
    const redis = await getRedis();
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const [thisMonth, lastMonth, topProducts, categoryBreakdown, couponUsage, customerStats] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: monthStart }, status: { $nin: ['cancelled', 'failed'] } } },
        { $group: { _id: null, revenue: { $sum: '$total' }, orders: { $sum: 1 }, avgOrderValue: { $avg: '$total' }, itemsSold: { $sum: { $size: '$items' } } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }, status: { $nin: ['cancelled', 'failed'] } } },
        { $group: { _id: null, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
      ]),
      Product.find({ isDeleted: { $ne: true } }).sort({ totalSold: -1 }).limit(10).select('name slug totalSold price revenue'),
      Product.aggregate([
        { $match: { isDeleted: { $ne: true }, isActive: true } },
        { $group: { _id: '$categoryId', products: { $sum: 1 }, totalSold: { $sum: '$totalSold' }, revenue: { $sum: { $multiply: ['$price', '$totalSold'] } } } },
        { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category', pipeline: [{ $project: { name: 1 } }] } },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
        { $sort: { revenue: -1 } },
      ]),
      Coupon.find({ isDeleted: { $ne: true } }).select('code discountType discountValue usedCount').sort({ usedCount: -1 }).limit(5),
      User.aggregate([
        { $match: { createdAt: { $gte: monthStart }, isDeleted: { $ne: true } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const thisMonthData = thisMonth[0] || { revenue: 0, orders: 0, avgOrderValue: 0, itemsSold: 0 };
    const lastMonthData = lastMonth[0] || { revenue: 0, orders: 0 };

    const report = {
      period: `${monthStart.toISOString().split('T')[0].slice(0, 7)}`,
      revenue: {
        thisMonth: thisMonthData.revenue,
        lastMonth: lastMonthData.revenue,
        change: lastMonthData.revenue > 0 ? ((thisMonthData.revenue - lastMonthData.revenue) / lastMonthData.revenue * 100).toFixed(1) : 'N/A',
      },
      orders: { thisMonth: thisMonthData.orders, lastMonth: lastMonthData.orders },
      avgOrderValue: thisMonthData.avgOrderValue,
      itemsSold: thisMonthData.itemsSold,
      topProducts,
      categoryBreakdown,
      topCoupons: couponUsage,
      dailyNewUsers: customerStats,
    };

    await redis.setex('report:monthly_summary', 86400 * 2, JSON.stringify(report));
    logger.info('Monthly summary report generated', { period: report.period });
    return report;
  } catch (error) {
    logger.error('Monthly summary report failed', { error: error.message });
    throw error;
  }
}

async function sendReportEmail(reportType, recipientEmails) {
  try {
    let report;
    let subject;

    switch (reportType) {
      case 'daily':
        report = await generateDailySalesReport();
        subject = `Daily Sales Report - ${report.date}`;
        break;
      case 'weekly':
        report = await generateWeeklyPerformanceReport();
        subject = `Weekly Performance Report - ${report.period}`;
        break;
      case 'monthly':
        report = await generateMonthlySummaryReport();
        subject = `Monthly Summary Report - ${report.period}`;
        break;
      default:
        throw new Error(`Unknown report type: ${reportType}`);
    }

    const html = `<h1>${subject}</h1><pre style="background:#f5f5f5;padding:16px;border-radius:4px;overflow-x:auto">${JSON.stringify(report, null, 2)}</pre>`;

    for (const email of recipientEmails) {
      await emailService.sendEmail({ to: email, subject, html });
    }

    logger.info('Report email sent', { reportType, recipients: recipientEmails.length });
    return { reportType, recipients: recipientEmails.length };
  } catch (error) {
    logger.error('Report email failed', { reportType, error: error.message });
    throw error;
  }
}

export {
  generateDailySalesReport,
  generateWeeklyPerformanceReport,
  generateMonthlySummaryReport,
  sendReportEmail,
};
