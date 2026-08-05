import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import mongoose from 'mongoose';

const mockFindBySlug = jest.fn();
const mockFindById = jest.fn();
const mockFindByName = jest.fn();
const mockFindBySkuUnique = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockSoftDelete = jest.fn();
const mockGetFeatured = jest.fn();
const mockGetRelated = jest.fn();
const mockGetNewArrivals = jest.fn();
const mockGetBestsellers = jest.fn();
const mockGetOnSale = jest.fn();
const mockUpdateStock = jest.fn();
const mockFilterProducts = jest.fn();
const mockSearch = jest.fn();
const mockAutocomplete = jest.fn();
const mockGetFacets = jest.fn();
const mockBulkWrite = jest.fn();
const mockReviewAggregate = jest.fn();

jest.unstable_mockModule('../../../src/repositories/product.repository.js', () => ({
  __esModule: true,
  default: {
    findBySlug: mockFindBySlug,
    findById: mockFindById,
    findByName: mockFindByName,
    findBySkuUnique: mockFindBySkuUnique,
    create: mockCreate,
    update: mockUpdate,
    softDelete: mockSoftDelete,
    getFeatured: mockGetFeatured,
    getRelated: mockGetRelated,
    getNewArrivals: mockGetNewArrivals,
    getBestsellers: mockGetBestsellers,
    getOnSale: mockGetOnSale,
    updateStock: mockUpdateStock,
    filterProducts: mockFilterProducts,
    search: mockSearch,
    autocomplete: mockAutocomplete,
    getFacets: mockGetFacets,
    bulkWrite: mockBulkWrite,
  },
}));

jest.unstable_mockModule('../../../src/models/review.model.js', () => ({
  __esModule: true,
  default: { aggregate: mockReviewAggregate },
}));

const productService = (await import('../../../src/services/product.service.js')).default;

describe('ProductService', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  describe('getProducts', () => {
    it('should call search when search param provided', async () => {
      mockSearch.mockResolvedValue({ products: [], total: 0, page: 1, limit: 20, totalPages: 0 });
      const result = await productService.getProducts({ search: 'turmeric' });
      expect(mockSearch).toHaveBeenCalled();
      expect(mockFilterProducts).not.toHaveBeenCalled();
    });

    it('should call filterProducts when no search param', async () => {
      mockFilterProducts.mockResolvedValue({ products: [], total: 0, page: 1, limit: 20, totalPages: 0 });
      await productService.getProducts({ category: 'cat1', sort: 'price_asc' });
      expect(mockFilterProducts).toHaveBeenCalled();
    });
  });

  describe('getProductBySlug', () => {
    it('should return product with review stats', async () => {
      const productId = new mongoose.Types.ObjectId();
      const categoryId = new mongoose.Types.ObjectId();
      mockFindBySlug.mockResolvedValue({ _id: productId, name: 'Turmeric', categoryId });
      mockGetRelated.mockResolvedValue([{ _id: new mongoose.Types.ObjectId() }]);
      mockReviewAggregate.mockResolvedValue([{ averageRating: 4.5, totalReviews: 10, distribution: [5, 4, 5, 5, 4] }]);

      const result = await productService.getProductBySlug('turmeric');
      expect(result.product.name).toBe('Turmeric');
      expect(result.reviewStats).toHaveProperty('distribution');
    });

    it('should throw 404 when not found', async () => {
      mockFindBySlug.mockResolvedValue(null);
      await expect(productService.getProductBySlug('nope')).rejects.toThrow();
    });
  });

  describe('createProduct', () => {
    it('should create with unique name and sku', async () => {
      mockFindByName.mockResolvedValue(null);
      mockFindBySkuUnique.mockResolvedValue(null);
      mockCreate.mockResolvedValue({ _id: new mongoose.Types.ObjectId(), name: 'New' });
      const result = await productService.createProduct({ name: 'New', sku: 'SKU' });
      expect(result).toHaveProperty('_id');
    });

    it('should throw 409 on duplicate name', async () => {
      mockFindByName.mockResolvedValue({ _id: new mongoose.Types.ObjectId() });
      await expect(productService.createProduct({ name: 'Dup' })).rejects.toThrow();
    });
  });

  describe('deleteProduct', () => {
    it('should soft delete', async () => {
      mockSoftDelete.mockResolvedValue({ _id: new mongoose.Types.ObjectId() });
      const result = await productService.deleteProduct('pid');
      expect(result).toBe(true);
    });

    it('should throw 404 when not found', async () => {
      mockSoftDelete.mockResolvedValue(null);
      await expect(productService.deleteProduct('pid')).rejects.toThrow();
    });
  });

  describe('searchProducts', () => {
    it('should include facets', async () => {
      mockSearch.mockResolvedValue({ products: [], total: 0, page: 1, limit: 20, totalPages: 0 });
      mockGetFacets.mockResolvedValue([{ categories: [], priceRange: {} }]);
      const result = await productService.searchProducts({ q: 'test' });
      expect(result).toHaveProperty('facets');
    });
  });

  describe('getRelatedProducts', () => {
    it('should return related', async () => {
      const pid = new mongoose.Types.ObjectId();
      mockFindById.mockResolvedValue({ _id: pid, categoryId: new mongoose.Types.ObjectId() });
      mockGetRelated.mockResolvedValue([{ _id: new mongoose.Types.ObjectId() }]);
      const result = await productService.getRelatedProducts(pid);
      expect(result).toHaveLength(1);
    });

    it('should throw 404', async () => {
      mockFindById.mockResolvedValue(null);
      await expect(productService.getRelatedProducts(new mongoose.Types.ObjectId())).rejects.toThrow();
    });
  });

  describe('updateProduct', () => {
    it('should update and check duplicates', async () => {
      const pid = new mongoose.Types.ObjectId();
      mockFindByName.mockResolvedValue(null);
      mockFindBySkuUnique.mockResolvedValue(null);
      mockUpdate.mockResolvedValue({ _id: pid, name: 'Updated' });
      const result = await productService.updateProduct(pid, { name: 'Updated' });
      expect(result.name).toBe('Updated');
    });
  });

  describe('getNewArrivals / getBestsellers / getOnSale', () => {
    it('should return new arrivals', async () => {
      mockGetNewArrivals.mockResolvedValue([{}, {}]);
      expect(await productService.getNewArrivals(12)).toHaveLength(2);
    });

    it('should return bestsellers', async () => {
      mockGetBestsellers.mockResolvedValue([{ totalSold: 50 }]);
      expect(await productService.getBestsellers(12)).toHaveLength(1);
    });

    it('should return on-sale', async () => {
      mockGetOnSale.mockResolvedValue([{ comparePrice: 200, price: 150 }]);
      expect(await productService.getOnSale(12)).toHaveLength(1);
    });
  });

  describe('updateStock / getProductById / restoreProduct', () => {
    it('should update stock', async () => {
      mockUpdateStock.mockResolvedValue({ totalSold: 5 });
      expect((await productService.updateStock('pid', 1)).totalSold).toBe(5);
    });

    it('should get by id', async () => {
      mockFindById.mockResolvedValue({ name: 'Test' });
      expect((await productService.getProductById('pid')).name).toBe('Test');
    });

    it('should restore product', async () => {
      mockUpdate.mockResolvedValue({ isDeleted: false });
      expect((await productService.restoreProduct('pid')).isDeleted).toBe(false);
    });
  });

  describe('bulk operations', () => {
    it('should bulk update status', async () => {
      mockBulkWrite.mockResolvedValue({ modifiedCount: 2 });
      expect((await productService.bulkUpdateStatus([{ id: 'a', status: 'active' }])).modifiedCount).toBe(2);
    });

    it('should bulk update products', async () => {
      mockBulkWrite.mockResolvedValue({ modifiedCount: 1 });
      expect((await productService.bulkUpdateProducts([{ id: 'a', data: { price: 100 } }])).modifiedCount).toBe(1);
    });
  });
});
