import BaseRepository from './base.repository.js';
import AffiliateAccount from '../models/affiliateAccount.model.js';

class AffiliateRepository extends BaseRepository {
  constructor() {
    super(AffiliateAccount);
  }

  async create(data) {
    const count = await this.model.countDocuments();
    data.affiliateCode = `AFF-${String(count + 1).padStart(5, '0')}`;
    return this.model.create(data);
  }

  async findById(id) {
    return this.model.findById(id).populate('userId', 'firstName lastName email');
  }

  async findByUserId(userId) {
    return this.model.findOne({ userId });
  }

  async findByCode(affiliateCode) {
    return this.model.findOne({ affiliateCode, status: 'active' });
  }

  async addEarnings(id, amount) {
    return this.model.findByIdAndUpdate(id, { $inc: { totalEarnings: amount, pendingPayout: amount, totalConversions: 1 } }, { new: true });
  }

  async processPayout(id, amount) {
    return this.model.findByIdAndUpdate(id, { $inc: { pendingPayout: -amount, paidAmount: amount } }, { new: true });
  }

  async incrementReferrals(id) {
    return this.model.findByIdAndUpdate(id, { $inc: { totalReferrals: 1 } }, { new: true });
  }
}

export default new AffiliateRepository();
