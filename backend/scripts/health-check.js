import mongoose from 'mongoose';
import Redis from 'ioredis';
import config from '../src/config/index.js';

async function healthCheck() {
  const results = { status: 'ok', checks: {} };

  try {
    await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 5000 });
    results.checks.mongodb = { status: 'up', latency: Date.now() };
    await mongoose.disconnect();
  } catch (error) {
    results.checks.mongodb = { status: 'down', error: error.message };
    results.status = 'degraded';
  }

  try {
    const redis = new Redis(config.redis.url, { connectTimeout: 5000, maxRetriesPerRequest: 1 });
    const start = Date.now();
    await redis.ping();
    results.checks.redis = { status: 'up', latency: Date.now() - start };
    await redis.quit();
  } catch (error) {
    results.checks.redis = { status: 'down', error: error.message };
    results.status = 'degraded';
  }

  console.log(JSON.stringify(results, null, 2));
  process.exit(results.status === 'ok' ? 0 : 1);
}

healthCheck();
