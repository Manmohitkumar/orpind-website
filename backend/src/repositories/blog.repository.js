import BaseRepository from './base.repository.js';
import Blog from '../models/blog.model.js';

class BlogRepository extends BaseRepository {
  constructor() {
    super(Blog);
  }

  async findBySlug(slug) {
    return this.model.findOne({ slug, isDeleted: { $ne: true } }).populate('author', 'firstName lastName avatar');
  }

  async getPublished({ page = 1, limit = 10, category, tag } = {}) {
    const filter = { status: 'published', isDeleted: { $ne: true } };
    if (category) filter.category = category;
    if (tag) filter.tags = { $in: [tag] };
    const skip = (page - 1) * limit;
    const [blogs, total] = await Promise.all([
      this.model.find(filter).populate('author', 'firstName lastName avatar').sort({ publishedAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { blogs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getByAuthor(authorId) {
    return this.model.find({ author: authorId, isDeleted: { $ne: true } }).sort({ createdAt: -1 });
  }

  async incrementViewCount(id) {
    return this.model.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
  }

  async getRelated(category, excludeId, limit = 3) {
    return this.model.find({ category, _id: { $ne: excludeId }, status: 'published', isDeleted: { $ne: true } }).limit(limit);
  }

  async findAll({ page = 1, limit = 20, status, search } = {}) {
    const filter = { isDeleted: { $ne: true } };
    if (status) filter.status = status;
    if (search) filter.$or = [{ title: { $regex: search, $options: 'i' } }, { excerpt: { $regex: search, $options: 'i' } }];
    const skip = (page - 1) * limit;
    const [blogs, total] = await Promise.all([
      this.model.find(filter).populate('author', 'firstName lastName').sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { blogs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

export default new BlogRepository();
