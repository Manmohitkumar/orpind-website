import newsletterService from '../services/newsletter.service.js';

class NewsletterController {
  async subscribe(req, res, next) {
    try {
      const { email } = req.body;
      const data = await newsletterService.subscribe({ email });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async unsubscribe(req, res, next) {
    try {
      const { email } = req.body;
      const data = await newsletterService.unsubscribe({ email });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { page, limit, status } = req.query;
      const data = await newsletterService.getAll({ page, limit, status });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getActiveSubscribers(req, res, next) {
    try {
      const data = await newsletterService.getActiveSubscribers();
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async importSubscribers(req, res, next) {
    try {
      const { subscribers } = req.body;
      const data = await newsletterService.importSubscribers({ subscribers });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }
}

const newsletterController = new NewsletterController();

export const {
  subscribe,
  unsubscribe,
  getAll,
  getActiveSubscribers,
  importSubscribers,
} = newsletterController;

export default newsletterController;