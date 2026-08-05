import BaseRepository from './base.repository.js';
import Coupon from '../models/coupon.model.js';

class CouponRepository extends BaseRepository {
  constructor() {
    super(Coupon);
  }

  async findByCode(code) {
    return this.model.findOne({ code: code.toUpperCase(), isDeleted: { $ne: true } });
  }

  async softDelete(id) {
    return this.model.findByIdAndUpdate(id, { isDeleted: true, isActive: false });
  }

  async incrementUsage(id) {
    return this.model.findByIdAndUpdate(id, { $inc: { usedCount: 1 } }, { new: true });
  }

  async decrementUsage(id) {
    return this.model.findByIdAndUpdate(id, { $inc: { usedCount: -1 } }, { new: true });
  }

  async getActiveCoupons({ page = 1, limit = 20 } = {}) {
    const filter = { isActive: true, isDeleted: { $ne: true }, expiresAt: { $gt: new Date() } };
    const skip = (page - 1) * limit;
    const [coupons, total] = await Promise.all([
      this.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { coupons, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findAll({ page = 1, limit = 20, isActive, search } = {}) {
    const filter = { isDeleted: { $ne: true } };
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) filter.code = { $regex: search, $options: 'i' };
    const skip = (page - 1) * limit;
    const [coupons, total] = await Promise.all([
      this.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { coupons, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

export default new CouponRepository();
