import BaseRepository from './base.repository.js';
import Media from '../models/media.model.js';

class MediaRepository extends BaseRepository {
  constructor() {
    super(Media);
  }

  async findByFolder(folder, { page = 1, limit = 20 } = {}) {
    const filter = { folder, isDeleted: { $ne: true } };
    const skip = (page - 1) * limit;
    const [media, total] = await Promise.all([
      this.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { media, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async restore(id) {
    return this.model.findByIdAndUpdate(id, { isDeleted: false });
  }

  async incrementUsage(id) {
    return this.model.findByIdAndUpdate(id, { $inc: { usageCount: 1 } });
  }

  async decrementUsage(id) {
    return this.model.findByIdAndUpdate(id, { $inc: { usageCount: -1 } });
  }

  async getOrphans() {
    return this.model.find({ usageCount: 0, isDeleted: false, createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });
  }
}

export default new MediaRepository();
