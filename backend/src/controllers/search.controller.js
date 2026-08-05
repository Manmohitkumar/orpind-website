import Product from '../models/product.model.js';
import Category from '../models/category.model.js';
import Blog from '../models/blog.model.js';
import Recipe from '../models/recipe.model.js';

class SearchController {
  async globalSearch(req, res, next) {
    try {
      const { q, page = 1, limit = 20 } = req.query;
      if (!q) {
        return res.status(400).json({ success: false, message: 'Search query is required' });
      }
      const regex = new RegExp(q, 'i');
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [products, categories, blogs, recipes] = await Promise.all([
        Product.find({ $or: [{ name: regex }, { description: regex }, { tags: regex }], status: 'active', isDeleted: { $ne: true } }).skip(skip).limit(parseInt(limit)).lean(),
        Category.find({ $or: [{ name: regex }, { description: regex }], isActive: true, isDeleted: { $ne: true } }).skip(skip).limit(parseInt(limit)).lean(),
        Blog.find({ $or: [{ title: regex }, { excerpt: regex }, { tags: regex }], status: 'published', isDeleted: { $ne: true } }).skip(skip).limit(parseInt(limit)).lean(),
        Recipe.find({ $or: [{ title: regex }, { description: regex }, { tags: regex }], status: 'published', isDeleted: { $ne: true } }).skip(skip).limit(parseInt(limit)).lean(),
      ]);

      res.json({
        success: true,
        data: { products, categories, blogs, recipes },
        meta: { requestId: req.requestId, timestamp: new Date().toISOString() },
      });
    } catch (error) {
      next(error);
    }
  }

  async getSuggestions(req, res, next) {
    try {
      const { q } = req.query;
      if (!q) {
        return res.json({ success: true, data: { suggestions: [] } });
      }
      const regex = new RegExp(q, 'i');
      const products = await Product.find({ name: regex, status: 'active', isDeleted: { $ne: true } }).select('name slug').limit(10).lean();
      const categories = await Category.find({ name: regex, isActive: true, isDeleted: { $ne: true } }).select('name slug').limit(5).lean();

      const suggestions = [
        ...products.map((p) => ({ type: 'product', name: p.name, slug: p.slug })),
        ...categories.map((c) => ({ type: 'category', name: c.name, slug: c.slug })),
      ];

      res.json({ success: true, data: { suggestions } });
    } catch (error) {
      next(error);
    }
  }
}

const searchController = new SearchController();

export const {
  globalSearch,
  getSuggestions,
} = searchController;

export default searchController;
