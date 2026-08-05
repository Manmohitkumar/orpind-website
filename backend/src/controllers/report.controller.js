import reportService from '../services/report.service.js';

class ReportController {
  async getSalesReport(req, res, next) {
    try {
      const { startDate, endDate, groupBy } = req.query;
      const data = await reportService.getSalesReport({ startDate, endDate, groupBy });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getProductReport(req, res, next) {
    try {
      const data = await reportService.getProductReport();
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getCustomerReport(req, res, next) {
    try {
      const data = await reportService.getCustomerReport();
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getCouponReport(req, res, next) {
    try {
      const data = await reportService.getCouponReport();
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async exportCSV(req, res, next) {
    try {
      const { type, startDate, endDate } = req.query;
      const data = await reportService.exportCSV({ type, startDate, endDate });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }
}

const reportController = new ReportController();

export const {
  getSalesReport,
  getProductReport,
  getCustomerReport,
  getCouponReport,
  exportCSV,
} = reportController;

export default reportController;