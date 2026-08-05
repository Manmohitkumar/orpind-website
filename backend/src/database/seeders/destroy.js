import mongoose from 'mongoose';
import config from '../../config/index.js';
import logger from '../../config/logger.js';

async function destroy() {
  try {
    await mongoose.connect(config.mongoUri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
    });
    logger.info('Connected to MongoDB for destruction');

    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].drop();
      logger.info(`Dropped collection: ${key}`);
    }

    logger.info('All collections dropped successfully');
    process.exit(0);
  } catch (err) {
    logger.error('Destruction failed', { error: err.message, stack: err.stack });
    process.exit(1);
  }
}

destroy();
