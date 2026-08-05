import BaseRepository from './base.repository.js';
import ReferralRecord from '../models/referralRecord.model.js';

class ReferralRepository extends BaseRepository {
  constructor() {
    super(ReferralRecord);
  }

  async findByCode(referralCode) {
    return this.model.findOne({ referralCode });
  }

  async findByReferrer(referrerId) {
    return this.model.find({ referrerId }).populate('referredId', 'firstName lastName email');
  }

  async findByReferred(referredId) {
    return this.model.findOne({ referredId });
  }

  async complete(id, rewardPoints) {
    return this.model.findByIdAndUpdate(id, { status: 'completed', rewardPoints, completedAt: new Date() }, { new: true });
  }

  async getAll({ page = 1, limit = 20, status, referrerId } = {}) {
    const filter = {};
    if (status) filter.status = status;
    if (referrerId) filter.referrerId = referrerId;
    const skip = (page - 1) * limit;
    const [records, total] = await Promise.all([
      this.model.find(filter).populate('referrerId', 'firstName lastName email').populate('referredId', 'firstName lastName email').sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { records, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

export default new ReferralRepository();
