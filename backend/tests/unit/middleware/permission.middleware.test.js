import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockRedisGet = jest.fn();
const mockRedisSet = jest.fn();
const mockPopulate = jest.fn();

jest.unstable_mockModule('../../../src/config/redis.js', () => ({
  getRedis: jest.fn().mockResolvedValue({ get: mockRedisGet, set: mockRedisSet }),
}));

jest.unstable_mockModule('../../../src/constants/errorCodes.js', () => ({
  ERROR_CODES: { UNAUTHORIZED: 'UNAUTHORIZED', FORBIDDEN: 'FORBIDDEN', PERMISSION_DENIED: 'PERMISSION_DENIED' },
}));

jest.unstable_mockModule('mongoose', () => {
  const mockFindById = jest.fn(() => ({ populate: mockPopulate }));
  return {
    Types: { ObjectId: class { toString() { return 'mock-id'; } } },
    default: {
      Types: { ObjectId: class { toString() { return 'mock-id'; } } },
      model: jest.fn(() => ({ findById: mockFindById })),
    },
  };
});

const { requirePermission } = await import('../../../src/middleware/permission.middleware.js');

describe('requirePermission middleware', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { user: { _id: { toString: () => 'user123' }, role: 'role123' } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  it('should return 401 when user is not authenticated', async () => {
    req.user = null;
    await requirePermission('PRODUCTS:READ')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should return 403 when permission is missing from cache', async () => {
    mockRedisGet.mockResolvedValue(JSON.stringify(['ORDERS:READ', 'PRODUCTS:READ']));
    await requirePermission('PRODUCTS:DELETE')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('should call next when permission is found in cache', async () => {
    mockRedisGet.mockResolvedValue(JSON.stringify(['PRODUCTS:READ', 'PRODUCTS:CREATE']));
    await requirePermission('PRODUCTS:CREATE')(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should fetch from DB when cache is empty', async () => {
    mockRedisGet.mockResolvedValue(null);
    mockPopulate.mockResolvedValue({ isActive: true, permissions: [{ name: 'PRODUCTS:READ' }] });

    await requirePermission('PRODUCTS:READ')(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(mockRedisSet).toHaveBeenCalledWith(expect.any(String), expect.any(String), 'EX', 300);
  });

  it('should return 403 when role is inactive', async () => {
    mockRedisGet.mockResolvedValue(null);
    mockPopulate.mockResolvedValue({ isActive: false, permissions: [] });

    await requirePermission('ANY:PERM')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
