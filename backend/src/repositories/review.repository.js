import BaseRepository from './base.repository.js';
import Review from '../models/review.model.js';

class ReviewRepository extends BaseRepository {
  constructor() {
    super(Review);
  }

  async findByProduct(productId, { page = 1, limit = 10, sort = '-createdAt', rating, isApproved } = {}) {
    const filter = { productId, isDeleted: { $ne: true } };
    if (rating) filter.rating = Number(rating);
    if (isApproved !== undefined) filter.isApproved = isApproved;
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
      this.model.find(filter).populate('userId', 'firstName lastName avatar').sort(sort).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { reviews, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findByUser(userId) {
    return this.model.find({ userId, isDeleted: { $ne: true } }).populate('productId', 'name slug images').sort({ createdAt: -1 });
  }

  async approve(id) {
    return this.model.findByIdAndUpdate(id, { isApproved: true, isRejected: false }, { new: true });
  }

  async reject(id) {
    return this.model.findByIdAndUpdate(id, { isRejected: true, isApproved: false }, { new: true });
  }

  async getStats(productId) {
    const result = await this.model.aggregate([
      { $match: { productId, isApproved: true, isDeleted: { $ne: true } } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ]);

    const total = result.reduce((sum, r) => sum + r.count, 0);
    const average = total > 0
      ? result.reduce((sum, r) => sum + r._id * r.count, 0) / total
      : 0;

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const r of result) {
      distribution[r._id] = r.count;
    }

    return { average: Math.round(average * 10) / 10, total, distribution };
  }

  async hasUserReviewed(userId, productId) {
    return this.model.findOne({ userId, productId, isDeleted: { $ne: true } });
  }

  async findAll({ page = 1, limit = 20, isApproved, rating, productId } = {}) {
    const filter = { isDeleted: { $ne: true } };
    if (isApproved !== undefined) filter.isApproved = isApproved === 'true';
    if (rating) filter.rating = Number(rating);
    if (productId) filter.productId = productId;
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
      this.model.find(filter).populate('userId', 'firstName lastName').populate('productId', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { reviews, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

export default new ReviewRepository();
