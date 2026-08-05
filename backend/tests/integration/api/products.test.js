import { jest, describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../../src/app.js';
import Product from '../../../src/models/product.model.js';
import Category from '../../../src/models/category.model.js';
import { sampleProducts } from '../../fixtures/products.js';

let mongoServer;
let categoryId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    binary: {
      platform: 'win32',
      arch: 'x64',
    },
  });
  await mongoose.connect(mongoServer.getUri());

  const category = await Category.create({
    name: 'Test Category',
    slug: 'test-category',
    description: 'A test category',
  });
  categoryId = category._id;

  await Product.insertMany(
    sampleProducts.map((p) => ({ ...p, categoryId, status: 'active' }))
  );

  await Product.collection.createIndex({ name: 'text', description: 'text', tags: 'text' });
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

afterEach(async () => {
  await Product.deleteMany({});
  await Category.deleteMany({});
});

describe('Products API', () => {
  describe('GET /api/v1/products', () => {
    it('should return paginated products', async () => {
      const res = await request(app).get('/api/v1/products').expect(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('products');
      expect(res.body.data).toHaveProperty('total');
    });

    it('should filter by category', async () => {
      await Product.insertMany(
        sampleProducts.map((p) => ({ ...p, categoryId, status: 'active' }))
      );
      const res = await request(app)
        .get(`/api/v1/products?category=${categoryId}`)
        .expect(200);
      expect(res.body.success).toBe(true);
    });

    it('should sort by price ascending', async () => {
      await Product.insertMany(
        sampleProducts.map((p) => ({ ...p, categoryId, status: 'active' }))
      );
      const res = await request(app)
        .get('/api/v1/products?sort=price_asc')
        .expect(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /api/v1/products/featured', () => {
    it('should return featured products', async () => {
      await Product.insertMany(
        sampleProducts
          .filter((p) => p.isFeatured)
          .map((p) => ({ ...p, categoryId, status: 'active' }))
      );

      const res = await request(app)
        .get('/api/v1/products/featured')
        .expect(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
    });
  });

  describe('GET /api/v1/products/:slug', () => {
    it('should return a product by slug', async () => {
      await Product.create({
        ...sampleProducts[0],
        categoryId,
        status: 'active',
        slug: 'test-turmeric-powder',
      });

      const res = await request(app)
        .get('/api/v1/products/test-turmeric-powder')
        .expect(200);
      expect(res.body).toHaveProperty('success', true);
    });

    it('should return 404 for non-existent slug', async () => {
      const res = await request(app)
        .get('/api/v1/products/non-existent-product')
        .expect(404);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/v1/products/search', () => {
    it('should search products by query', async () => {
      await Product.insertMany(
        sampleProducts.map((p) => ({ ...p, categoryId, status: 'active' }))
      );

      const res = await request(app)
        .get('/api/v1/products/search?q=turmeric')
        .expect(200);
      expect(res.body).toHaveProperty('success', true);
    });
  });

  describe('GET /api/v1/products/bestsellers', () => {
    it('should return bestsellers', async () => {
      await Product.insertMany(
        sampleProducts.map((p) => ({ ...p, categoryId, status: 'active' }))
      );

      const res = await request(app)
        .get('/api/v1/products/bestsellers')
        .expect(200);
      expect(res.body).toHaveProperty('success', true);
    });
  });
});
