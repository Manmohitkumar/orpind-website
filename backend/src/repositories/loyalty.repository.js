import BaseRepository from './base.repository.js';
import LoyaltyTransaction from '../models/loyaltyTransaction.model.js';

class LoyaltyRepository extends BaseRepository {
  constructor() {
    super(LoyaltyTransaction);
  }

  async findByUser(userId, { page = 1, limit = 20, type } = {}) {
    const filter = { userId };
    if (type) filter.type = type;
    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      this.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { transactions, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getBalance(userId) {
    const lastTx = await this.model.findOne({ userId }).sort({ createdAt: -1 });
    return lastTx?.balance || 0;
  }

  async getAll({ page = 1, limit = 20, type, userId } = {}) {
    const filter = {};
    if (type) filter.type = type;
    if (userId) filter.userId = userId;
    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      this.model.find(filter).populate('userId', 'firstName lastName email').sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { transactions, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

export default new LoyaltyRepository();
