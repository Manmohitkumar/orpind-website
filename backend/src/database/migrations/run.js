import mongoose from 'mongoose';
import logger from '../../config/logger.js';
import config from '../../config/index.js';

const migrations = [];

function registerMigration(name, up) {
  migrations.push({ name, up, executed: false });
}

async function getMigrationModel() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(config.mongoUri);
  }
  const schema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    executedAt: { type: Date, default: Date.now },
  });
  return mongoose.model('Migration', schema);
}

async function runMigrations() {
  const Migration = await getMigrationModel();
  const executed = await Migration.find().select('name').lean();
  const executedNames = new Set(executed.map((m) => m.name));

  let count = 0;
  for (const migration of migrations) {
    if (executedNames.has(migration.name)) {
      logger.info(`Skipping already executed migration: ${migration.name}`);
      continue;
    }
    logger.info(`Running migration: ${migration.name}`);
    try {
      await migration.up();
      await Migration.create({ name: migration.name });
      count++;
      logger.info(`Migration completed: ${migration.name}`);
    } catch (error) {
      logger.error(`Migration failed: ${migration.name} - ${error.message}`);
      throw error;
    }
  }
  logger.info(`All migrations complete. ${count} new migration(s) applied.`);
}

async function rollbackLast() {
  const Migration = await getMigrationModel();
  const last = await Migration.findOne().sort({ executedAt: -1 });
  if (!last) {
    logger.info('No migrations to rollback.');
    return;
  }
  const migration = migrations.find((m) => m.name === last.name);
  if (migration && migration.down) {
    logger.info(`Rolling back migration: ${last.name}`);
    await migration.down();
    await Migration.deleteOne({ _id: last._id });
    logger.info(`Rolled back: ${last.name}`);
  } else {
    logger.warn(`No down function for migration: ${last.name}`);
  }
}

const command = process.argv[2];

try {
  if (command === 'rollback') {
    await rollbackLast();
  } else {
    await runMigrations();
  }
  await mongoose.disconnect();
  process.exit(0);
} catch (error) {
  logger.error('Migration error:', error);
  await mongoose.disconnect();
  process.exit(1);
}

export { registerMigration, runMigrations, rollbackLast };
