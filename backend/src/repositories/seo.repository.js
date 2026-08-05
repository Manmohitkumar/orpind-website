import BaseRepository from './base.repository.js';
import SeoMetadata from '../models/seoMetadata.model.js';

class SeoRepository extends BaseRepository {
  constructor() {
    super(SeoMetadata);
  }

  async findByPageType(pageType, entityId) {
    const filter = { pageType };
    if (entityId) filter.entityId = entityId;
    return this.model.findOne(filter);
  }

  async findBySlug(slug) {
    return this.model.findOne({ slug });
  }

  async upsert(data) {
    return this.model.findOneAndUpdate(
      { pageType: data.pageType, entityId: data.entityId },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    );
  }

  async findRedirect(from) {
    return this.model.findOne({ 'redirects.from': from });
  }

  async getAll({ page = 1, limit = 20, pageType } = {}) {
    const filter = {};
    if (pageType) filter.pageType = pageType;
    const skip = (page - 1) * limit;
    const [metadata, total] = await Promise.all([
      this.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { metadata, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

export default new SeoRepository();
