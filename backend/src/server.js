import http from 'http';
import app from './app.js';
import config from './config/index.js';
import { connectDB, disconnectDB } from './config/database.js';
import { redisClient } from './config/redis.js';
import logger from './config/logger.js';
import { initSentry, createSentryMiddleware, getSentry } from './config/sentry.js';

let server;

async function startServer() {
  try {
    const sentry = await initSentry(app);
    if (sentry) {
      const sentryErrorHandler = createSentryMiddleware();
      app.use(sentryErrorHandler);
    }

    await connectDB();
    logger.info('Database connected successfully');

    if (redisClient && typeof redisClient.connect === 'function' && redisClient.status !== 'ready') {
      try {
        await redisClient.connect();
        logger.info('Redis connected successfully');
      } catch (err) {
        logger.warn('Redis not available — running without it', { error: err.message });
      }
    } else {
      logger.info('Redis connected successfully');
    }

    server = http.createServer(app);

    server.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
    });
  } catch (err) {
    logger.error('Failed to start server', { error: err.message, stack: err.stack });
    process.exit(1);
  }
}

async function gracefulShutdown(signal) {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');

      try {
        await disconnectDB();
        logger.info('MongoDB disconnected');
      } catch (err) {
        logger.error('Error disconnecting MongoDB', { error: err.message });
      }

      try {
        const sentry = getSentry();
        if (sentry?.close) {
          await sentry.close(2000);
        }
      } catch (_) { /* ignore Sentry close errors */ }

      try {
        if (redisClient && redisClient.status !== 'end') {
          await redisClient.quit();
        }
        logger.info('Redis disconnected');
      } catch (err) {
        logger.error('Error disconnecting Redis', { error: err.message });
      }

      logger.info('Graceful shutdown complete');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Graceful shutdown timed out. Forcing exit.');
      process.exit(1);
    }, 30000);
  } else {
    process.exit(0);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', {
    reason: reason instanceof Error ? reason.message : String(reason),
    stack: reason instanceof Error ? reason.stack : undefined,
  });
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', {
    error: err.message,
    stack: err.stack,
  });
  process.exit(1);
});

startServer();
