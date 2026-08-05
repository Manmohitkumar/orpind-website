import loyaltyService from '../services/loyalty.service.js';

class LoyaltyController {
  async getBalance(req, res, next) {
    try {
      const data = await loyaltyService.getBalance(req.user);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req, res, next) {
    try {
      const { page, limit, type } = req.query;
      const data = await loyaltyService.getHistory(req.user, { page, limit, type });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async earnPoints(req, res, next) {
    try {
      const { points, source, referenceId, description } = req.body;
      const data = await loyaltyService.earnPoints(req.user, { points, source, referenceId, description });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async redeemPoints(req, res, next) {
    try {
      const { points, source, referenceId, description } = req.body;
      const data = await loyaltyService.redeemPoints(req.user, { points, source, referenceId, description });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }
}

const loyaltyController = new LoyaltyController();

export const {
  getBalance,
  getHistory,
  earnPoints,
  redeemPoints,
} = loyaltyController;

export default loyaltyController;