import affiliateService from '../services/affiliate.service.js';

class AffiliateController {
  async register(req, res, next) {
    try {
      const { commissionRate } = req.body;
      const data = await affiliateService.register(req.user, { commissionRate });
      res.status(201).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getAffiliateLink(req, res, next) {
    try {
      const data = await affiliateService.getAffiliateLink(req.user);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getAffiliateStats(req, res, next) {
    try {
      const data = await affiliateService.getAffiliateStats(req.user);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getDashboard(req, res, next) {
    try {
      const data = await affiliateService.getDashboard(req.user);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }
}

const affiliateController = new AffiliateController();

export const {
  register,
  getAffiliateLink,
  getAffiliateStats,
  getDashboard,
} = affiliateController;

export default affiliateController;