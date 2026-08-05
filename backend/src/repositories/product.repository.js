import BaseRepository from './base.repository.js';
import Product from '../models/product.model.js';

class ProductRepository extends BaseRepository {
  constructor() {
    super(Product);
  }

  async findBySlug(slug) {
    return this.findOne({ slug });
  }

  async findBySku(sku) {
    return this.findOne({ sku });
  }

  async findByName(name, excludeId = null) {
    const filter = { name, isDeleted: false };
    if (excludeId) filter._id = { $ne: excludeId };
    return this.model.findOne(filter);
  }

  async findBySkuUnique(sku, excludeId = null) {
    const filter = { sku, isDeleted: false };
    if (excludeId) filter._id = { $ne: excludeId };
    return this.model.findOne(filter);
  }

  async search(query, { page = 1, limit = 20, category, minPrice, maxPrice, sort } = {}) {
    const filter = { isDeleted: false, status: 'active' };
    if (query) filter.$text = { $search: query };
    if (category) filter.categoryId = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const skip = (page - 1) * limit;
    const sortOption = query ? { score: { $meta: 'textScore' } } : { createdAt: -1 };
    const projection = query ? { score: { $meta: 'textScore' } } : {};
    const [products, total] = await Promise.all([
      this.model.find(filter, projection).populate('categoryId', 'name slug').skip(skip).limit(limit).sort(sortOption),
      this.model.countDocuments(filter),
    ]);
    return { products, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getFeatured(limit = 10) {
    return this.model.find({ isFeatured: true, isDeleted: false, status: 'active' }).populate('categoryId', 'name slug').limit(limit).sort({ createdAt: -1 });
  }

  async getRelated(productId, categoryId, limit = 8) {
    return this.model.find({ _id: { $ne: productId }, categoryId, isDeleted: false }).limit(limit).sort({ totalSold: -1 }).populate('categoryId', 'name slug');
  }

  async updateStock(productId, quantity) {
    return this.model.findOneAndUpdate({ _id: productId, isDeleted: false }, { $inc: { totalSold: quantity } }, { new: true });
  }

  async autocomplete(query, limit = 10) {
    if (!query || query.length < 2) return [];
    return this.model.find({ name: { $regex: query, $options: 'i' }, isDeleted: false, status: 'active' }).select('name slug price images').limit(limit).sort({ totalSold: -1 });
  }

  async getNewArrivals(limit = 12) {
    return this.model.find({ isDeleted: false, status: 'active' }).populate('categoryId', 'name slug').limit(limit).sort({ createdAt: -1 });
  }

  async getBestsellers(limit = 12) {
    return this.model.find({ isDeleted: false, status: 'active' }).populate('categoryId', 'name slug').limit(limit).sort({ totalSold: -1 });
  }

  async getOnSale(limit = 12) {
    return this.model.find({ isDeleted: false, status: 'active', $expr: { $gt: ['$comparePrice', '$price'] } }).populate('categoryId', 'name slug').limit(limit);
  }

  async filterProducts({ page = 1, limit = 20, category, sort, minPrice, maxPrice, tags, status }) {
    const filter = { isDeleted: false };
    if (status) filter.status = status;
    if (category) filter.categoryId = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',');
      filter.tags = { $in: tagArray };
    }
    const sortMap = { price_asc: { price: 1 }, price_desc: { price: -1 }, newest: { createdAt: -1 }, oldest: { createdAt: 1 }, name: { name: 1 }, rating: { averageRating: -1 }, bestselling: { totalSold: -1 } };
    const sortOption = sortMap[sort] || { createdAt: -1 };
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      this.model.find(filter).populate('categoryId', 'name slug').skip(skip).limit(limit).sort(sortOption),
      this.model.countDocuments(filter),
    ]);
    return { products, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getFacets() {
    return this.model.aggregate([
      { $match: { isDeleted: false, status: 'active' } },
      { $facet: { categories: [{ $group: { _id: '$categoryId', count: { $sum: 1 } } }], priceRange: [{ $group: { _id: null, minPrice: { $min: '$price' }, maxPrice: { $max: '$price' } } }] } },
    ]);
  }
}

export default new ProductRepository();
