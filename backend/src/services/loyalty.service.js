import loyaltyRepository from '../repositories/loyalty.repository.js';

const POINTS_PER_RUPEE = 1;
const REDEMPTION_VALUE = 0.5;

class LoyaltyService {
  async earnPoints(userId, points, source, referenceId, description) {
    const balance = await this.getBalance(userId);
    const newBalance = balance + points;
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 12);
    return loyaltyRepository.model.create({ userId, type: 'earn', points, balance: newBalance, source, referenceId, description, expiresAt });
  }

  async redeemPoints(userId, points, source, referenceId, description) {
    const balance = await this.getBalance(userId);
    if (balance < points) throw Object.assign(new Error('Insufficient loyalty points'), { statusCode: 400 });
    const newBalance = balance - points;
    return loyaltyRepository.model.create({ userId, type: 'redeem', points, balance: newBalance, source, referenceId, description });
  }

  async getBalance(userId) {
    const lastTx = await loyaltyRepository.model.findOne({ userId }).sort({ createdAt: -1 });
    return lastTx?.balance || 0;
  }

  async getHistory(userId, { page = 1, limit = 20, type } = {}) {
    const filter = { userId };
    if (type) filter.type = type;
    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      loyaltyRepository.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      loyaltyRepository.model.countDocuments(filter),
    ]);
    return { transactions, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getAll({ page = 1, limit = 20, userId, type } = {}) {
    const filter = {};
    if (userId) filter.userId = userId;
    if (type) filter.type = type;
    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      loyaltyRepository.model.find(filter).populate('userId', 'firstName lastName email').sort({ createdAt: -1 }).skip(skip).limit(limit),
      loyaltyRepository.model.countDocuments(filter),
    ]);
    return { transactions, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async checkExpiry() {
    const expired = await loyaltyRepository.model.find({ type: 'earn', expiresAt: { $lt: new Date() }, $or: [{ expired: { $ne: true } }] });
    for (const tx of expired) {
      const balance = await this.getBalance(tx.userId);
      await loyaltyRepository.model.create({ userId: tx.userId, type: 'expire', points: tx.points, balance: balance - tx.points, source: 'expiry', description: `Points expired from ${tx.source}` });
      await loyaltyRepository.model.findByIdAndUpdate(tx._id, { expired: true });
    }
    return { expired: expired.length };
  }
}

export default new LoyaltyService();
