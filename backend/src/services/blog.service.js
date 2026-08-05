import blogRepository from '../repositories/blog.repository.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { MESSAGES } from '../constants/messages.js';
import logger from '../config/logger.js';

class BlogService {
  async getPublishedBlogs({ page = 1, limit = 10, category, tag } = {}) {
    const filter = { status: 'published', isDeleted: false };
    if (category) filter.category = category;
    if (tag) filter.tags = { $in: Array.isArray(tag) ? tag : [tag] };

    const skip = (page - 1) * limit;
    const [blogs, total] = await Promise.all([
      blogRepository.model.find(filter)
        .populate('author', 'firstName lastName avatar')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit),
      blogRepository.model.countDocuments(filter),
    ]);

    return {
      blogs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getBlogBySlug(slug) {
    const blog = await blogRepository.model.findOne({ slug, isDeleted: false })
      .populate('author', 'firstName lastName avatar');
    if (!blog) {
      throw new AppError(MESSAGES.BLOG.NOT_FOUND, 404);
    }
    return blog;
  }

  async createBlog(data) {
    if (data.title) {
      const existing = await blogRepository.model.findOne({ title: data.title, isDeleted: false });
      if (existing) {
        throw new AppError(MESSAGES.BLOG.ALREADY_EXISTS, 409);
      }
    }

    if (data.status === 'published' && !data.publishedAt) {
      data.publishedAt = new Date();
    }

    const blog = await blogRepository.model.create(data);
    logger.info('Blog created', { blogId: blog._id, title: blog.title });
    return blog;
  }

  async updateBlog(blogId, data) {
    if (data.title) {
      const existing = await blogRepository.model.findOne({ title: data.title, _id: { $ne: blogId }, isDeleted: false });
      if (existing) {
        throw new AppError(MESSAGES.BLOG.ALREADY_EXISTS, 409);
      }
    }

    if (data.status === 'published' && !data.publishedAt) {
      data.publishedAt = new Date();
    }

    const blog = await blogRepository.model.findOneAndUpdate(
      { _id: blogId, isDeleted: false },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!blog) {
      throw new AppError(MESSAGES.BLOG.NOT_FOUND, 404);
    }

    logger.info('Blog updated', { blogId });
    return blog;
  }

  async deleteBlog(blogId) {
    const blog = await blogRepository.model.findById(blogId);
    if (!blog) {
      throw new AppError(MESSAGES.BLOG.NOT_FOUND, 404);
    }

    await blog.softDelete();
    logger.info('Blog deleted', { blogId });
    return true;
  }

  async incrementViewCount(blogId) {
    const blog = await blogRepository.model.findOneAndUpdate(
      { _id: blogId, isDeleted: false },
      { $inc: { viewCount: 1 } },
      { new: true }
    );
    return blog;
  }

  async getRelatedBlogs(blogId, limit = 4) {
    const blog = await blogRepository.model.findById(blogId).lean();
    if (!blog) {
      throw new AppError(MESSAGES.BLOG.NOT_FOUND, 404);
    }

    const related = await blogRepository.model.find({
      _id: { $ne: blogId },
      isDeleted: false,
      status: 'published',
      $or: [
        { category: blog.category },
        { tags: { $in: blog.tags || [] } },
      ],
    })
      .populate('author', 'firstName lastName avatar')
      .limit(limit)
      .sort({ createdAt: -1 });

    return related;
  }

  async getBlogs(query) {
    return this.getPublishedBlogs(query);
  }

  async getAllBlogs({ page = 1, limit = 20, category, tag, status } = {}) {
    const filter = { isDeleted: false };
    if (category) filter.category = category;
    if (tag) filter.tags = { $in: Array.isArray(tag) ? tag : [tag] };
    if (status) filter.status = status;
    const skip = (page - 1) * limit;
    const [blogs, total] = await Promise.all([
      blogRepository.model.find(filter).populate('author', 'firstName lastName avatar').sort({ createdAt: -1 }).skip(skip).limit(limit),
      blogRepository.model.countDocuments(filter),
    ]);
    return { blogs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getBlogById(blogId) {
    const blog = await blogRepository.model.findOne({ _id: blogId, isDeleted: false }).populate('author', 'firstName lastName avatar');
    if (!blog) {
      throw new AppError(MESSAGES.BLOG.NOT_FOUND, 404);
    }
    return blog;
  }

  async getByAuthor(authorId, { page = 1, limit = 10 } = {}) {
    const filter = { author: authorId, isDeleted: false };
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      blogRepository.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      blogRepository.model.countDocuments(filter),
    ]);

    return {
      blogs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export default new BlogService();
