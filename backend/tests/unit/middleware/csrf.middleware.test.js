import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import crypto from 'crypto';

jest.unstable_mockModule('../../../src/config/index.js', () => ({
  __esModule: true,
  default: { nodeEnv: 'test' },
}));

jest.unstable_mockModule('../../../src/constants/errorCodes.js', () => ({
  ERROR_CODES: { FORBIDDEN: 'FORBIDDEN' },
}));

const { csrfProtection } = await import('../../../src/middleware/csrf.middleware.js');

describe('csrfProtection middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { method: 'GET', cookies: {}, headers: {} };
    res = {
      cookie: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('safe methods (GET, HEAD, OPTIONS)', () => {
    it('should set csrf cookie if not present and call next', () => {
      csrfProtection(req, res, next);
      expect(res.cookie).toHaveBeenCalledWith('csrf-token', expect.any(String), expect.objectContaining({
        httpOnly: false, sameSite: 'strict',
      }));
      expect(next).toHaveBeenCalled();
    });

    it('should not set cookie if already present', () => {
      req.cookies['csrf-token'] = 'existing-token';
      csrfProtection(req, res, next);
      expect(res.cookie).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    it('should pass for HEAD method', () => {
      req.method = 'HEAD';
      csrfProtection(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should pass for OPTIONS method', () => {
      req.method = 'OPTIONS';
      csrfProtection(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('unsafe methods (POST, PUT, PATCH, DELETE)', () => {
    it('should pass when cookie and header match', () => {
      const token = crypto.randomBytes(32).toString('hex');
      req.method = 'POST';
      req.cookies['csrf-token'] = token;
      req.headers['x-csrf-token'] = token;
      csrfProtection(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalledWith('csrf-token', expect.any(String), expect.any(Object));
    });

    it('should fail when cookie missing', () => {
      req.method = 'POST';
      req.headers['x-csrf-token'] = 'some-token';
      csrfProtection(req, res, next);
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should fail when header missing', () => {
      req.method = 'POST';
      req.cookies['csrf-token'] = 'some-token';
      csrfProtection(req, res, next);
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should fail when cookie and header do not match', () => {
      req.method = 'POST';
      req.cookies['csrf-token'] = 'cookie-token';
      req.headers['x-csrf-token'] = 'header-token';
      csrfProtection(req, res, next);
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should rotate token on successful validation', () => {
      const token = crypto.randomBytes(32).toString('hex');
      req.method = 'PUT';
      req.cookies['csrf-token'] = token;
      req.headers['x-csrf-token'] = token;
      csrfProtection(req, res, next);
      expect(res.cookie).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    it('should fail for DELETE without token', () => {
      req.method = 'DELETE';
      csrfProtection(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should fail for PATCH without token', () => {
      req.method = 'PATCH';
      csrfProtection(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});
