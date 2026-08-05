import Redis from "ioredis";
import config from "./index.js";
import logger from "./logger.js";

function createRedisClient() {
  const client = new Redis(config.redisUrl, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > 3) {
        logger.error("Redis max retry attempts reached — running without Redis");
        return null;
      }
      return null; // Don't retry automatically; let server.js handle it
    },
    enableReadyCheck: true,
    connectTimeout: 5000,
    lazyConnect: true,
  });

  client.on("connect", () => {
    logger.info("Redis client connected");
  });

  client.on("ready", () => {
    logger.info("Redis client ready");
  });

  client.on("error", (err) => {
    logger.error("Redis client error", { error: err.message });
  });

  client.on("reconnecting", (delay) => {
    logger.warn(`Redis client reconnecting in ${delay}ms`);
  });

  client.on("close", () => {
    logger.warn("Redis client connection closed");
  });

  return client;
}

const redisClient = createRedisClient();

async function getRedis() {
  if (redisClient.status !== "ready") {
    try {
      await redisClient.connect();
    } catch (err) {
      logger.error("Failed to connect Redis on demand", { error: err.message });
      throw err;
    }
  }
  return redisClient;
}

export { redisClient, getRedis };
