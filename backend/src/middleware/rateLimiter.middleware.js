import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { getRedis } from "../config/redis.js";
import { ERROR_CODES } from "../constants/errorCodes.js";

let redisClient;

async function getStore() {
  if (!redisClient) {
    redisClient = await getRedis();
  }
  return new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  });
}

const defaultHandler = (req, res) => {
  res.status(429).json({
    success: false,
    code: ERROR_CODES.TOO_MANY_REQUESTS,
    message: "Too many requests. Please try again later.",
  });
};

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: defaultHandler,
  store: undefined,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: defaultHandler,
  store: undefined,
});

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: defaultHandler,
  store: undefined,
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  handler: defaultHandler,
  store: undefined,
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: defaultHandler,
  store: undefined,
});

const adminLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: defaultHandler,
  store: undefined,
});

async function initRateLimitStores() {
  try {
    const store = await getStore();
    globalLimiter.store = store;
    authLimiter.store = new RedisStore({
      sendCommand: (...args) => redisClient.call(...args),
      prefix: "rl:auth:",
    });
    otpLimiter.store = new RedisStore({
      sendCommand: (...args) => redisClient.call(...args),
      prefix: "rl:otp:",
    });
    apiLimiter.store = new RedisStore({
      sendCommand: (...args) => redisClient.call(...args),
      prefix: "rl:api:",
    });
    uploadLimiter.store = new RedisStore({
      sendCommand: (...args) => redisClient.call(...args),
      prefix: "rl:upload:",
    });
    adminLimiter.store = new RedisStore({
      sendCommand: (...args) => redisClient.call(...args),
      prefix: "rl:admin:",
    });
  } catch {
  }
}

export { globalLimiter, authLimiter, otpLimiter, apiLimiter, uploadLimiter, adminLimiter, initRateLimitStores };
