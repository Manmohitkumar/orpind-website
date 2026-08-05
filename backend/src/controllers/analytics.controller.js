import analyticsService from '../services/analytics.service.js';

class AnalyticsController {
  async getDashboardStats(req, res, next) {
    try {
      const data = await analyticsService.getDashboardStats();
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getSalesReport(req, res, next) {
    try {
      const { startDate, endDate, groupBy } = req.query;
      const data = await analyticsService.getSalesReport(startDate, endDate, groupBy);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getProductPerformance(req, res, next) {
    try {
      const data = await analyticsService.getProductPerformance();
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getCustomerAnalytics(req, res, next) {
    try {
      const data = await analyticsService.getCustomerAnalytics();
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async trackEvent(req, res, next) {
    try {
      const { event, type, data: eventData } = req.body;
      const data = await analyticsService.trackEvent({ event, type, data: eventData });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }
}

const analyticsController = new AnalyticsController();

export const {
  getDashboardStats,
  getSalesReport,
  getProductPerformance,
  getCustomerAnalytics,
  trackEvent,
} = analyticsController;

export default analyticsController;