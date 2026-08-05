import referralRepository from '../repositories/referral.repository.js';
import { v4 as uuidv4 } from 'uuid';

const REFERRAL_REWARD = 100;
const FIRST_ORDER_REWARD = 200;

class ReferralService {
  async generateReferralCode(userId) {
    const existing = await referralRepository.model.findOne({ referrerId: userId });
    if (existing) return existing;
    return referralRepository.model.create({ referrerId: userId, referralCode: uuidv4().split('-')[0].toUpperCase(), status: 'pending' });
  }

  async applyReferral(referredId, referralCode) {
    const record = await referralRepository.model.findOne({ referralCode, status: 'pending' });
    if (!record) throw Object.assign(new Error('Invalid referral code'), { statusCode: 400 });
    if (record.referrerId.toString() === referredId.toString()) throw Object.assign(new Error('Cannot refer yourself'), { statusCode: 400 });
    record.referredId = referredId;
    record.referredAt = new Date();
    await record.save();
    return record;
  }

  async completeReferral(referrerId, orderAmount) {
    const record = await referralRepository.model.findOne({ referrerId, referredId: { $exists: true }, status: 'pending' });
    if (!record) return null;
    record.status = 'completed';
    record.firstOrderAmount = orderAmount;
    record.rewardPoints = REFERRAL_REWARD;
    record.completedAt = new Date();
    await record.save();
    return record;
  }

  async getReferralStats(userId) {
    const [record, referralCount] = await Promise.all([
      referralRepository.model.findOne({ referrerId: userId }),
      referralRepository.model.countDocuments({ referrerId: userId, status: 'completed' }),
    ]);
    return { referralCode: record?.referralCode, totalReferrals: referralCount, pendingReferrals: await referralRepository.model.countDocuments({ referrerId: userId, status: 'pending' }), totalRewardEarned: record ? referralCount * REFERRAL_REWARD : 0 };
  }

  async getAll({ page = 1, limit = 20, status } = {}) {
    const filter = {};
    if (status) filter.status = status;
    const skip = (page - 1) * limit;
    const [records, total] = await Promise.all([
      referralRepository.model.find(filter).populate('referrerId', 'firstName lastName email').populate('referredId', 'firstName lastName email').sort({ createdAt: -1 }).skip(skip).limit(limit),
      referralRepository.model.countDocuments(filter),
    ]);
    return { records, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

export default new ReferralService();
