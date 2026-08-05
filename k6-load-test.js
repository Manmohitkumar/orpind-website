import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000';

const errorRate = new Rate('errors');
const productDetailTrend = new Trend('product_detail_duration');
const searchTrend = new Trend('search_duration');

export const options = {
  stages: [
    { duration: '2m', target: 50 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    errors: ['rate<0.05'],
  },
};

export default function () {
  group('health check', () => {
    const res = http.get(`${BASE_URL}/health`);
    check(res, { 'health returns 200': (r) => r.status === 200 });
    errorRate.add(res.status !== 200);
    sleep(1);
  });

  group('browse products', () => {
    const res = http.get(`${BASE_URL}/api/v1/products?page=1&limit=20`);
    check(res, { 'products list returns 200': (r) => r.status === 200 });
    errorRate.add(res.status !== 200);

    if (res.status === 200) {
      try {
        const body = res.json();
        const products = body?.data?.products || body?.data || [];
        if (products.length > 0) {
          const product = products[0];
          const productId = product._id || product.id;
          if (productId) {
            const detailRes = http.get(`${BASE_URL}/api/v1/products/${productId}`);
            productDetailTrend.add(detailRes.timings.duration);
            check(detailRes, { 'product detail returns 200': (r) => r.status === 200 });
          }
        }
      } catch (e) {
        // response parsing failed
      }
    }
    sleep(2);
  });

  group('search', () => {
    const searchTerms = ['turmeric', 'spices', 'honey', 'rice', 'organic'];
    const term = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    const res = http.get(`${BASE_URL}/api/v1/products?search=${term}&page=1&limit=20`);
    searchTrend.add(res.timings.duration);
    check(res, { 'search returns 200': (r) => r.status === 200 });
    errorRate.add(res.status !== 200);
    sleep(1);
  });

  group('categories', () => {
    const res = http.get(`${BASE_URL}/api/v1/categories`);
    check(res, { 'categories returns 200': (r) => r.status === 200 });
    errorRate.add(res.status !== 200);
    sleep(1);
  });
}
