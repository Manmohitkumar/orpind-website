import Redis from "ioredis";
import config from "./index.js";

const defaultConnectionOptions = {
  host: new URL(config.redisUrl).hostname || "localhost",
  port: parseInt(new URL(config.redisUrl).port, 10) || 6379,
  password: new URL(config.redisUrl).password || undefined,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

function createQueueConnection() {
  return new Redis({
    host: defaultConnectionOptions.host,
    port: defaultConnectionOptions.port,
    password: defaultConnectionOptions.password,
    maxRetriesPerRequest: defaultConnectionOptions.maxRetriesPerRequest,
    enableReadyCheck: defaultConnectionOptions.enableReadyCheck,
    retryStrategy(times) {
      if (times > 10) {
        return null;
      }
      return Math.min(times * 200, 5000);
    },
  });
}

export { createQueueConnection, defaultConnectionOptions };
