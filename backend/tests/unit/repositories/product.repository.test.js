import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import mongoose from 'mongoose';

const mockFind = jest.fn();
const mockFindOne = jest.fn();
const mockFindById = jest.fn();
const mockCreate = jest.fn();
const mockBulkWrite = jest.fn();
const mockAggregate = jest.fn();
const mockCountDocuments = jest.fn();
const mockDistinct = jest.fn();
const mockExists = jest.fn();
const mockFindOneAndUpdate = jest.fn();
const mockFindByIdAndDelete = jest.fn();

function createQueryChain(resolvedValue) {
  const chain = {};
  chain._resolved = resolvedValue;
  chain.populate = jest.fn().mockReturnValue(chain);
  chain.select = jest.fn().mockReturnValue(chain);
  chain.sort = jest.fn().mockReturnValue(chain);
  chain.skip = jest.fn().mockReturnValue(chain);
  chain.limit = jest.fn().mockReturnValue(chain);
  chain.then = (onFulfill) => Promise.resolve(chain._resolved).then(onFulfill);
  chain.catch = (onReject) => Promise.resolve(chain._resolved).catch(onReject);
  return chain;
}

jest.unstable_mockModule('../../../src/models/product.model.js', () => {
  const MockProduct = function (data) {
    Object.assign(this, data);
  };
  MockProduct.find = mockFind;
  MockProduct.findOne = mockFindOne;
  MockProduct.findById = mockFindById;
  MockProduct.create = mockCreate;
  MockProduct.bulkWrite = mockBulkWrite;
  MockProduct.aggregate = mockAggregate;
  MockProduct.countDocuments = mockCountDocuments;
  MockProduct.distinct = mockDistinct;
  MockProduct.exists = mockExists;
  MockProduct.findOneAndUpdate = mockFindOneAndUpdate;
  MockProduct.findByIdAndDelete = mockFindByIdAndDelete;
  return { __esModule: true, default: MockProduct };
});

const productRepository = (await import('../../../src/repositories/product.repository.js')).default;

describe('ProductRepository', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  describe('findBySlug', () => {
    it('should find product by slug', async () => {
      const mockProduct = { _id: new mongoose.Types.ObjectId(), slug: 'test-product' };
      mockFindOne.mockResolvedValue(mockProduct);
      const result = await productRepository.findBySlug('test-product');
      expect(result).toEqual(mockProduct);
      expect(mockFindOne).toHaveBeenCalledWith({ slug: 'test-product', isDeleted: { $ne: true } });
    });
  });

  describe('findBySku', () => {
    it('should find product by sku', async () => {
      mockFindOne.mockResolvedValue({ sku: 'SKU-001' });
      const result = await productRepository.findBySku('SKU-001');
      expect(result.sku).toBe('SKU-001');
    });
  });

  describe('findByName', () => {
    it('should exclude id when provided', async () => {
      const excludeId = new mongoose.Types.ObjectId();
      mockFindOne.mockResolvedValue(null);
      await productRepository.findByName('Test', excludeId);
      expect(mockFindOne).toHaveBeenCalledWith({ name: 'Test', isDeleted: false, _id: { $ne: excludeId } });
    });
  });

  describe('search', () => {
    it('should return paginated results', async () => {
      mockFind.mockReturnValue(createQueryChain([{ name: 'Turmeric' }]));
      mockCountDocuments.mockResolvedValue(1);

      const result = await productRepository.search('turmeric', { page: 1, limit: 20 });
      expect(result.products).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('getFeatured', () => {
    it('should return featured products', async () => {
      mockFind.mockReturnValue(createQueryChain([{ isFeatured: true }]));
      const result = await productRepository.getFeatured(5);
      expect(result).toHaveLength(1);
    });
  });

  describe('getRelated', () => {
    it('should exclude current product', async () => {
      const pid = new mongoose.Types.ObjectId();
      const catId = new mongoose.Types.ObjectId();
      mockFind.mockReturnValue(createQueryChain([{ _id: new mongoose.Types.ObjectId() }]));
      const result = await productRepository.getRelated(pid, catId, 8);
      expect(result).toHaveLength(1);
    });
  });

  describe('updateStock', () => {
    it('should increment totalSold', async () => {
      mockFindOneAndUpdate.mockResolvedValue({ totalSold: 5 });
      const result = await productRepository.updateStock('pid', 1);
      expect(result.totalSold).toBe(5);
    });
  });

  describe('autocomplete', () => {
    it('should return empty for short query', async () => {
      const result = await productRepository.autocomplete('a');
      expect(result).toEqual([]);
    });

    it('should return matching products', async () => {
      mockFind.mockReturnValue(createQueryChain([{ name: 'Turmeric' }]));
      const result = await productRepository.autocomplete('turmeric', 5);
      expect(result).toHaveLength(1);
    });
  });

  describe('filterProducts', () => {
    it('should filter with sort', async () => {
      mockFind.mockReturnValue(createQueryChain([]));
      mockCountDocuments.mockResolvedValue(0);
      const result = await productRepository.filterProducts({ sort: 'price_desc' });
      expect(result.products).toEqual([]);
    });
  });

  describe('getFacets', () => {
    it('should return aggregated facets', async () => {
      mockAggregate.mockResolvedValue([{ categories: [], priceRange: {} }]);
      const result = await productRepository.getFacets();
      expect(result).toHaveLength(1);
    });
  });
});
