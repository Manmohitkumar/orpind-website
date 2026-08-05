import categoryRepository from '../repositories/category.repository.js';
import productRepository from '../repositories/product.repository.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { MESSAGES } from '../constants/messages.js';
import logger from '../config/logger.js';

class CategoryService {
  async getCategories() {
    const all = await categoryRepository.model.find({ isDeleted: false }).sort({ sortOrder: 1, name: 1 }).lean();
    const map = new Map();
    const roots = [];
    for (const cat of all) {
      map.set(cat._id.toString(), { ...cat, children: [] });
    }
    for (const cat of all) {
      const node = map.get(cat._id.toString());
      if (cat.parent) {
        const parent = map.get(cat.parent.toString());
        if (parent) parent.children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  async getCategoryBySlug(slug) {
    const category = await categoryRepository.model.findOne({ slug, isDeleted: false });
    if (!category) {
      throw new AppError(MESSAGES.CATEGORY.NOT_FOUND, 404);
    }

    const products = await productRepository.model.find({ categoryId: category._id, isDeleted: false, status: 'active' })
      .populate('categoryId', 'name slug')
      .limit(20)
      .sort({ createdAt: -1 });

    const subcategories = await categoryRepository.model.find({ parent: category._id, isDeleted: false })
      .sort({ sortOrder: 1, name: 1 });

    return { category, products, subcategories };
  }

  async createCategory(data) {
    if (data.name) {
      const existing = await categoryRepository.model.findOne({ name: data.name, isDeleted: false });
      if (existing) {
        throw new AppError(MESSAGES.CATEGORY.ALREADY_EXISTS, 409);
      }
    }

    if (data.parent) {
      const parentCategory = await categoryRepository.model.findById(data.parent);
      if (!parentCategory) {
        throw new AppError(MESSAGES.CATEGORY.NOT_FOUND, 404);
      }

      const ancestors = [...(parentcategoryRepository.model.ancestors || [])];
      ancestors.push({ _id: parentcategoryRepository.model._id, name: parentcategoryRepository.model.name, slug: parentcategoryRepository.model.slug });
      data.ancestors = ancestors;
      data.level = (parentcategoryRepository.model.level || 0) + 1;
    } else {
      data.level = 0;
      data.ancestors = [];
    }

    const category = await categoryRepository.model.create(data);
    logger.info('Category created', { categoryId: category._id, name: category.name });
    return category;
  }

  async updateCategory(categoryId, data) {
    if (data.name) {
      const existing = await categoryRepository.model.findOne({ name: data.name, _id: { $ne: categoryId }, isDeleted: false });
      if (existing) {
        throw new AppError(MESSAGES.CATEGORY.ALREADY_EXISTS, 409);
      }
    }

    const category = await categoryRepository.model.findOneAndUpdate(
      { _id: categoryId, isDeleted: false },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!category) {
      throw new AppError(MESSAGES.CATEGORY.NOT_FOUND, 404);
    }

    logger.info('Category updated', { categoryId });
    return category;
  }

  async deleteCategory(categoryId) {
    const category = await categoryRepository.model.findById(categoryId);
    if (!category) {
      throw new AppError(MESSAGES.CATEGORY.NOT_FOUND, 404);
    }

    const subcategories = await categoryRepository.model.countDocuments({ parent: categoryId, isDeleted: false });
    if (subcategories > 0) {
      throw new AppError(MESSAGES.CATEGORY.HAS_SUBCATEGORIES, 400);
    }

    const products = await productRepository.model.countDocuments({ categoryId, isDeleted: false });
    if (products > 0) {
      throw new AppError(MESSAGES.CATEGORY.HAS_PRODUCTS, 400);
    }

    await category.softDelete();
    logger.info('Category deleted', { categoryId });
    return true;
  }

  async getAllCategories() {
    return this.getCategories();
  }

  async getCategoryById(categoryId) {
    const category = await categoryRepository.model.findOne({ _id: categoryId, isDeleted: false });
    if (!category) {
      throw new AppError(MESSAGES.CATEGORY.NOT_FOUND, 404);
    }
    return category;
  }

  async getCategoryTree() {
    return this.getCategories();
  }

  async moveCategory(categoryId, newParentId) {
    const category = await categoryRepository.model.findById(categoryId);
    if (!category) {
      throw new AppError(MESSAGES.CATEGORY.NOT_FOUND, 404);
    }

    if (newParentId && newParentId.toString() === categoryId.toString()) {
      throw new AppError('Cannot move category to itself', 400);
    }

    if (newParentId) {
      const newParent = await categoryRepository.model.findById(newParentId);
      if (!newParent) {
        throw new AppError(MESSAGES.CATEGORY.NOT_FOUND, 404);
      }

      if (newParent.ancestors && newParent.ancestors.some((a) => a._id.toString() === categoryId.toString())) {
        throw new AppError('Cannot move category under its own descendant', 400);
      }

      const ancestors = [...(newParent.ancestors || [])];
      ancestors.push({ _id: newParent._id, name: newParent.name, slug: newParent.slug });
      category.parent = newParentId;
      category.ancestors = ancestors;
      category.level = (newParent.level || 0) + 1;
    } else {
      category.parent = undefined;
      category.ancestors = [];
      category.level = 0;
    }

    await category.save();

    const children = await categoryRepository.model.find({ parent: categoryId, isDeleted: false });
    for (const child of children) {
      await this.rebuildAncestors(child);
    }

    logger.info('Category moved', { categoryId, newParentId });
    return category;
  }

  async rebuildAncestors(category) {
    if (category.parent) {
      const parent = await categoryRepository.model.findById(category.parent);
      if (parent) {
        const ancestors = [...(parent.ancestors || [])];
        ancestors.push({ _id: parent._id, name: parent.name, slug: parent.slug });
        category.ancestors = ancestors;
        category.level = (parent.level || 0) + 1;
      }
    } else {
      category.ancestors = [];
      category.level = 0;
    }
    await category.save({ validateBeforeSave: false });
  }
}

export default new CategoryService();
