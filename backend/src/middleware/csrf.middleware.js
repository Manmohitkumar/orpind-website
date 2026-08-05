import crypto from 'crypto';
import config from '../config/index.js';
import { ERROR_CODES } from '../constants/errorCodes.js';

const CSRF_COOKIE = 'csrf-token';
const CSRF_HEADER = 'x-csrf-token';
const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function csrfProtection(req, res, next) {
  if (SAFE_METHODS.includes(req.method)) {
    if (!req.cookies[CSRF_COOKIE]) {
      const token = generateToken();
      res.cookie(CSRF_COOKIE, token, {
        httpOnly: false,
        sameSite: 'strict',
        secure: config.nodeEnv === 'production',
        path: '/',
      });
    }
    return next();
  }

  const cookieToken = req.cookies[CSRF_COOKIE];
  const headerToken = req.headers[CSRF_HEADER];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({
      success: false,
      code: ERROR_CODES.FORBIDDEN,
      message: 'CSRF token validation failed.',
    });
  }

  const newToken = generateToken();
  res.cookie(CSRF_COOKIE, newToken, {
    httpOnly: false,
    sameSite: 'strict',
    secure: config.nodeEnv === 'production',
    path: '/',
  });

  next();
}

export { csrfProtection };
