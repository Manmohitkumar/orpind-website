import { error } from '../utils/apiResponse.js';

const createRateLimiter = ({ windowMs = 60000, max = 100, keyGenerator = (req) => req.ip } = {}) => {
  const hits = new Map();
  const cleanup = () => {
    const now = Date.now();
    for (const [key, data] of hits.entries()) {
      if (now - data.windowStart > windowMs) {
        hits.delete(key);
      }
    }
  };
  const interval = setInterval(cleanup, windowMs);
  if (interval.unref) interval.unref();
  return (req, res, next) => {
    const key = keyGenerator(req);
    const now = Date.now();
    let record = hits.get(key);
    if (!record || now - record.windowStart > windowMs) {
      record = { windowStart: now, count: 0 };
      hits.set(key, record);
    }
    record.count += 1;
    const remaining = Math.max(0, max - record.count);
    const resetTime = record.windowStart + windowMs;
    res.set('X-RateLimit-Limit', String(max));
    res.set('X-RateLimit-Remaining', String(remaining));
    res.set('X-RateLimit-Reset', String(Math.ceil(resetTime / 1000)));
    if (record.count > max) {
      const retryAfter = Math.ceil((resetTime - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      return error(res, 429, 'RATE_LIMIT_EXCEEDED', 'Too many requests. Please try again later.', { retryAfter });
    }
    next();
  };
};

const globalLimiter = createRateLimiter({ windowMs: 60000, max: 200 });
const authLimiter = createRateLimiter({ windowMs: 900000, max: 20 });
const otpLimiter = createRateLimiter({ windowMs: 60000, max: 5 });
const apiLimiter = createRateLimiter({ windowMs: 60000, max: 100 });

export { createRateLimiter, globalLimiter, authLimiter, otpLimiter, apiLimiter };
