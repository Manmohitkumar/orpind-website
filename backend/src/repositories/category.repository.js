import BaseRepository from './base.repository.js';
import Category from '../models/category.model.js';

class CategoryRepository extends BaseRepository {
  constructor() {
    super(Category);
  }

  async findBySlug(slug) {
    return this.model.findOne({ slug, isDeleted: { $ne: true } });
  }

  async findTree() {
    return this.model.find({ parent: null, isDeleted: { $ne: true } }).sort({ sortOrder: 1 });
  }

  async findChildren(parentId) {
    return this.model.find({ parent: parentId, isDeleted: { $ne: true } }).sort({ sortOrder: 1 });
  }

  async getAll() {
    return this.model.find({ isDeleted: { $ne: true } }).sort({ sortOrder: 1 });
  }

  async create(data) {
    if (data.parent) {
      const parentCat = await this.model.findById(data.parent);
      if (parentCat) {
        data.level = parentCat.level + 1;
        data.ancestors = [...(parentCat.ancestors || []), { _id: parentCat._id, name: parentCat.name, slug: parentCat.slug }];
      }
    }
    return this.model.create(data);
  }

  async softDelete(id) {
    const children = await this.model.find({ parent: id });
    if (children.length > 0) {
      const err = new Error('Cannot delete category with subcategories');
      err.statusCode = 400;
      throw err;
    }
    return this.model.findByIdAndUpdate(id, { isDeleted: true, isActive: false });
  }

  async updateProductCount(categoryId) {
    const Product = (await import('../models/product.model.js')).default;
    const count = await Product.countDocuments({ categoryId, isActive: true, isDeleted: { $ne: true } });
    return this.model.findByIdAndUpdate(categoryId, { productCount: count });
  }

  async getAllWithCounts() {
    return this.model.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      { $sort: { sortOrder: 1 } },
      { $lookup: { from: 'products', localField: '_id', foreignField: 'categoryId', as: 'products', pipeline: [{ $match: { isActive: true, isDeleted: { $ne: true } } }, { $count: 'count' }] } },
      { $addFields: { productCount: { $ifNull: [{ $arrayElemAt: ['$products.count', 0] }, 0] } } },
      { $project: { products: 0 } },
    ]);
  }
}

export default new CategoryRepository();
