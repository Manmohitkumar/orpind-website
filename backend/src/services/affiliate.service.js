import affiliateRepository from '../repositories/affiliate.repository.js';
import orderRepository from '../repositories/order.repository.js';
import { v4 as uuidv4 } from 'uuid';

class AffiliateService {
  async register(userId, { commissionRate = 10 } = {}) {
    const existing = await affiliateRepository.model.findOne({ userId });
    if (existing) throw Object.assign(new Error('Already registered as affiliate'), { statusCode: 409 });
    const count = await affiliateRepository.model.countDocuments();
    return affiliateRepository.model.create({ userId, affiliateCode: `AFF-${String(count + 1).padStart(5, '0')}`, commissionRate });
  }

  async generateAffiliateLink(userId) {
    const account = await affiliateRepository.model.findOne({ userId, status: 'active' });
    if (!account) throw Object.assign(new Error('Affiliate account not found'), { statusCode: 404 });
    const linkId = uuidv4().split('-')[0];
    return { link: `https://orpind.com/ref/${account.affiliateCode}`, code: account.affiliateCode, linkId };
  }

  async trackClick(affiliateCode) {
    const account = await affiliateRepository.model.findOne({ affiliateCode, status: 'active' });
    if (account) await affiliateRepository.model.findByIdAndUpdate(account._id, { $inc: { totalReferrals: 1 } });
    return { tracked: true };
  }

  async trackConversion(affiliateCode, orderId, orderAmount) {
    const account = await affiliateRepository.model.findOne({ affiliateCode, status: 'active' });
    if (!account) return { tracked: false };
    const commission = Math.round(orderAmount * (account.commissionRate / 100));
    await affiliateRepository.model.findByIdAndUpdate(account._id, { $inc: { totalConversions: 1, totalEarnings: commission, pendingPayout: commission } });
    return { tracked: true, commission };
  }

  async getAffiliateStats(userId) {
    const account = await affiliateRepository.model.findOne({ userId });
    if (!account) throw Object.assign(new Error('Affiliate account not found'), { statusCode: 404 });
    return account;
  }

  async getDashboard(userId) {
    const account = await affiliateRepository.model.findOne({ userId });
    if (!account) throw Object.assign(new Error('Affiliate account not found'), { statusCode: 404 });
    const recentConversions = await orderRepository.model.find({ metadata: { affiliateCode: account.affiliateCode } }).sort({ createdAt: -1 }).limit(10).select('orderNumber total createdAt');
    return { account, recentConversions };
  }

  async getAffiliateLink(user) {
    const userId = user._id || user;
    return this.generateAffiliateLink(userId);
  }

  async getAll({ page = 1, limit = 20, status } = {}) {
    const filter = {};
    if (status) filter.status = status;
    const skip = (page - 1) * limit;
    const [affiliates, total] = await Promise.all([
      affiliateRepository.model.find(filter).populate('userId', 'firstName lastName email').sort({ createdAt: -1 }).skip(skip).limit(limit),
      affiliateRepository.model.countDocuments(filter),
    ]);
    return { affiliates, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateStatus(id, status) {
    const account = await affiliateRepository.model.findByIdAndUpdate(id, { status }, { new: true });
    if (!account) throw Object.assign(new Error('Affiliate account not found'), { statusCode: 404 });
    return account;
  }
}

export default new AffiliateService();
