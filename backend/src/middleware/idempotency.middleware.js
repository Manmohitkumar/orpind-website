import { getRedis } from '../config/redis.js';
import { ERROR_CODES } from '../constants/errorCodes.js';

const IDEMPOTENCY_TTL = 86400;

async function idempotency(req, res, next) {
  if (!['POST', 'PUT', 'PATCH'].includes(req.method)) return next();

  const key = req.headers['idempotency-key'];
  if (!key) return next();

  if (typeof key !== 'string' || key.length < 8 || key.length > 64) {
    return res.status(400).json({
      success: false,
      code: ERROR_CODES.BAD_REQUEST,
      message: 'Idempotency-Key must be a string between 8 and 64 characters.',
    });
  }

  const routeKey = `${req.originalUrl}:${key}`;

  try {
    const redis = await getRedis();
    const existing = await redis.get(routeKey);

    if (existing) {
      const cached = JSON.parse(existing);
      return res.status(cached.statusCode).json(cached.body);
    }

    const originalJson = res.json.bind(res);
    res.json = function (body) {
      redis.set(routeKey, JSON.stringify({ statusCode: res.statusCode, body }), 'EX', IDEMPOTENCY_TTL).catch(() => {});
      return originalJson(body);
    };

    next();
  } catch {
    next();
  }
}

export { idempotency };
