import productService from '../services/product.service.js';

class ProductController {
  async getProducts(req, res, next) {
    try {
      const { category, search, sort, page, limit, minPrice, maxPrice, tag, featured, new: isNew, bestseller } = req.query;
      const data = await productService.getProducts({ category, search, sort, page, limit, minPrice, maxPrice, tag, featured, new: isNew, bestseller });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getProductBySlug(req, res, next) {
    try {
      const data = await productService.getProductBySlug(req.params.slug);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getFeaturedProducts(req, res, next) {
    try {
      const { limit } = req.query;
      const data = await productService.getFeaturedProducts(limit);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getBestsellers(req, res, next) {
    try {
      const { limit } = req.query;
      const data = await productService.getBestsellers(limit);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async searchProducts(req, res, next) {
    try {
      const { q, category, sort, page, limit } = req.query;
      const data = await productService.searchProducts({ q, category, page, limit });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async autocomplete(req, res, next) {
    try {
      const { q } = req.query;
      const data = await productService.autocomplete(q);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req, res, next) {
    try {
      const data = await productService.createProduct(req.body);
      res.status(201).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const data = await productService.updateProduct(req.params.id, req.body);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const data = await productService.deleteProduct(req.params.id);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getRelatedProducts(req, res, next) {
    try {
      const data = await productService.getRelatedProducts(req.params.slug);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }
}

const productController = new ProductController();

export const {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  getBestsellers,
  searchProducts,
  autocomplete,
  createProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
} = productController;

export default productController;