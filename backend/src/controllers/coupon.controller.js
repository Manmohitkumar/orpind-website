import couponService from '../services/coupon.service.js';

class CouponController {
  async validateCoupon(req, res, next) {
    try {
      const { code, subtotal } = req.body;
      const data = await couponService.validateCoupon(req.user, { code, subtotal });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getCoupons(req, res, next) {
    try {
      const { page, limit, isActive, search } = req.query;
      const data = await couponService.getCoupons({ page, limit, isActive, search });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async createCoupon(req, res, next) {
    try {
      const data = await couponService.createCoupon(req.body);
      res.status(201).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async updateCoupon(req, res, next) {
    try {
      const data = await couponService.updateCoupon(req.params.id, req.body);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async deleteCoupon(req, res, next) {
    try {
      const data = await couponService.deleteCoupon(req.params.id);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }
}

const couponController = new CouponController();

export const {
  validateCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = couponController;

export default couponController;