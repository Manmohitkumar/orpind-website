import { jest, describe, it, expect, beforeEach } from '@jest/globals';

jest.unstable_mockModule('../../../src/config/index.js', () => ({
  __esModule: true,
  default: {},
}));

jest.unstable_mockModule('../../../src/constants/errorCodes.js', () => ({
  ERROR_CODES: { CONFLICT: 'CONFLICT' },
}));

const mockGet = jest.fn();
const mockSet = jest.fn();

jest.unstable_mockModule('../../../src/config/redis.js', () => ({
  getRedis: jest.fn().mockResolvedValue({ get: mockGet, set: mockSet }),
}));

const { idempotency } = await import('../../../src/middleware/idempotency.middleware.js');

describe('idempotency middleware', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { method: 'POST', headers: {}, originalUrl: '/api/v1/orders' };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn(), setHeader: jest.fn() };
    next = jest.fn();
  });

  it('should pass when no idempotency key is provided', async () => {
    await idempotency(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should pass for GET requests', async () => {
    req.method = 'GET';
    req.headers['idempotency-key'] = 'key-123';
    await idempotency(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should return cached response when key exists', async () => {
    req.headers['idempotency-key'] = 'existing-key';
    mockGet.mockResolvedValue(JSON.stringify({ statusCode: 200, body: { success: true } }));
    await idempotency(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it('should intercept res.json to cache response', async () => {
    req.headers['idempotency-key'] = 'new-key-12345';
    mockGet.mockResolvedValue(null);
    mockSet.mockResolvedValue('OK');
    await idempotency(req, res, next);
    expect(next).toHaveBeenCalled();
    res.json({ success: true });
    expect(mockSet).toHaveBeenCalledWith(expect.stringContaining('new-key-12345'), expect.any(String), 'EX', 86400);
  });
});
