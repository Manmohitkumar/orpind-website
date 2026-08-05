import productRepository from '../repositories/product.repository.js';
import blogRepository from '../repositories/blog.repository.js';
import recipeRepository from '../repositories/recipe.repository.js';
import { redisClient } from '../config/redis.js';
import { logger } from '../config/logger.js';

class SearchService {
  async globalSearch(query, { type, page = 1, limit = 10 } = {}) {
    const results = [];
    const searchTypes = type ? [type] : ['products', 'blogs', 'recipes'];
    for (const t of searchTypes) {
      if (t === 'products') {
        const products = await productRepository.model.find({ $text: { $search: query }, isActive: true, isDeleted: { $ne: true } }).select('name slug price images').limit(limit);
        results.push(...products.map(p => ({ ...p.toObject(), type: 'product' })));
      } else if (t === 'blogs') {
        const blogs = await blogRepository.model.find({ $or: [{ title: { $regex: query, $options: 'i' } }, { excerpt: { $regex: query, $options: 'i' } }], status: 'published', isDeleted: { $ne: true } }).select('title slug excerpt featuredImage').limit(limit);
        results.push(...blogs.map(b => ({ ...b.toObject(), type: 'blog' })));
      } else if (t === 'recipes') {
        const recipes = await recipeRepository.model.find({ $or: [{ title: { $regex: query, $options: 'i' } }, { description: { $regex: query, $options: 'i' } }], status: 'published', isDeleted: { $ne: true } }).select('title slug description featuredImage').limit(limit);
        results.push(...recipes.map(r => ({ ...r.toObject(), type: 'recipe' })));
      }
    }
    return results.slice(0, limit);
  }

  async searchProducts(query, { page = 1, limit = 12, category, sort } = {}) {
    const pipeline = [];
    if (query) {
      pipeline.push({ $match: { $text: { $search: query } } });
      pipeline.push({ $addFields: { score: { $meta: 'textScore' } } });
    }
    const match = { isActive: true, isDeleted: { $ne: true } };
    if (category) match.categoryId = category;
    pipeline.push({ $match: match });
    if (query) pipeline.push({ $sort: { score: -1 } });
    else pipeline.push({ $sort: { createdAt: -1 } });
    pipeline.push({ $facet: { results: [{ $skip: (page - 1) * limit }, { $limit: limit }], totalCount: [{ $count: 'count' }] } });
    const [result] = await productRepository.model.aggregate(pipeline);
    return { products: result.results, total: result.totalCount[0]?.count || 0, page, limit };
  }

  async getSearchSuggestions(q) {
    const cached = await redisClient.get(`search:suggestions:${q.toLowerCase().slice(0, 2)}`);
    if (cached) return JSON.parse(cached);
    const suggestions = await productRepository.model.find({ name: { $regex: q, $options: 'i' }, isActive: true, isDeleted: { $ne: true } }).select('name').limit(8).lean();
    return suggestions.map(s => s.name);
  }

  async updateSearchSuggestions() {
    const products = await productRepository.model.find({ isActive: true, isDeleted: { $ne: true } }).select('name').lean();
    const prefixMap = {};
    for (const p of products) {
      const prefix = p.name.toLowerCase().slice(0, 2);
      if (!prefixMap[prefix]) prefixMap[prefix] = new Set();
      if (prefixMap[prefix].size < 10) prefixMap[prefix].add(p.name);
    }
    for (const [prefix, names] of Object.entries(prefixMap)) {
      await redisClient.setex(`search:suggestions:${prefix}`, 86400, JSON.stringify([...names]));
    }
    return { updated: Object.keys(prefixMap).length };
  }

  async getPopularSearches() {
    const cached = await redisClient.get('search:popular');
    if (cached) return JSON.parse(cached);
    return ['turmeric', 'red chilli', 'garam masala', 'organic spices', 'basmati rice'];
  }
}

export default new SearchService();
