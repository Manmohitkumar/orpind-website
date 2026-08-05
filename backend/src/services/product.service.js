import reviewRepository from '../repositories/review.repository.js';
import productRepository from '../repositories/product.repository.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { MESSAGES } from '../constants/messages.js';
import logger from '../config/logger.js';

class ProductService {
  async getProducts({ page = 1, limit = 20, category, search, sort, minPrice, maxPrice, tags, status }) {
    if (search) {
      return productRepository.search(search, { page, limit, category, minPrice, maxPrice, sort });
    }
    return productRepository.filterProducts({ page, limit, category, sort, minPrice, maxPrice, tags, status });
  }

  async getProductBySlug(slug) {
    const product = await productRepository.findBySlug(slug);
    if (!product) {
      throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, 404);
    }

    const [relatedProducts, reviewStats] = await Promise.all([
      productRepository.getRelated(product._id, product.categoryId, 8),
      reviewRepository.model.aggregate([
        { $match: { productId: product._id, isApproved: true, isDeleted: { $ne: true } } },
        {
          $group: {
            _id: '$productId',
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 },
            distribution: { $push: '$rating' },
          },
        },
      ]),
    ]);

    const stats = reviewStats[0] || { averageRating: 0, totalReviews: 0 };
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (reviewStats[0]) {
      for (const r of reviewStats[0].distribution || []) {
        distribution[r] = (distribution[r] || 0) + 1;
      }
    }

    return {
      product,
      relatedProducts,
      reviewStats: {
        averageRating: Math.round((stats.averageRating || 0) * 10) / 10,
        totalReviews: stats.totalReviews || 0,
        distribution,
      },
    };
  }

  async getFeaturedProducts(limit = 10) {
    return productRepository.getFeatured(limit);
  }

  async searchProducts({ q, page = 1, limit = 20, category, minPrice, maxPrice }) {
    const result = await productRepository.search(q, { page, limit, category, minPrice, maxPrice });
    const facets = await productRepository.getFacets();
    return {
      ...result,
      facets: facets[0] || { categories: [], priceRange: { minPrice: 0, maxPrice: 0 } },
    };
  }

  async autocomplete(query, limit = 10) {
    return productRepository.autocomplete(query, limit);
  }

  async createProduct(data) {
    if (data.name) {
      const existing = await productRepository.findByName(data.name);
      if (existing) {
        throw new AppError(MESSAGES.PRODUCT.ALREADY_EXISTS, 409);
      }
    }
    if (data.sku) {
      const existingSku = await productRepository.findBySkuUnique(data.sku);
      if (existingSku) {
        throw new AppError(MESSAGES.PRODUCT.SKU_EXISTS, 409);
      }
    }

    const product = await productRepository.create(data);
    logger.info('Product created', { productId: product._id, name: product.name });
    return product;
  }

  async updateProduct(productId, data) {
    if (data.name) {
      const existing = await productRepository.findByName(data.name, productId);
      if (existing) {
        throw new AppError(MESSAGES.PRODUCT.ALREADY_EXISTS, 409);
      }
    }
    if (data.sku) {
      const existingSku = await productRepository.findBySkuUnique(data.sku, productId);
      if (existingSku) {
        throw new AppError(MESSAGES.PRODUCT.SKU_EXISTS, 409);
      }
    }

    const product = await productRepository.update(productId, data);
    if (!product) {
      throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, 404);
    }

    logger.info('Product updated', { productId });
    return product;
  }

  async deleteProduct(productId) {
    const product = await productRepository.softDelete(productId);
    if (!product) {
      throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, 404);
    }
    logger.info('Product soft deleted', { productId });
    return true;
  }

  async getRelatedProducts(productId, limit = 8) {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, 404);
    }
    return productRepository.getRelated(productId, product.categoryId, limit);
  }

  async getNewArrivals(limit = 12) {
    return productRepository.getNewArrivals(limit);
  }

  async getBestsellers(limit = 12) {
    return productRepository.getBestsellers(limit);
  }

  async getOnSale(limit = 12) {
    return productRepository.getOnSale(limit);
  }

  async updateStock(productId, quantity) {
    const product = await productRepository.updateStock(productId, quantity);
    if (!product) {
      throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, 404);
    }
    return product;
  }

  async getProductById(productId) {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, 404);
    }
    return product;
  }

  async restoreProduct(productId) {
    const product = await productRepository.update(productId, { isDeleted: false });
    if (!product) {
      throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, 404);
    }
    logger.info('Product restored', { productId });
    return product;
  }

  async bulkUpdateStatus(updates) {
    const operations = updates.map(({ id, status }) => ({
      updateOne: {
        filter: { _id: id, isDeleted: false },
        update: { $set: { status } },
      },
    }));
    const result = await productRepository.bulkWrite(operations);
    logger.info('Bulk product status update', { modified: result.modifiedCount });
    return result;
  }

  async bulkUpdateProducts(updates) {
    const operations = updates.map(({ id, data }) => ({
      updateOne: {
        filter: { _id: id, isDeleted: false },
        update: { $set: data },
      },
    }));

    const result = await productRepository.bulkWrite(operations);
    logger.info('Bulk product update', { modified: result.modifiedCount });
    return result;
  }
}

export default new ProductService();
