## 18. Testing Strategy

### Test Pyramid

```
        ╱╲
       ╱  ╲          E2E Tests (10%)
      ╱    ╲         - User flows
     ╱──────╲        - Critical paths
    ╱        ╲       
   ╱          ╲      Integration Tests (30%)
  ╱            ╲     - API tests
 ╱──────────────╲    - Database tests
╱                ╲   - Service integration
╱                  ╲ 
╱────────────────────╲ Unit Tests (60%)
╱                      ╲ - Service logic
╱────────────────────────╲ - Repository logic
╱────────────────────────────╲ - Utility functions
```

### Test Coverage Targets

| Layer | Coverage Target | Focus |
|---|---|---|
| Unit Tests | 80% | Service business logic, utility functions |
| Integration Tests | 70% | API endpoints, database operations |
| E2E Tests | Critical paths only | Registration → Purchase → Delivery flow |

### Unit Test Examples

```javascript
// Service unit test (mocked repository)
describe('OrderService', () => {
  describe('createOrder', () => {
    it('should create order with valid items', async () => {
      // Arrange
      mockProductRepo.findById.mockResolvedValue(product);
      mockOrderRepo.create.mockResolvedValue(order);
      
      // Act
      const result = await orderService.createOrder(orderData);
      
      // Assert
      expect(result).toHaveProperty('orderNumber');
      expect(mockOrderRepo.create).toHaveBeenCalled();
    });

    it('should throw error for out-of-stock product', async () => {
      mockProductRepo.findById.mockResolvedValue({ ...product, stockQuantity: 0 });
      
      await expect(orderService.createOrder(orderData))
        .rejects.toThrow('Insufficient stock');
    });
  });
});
```

### Integration Test Examples

```javascript
// API integration test
describe('POST /api/v1/orders', () => {
  it('should create order with valid data', async () => {
    const response = await request(app)
      .post('/api/v1/orders')
      .set('Cookie', [`access_token=${validToken}`])
      .send(orderPayload);
    
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('orderNumber');
  });

  it('should return 401 without auth token', async () => {
    const response = await request(app)
      .post('/api/v1/orders')
      .send(orderPayload);
    
    expect(response.status).toBe(401);
  });
});
```

### Test Setup

```javascript
// tests/setup.js
const { MongoMemoryServer } = require('mongodb-memory-server');
const Redis = require('ioredis-mock');

let mongoServer;
let redisClient;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.DATABASE_URL = mongoServer.getUri();
  redisClient = new Redis();
});

afterAll(async () => {
  await mongoServer.stop();
  await redisClient.quit();
});

afterEach(async () => {
  // Clean database between tests
  await mongoose.connection.db.dropDatabase();
});
```

### Load Testing

```javascript
// k6 load test
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },   // ramp up
    { duration: '5m', target: 100 },   // stay at 100
    { duration: '2m', target: 500 },   // spike to 500
    { duration: '5m', target: 500 },   // stay at 500
    { duration: '2m', target: 0 },     // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<300'],  // 95% under 300ms
    http_req_failed: ['rate<0.01'],    // <1% error rate
  },
};

export default function () {
  const res = http.get('http://localhost:3000/api/v1/products');
  check(res, { 'status was 200': (r) => r.status === 200 });
  sleep(1);
}
```

### Testing Tools

| Tool | Purpose |
|---|---|
| Jest | Unit testing framework |
| Supertest | API integration testing |
| mongodb-memory-server | In-memory MongoDB for tests |
| ioredis-mock | In-memory Redis for tests |
| k6 | Load testing |
| OWASP ZAP | Security testing |
| Istanbul/nyc | Code coverage |
