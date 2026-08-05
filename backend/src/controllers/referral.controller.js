import referralService from '../services/referral.service.js';

class ReferralController {
  async generateReferralCode(req, res, next) {
    try {
      const data = await referralService.generateReferralCode(req.user);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async applyReferral(req, res, next) {
    try {
      const { referralCode } = req.body;
      const data = await referralService.applyReferral(req.user, { referralCode });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getReferralStats(req, res, next) {
    try {
      const data = await referralService.getReferralStats(req.user);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }
}

const referralController = new ReferralController();

export const {
  generateReferralCode,
  applyReferral,
  getReferralStats,
} = referralController;

export default referralController;