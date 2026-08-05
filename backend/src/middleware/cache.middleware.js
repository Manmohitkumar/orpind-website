import { getRedis } from "../config/redis.js";

const cacheMiddleware = (ttl) => {
  return async (req, res, next) => {
    try {
      const redis = await getRedis();
      const userId = req.user?._id?.toString() || "anonymous";
      const cacheKey = `cache:${req.originalUrl}:${userId}`;

      const cached = await redis.get(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        return res.status(parsed.statusCode || 200).json(parsed.body);
      }

      const originalJson = res.json.bind(res);
      res.json = async (body) => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            await redis.set(
              cacheKey,
              JSON.stringify({ statusCode: res.statusCode, body }),
              "EX",
              ttl
            );
          }
        } catch {
        }
        return originalJson(body);
      };

      next();
    } catch {
      next();
    }
  };
};

const invalidateCache = async (pattern) => {
  try {
    const redis = await getRedis();
    const keys = await redis.keys(`cache:${pattern}*`);
    if (keys.length > 0) {
      const pipeline = redis.pipeline();
      keys.forEach((key) => pipeline.del(key));
      await pipeline.exec();
    }
  } catch {
  }
};

export { cacheMiddleware, invalidateCache };
