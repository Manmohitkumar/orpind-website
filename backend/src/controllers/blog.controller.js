import blogService from '../services/blog.service.js';

class BlogController {
  async getBlogs(req, res, next) {
    try {
      const { category, tag, page, limit } = req.query;
      const data = await blogService.getBlogs({ category, tag, page, limit });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getBlogBySlug(req, res, next) {
    try {
      const data = await blogService.getBlogBySlug(req.params.slug);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async createBlog(req, res, next) {
    try {
      const data = await blogService.createBlog(req.body);
      res.status(201).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async updateBlog(req, res, next) {
    try {
      const data = await blogService.updateBlog(req.params.id, req.body);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async deleteBlog(req, res, next) {
    try {
      const data = await blogService.deleteBlog(req.params.id);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }
}

const blogController = new BlogController();

export const {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} = blogController;

export default blogController;