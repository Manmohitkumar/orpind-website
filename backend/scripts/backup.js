import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import config from '../src/config/index.js';
import logger from '../src/config/logger.js';

const execAsync = promisify(exec);

async function backup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.resolve('backups');
  const filename = `orpind-backup-${timestamp}.gz`;
  const filepath = path.join(backupDir, filename);

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  logger.info('Starting MongoDB backup...');

  try {
    const mongoUri = config.mongoUri;
    const dbName = mongoUri.split('/').pop().split('?')[0];
    const cmd = `mongodump --uri="${mongoUri}" --archive="${filepath}" --gzip`;
    await execAsync(cmd);
    logger.info(`Backup completed: ${filepath}`);
    const stats = fs.statSync(filepath);
    logger.info(`Backup size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

    const backups = fs.readdirSync(backupDir).filter((f) => f.startsWith('orpind-backup-')).sort().reverse();
    while (backups.length > 7) {
      const old = backups.pop();
      fs.unlinkSync(path.join(backupDir, old));
      logger.info(`Removed old backup: ${old}`);
    }
  } catch (error) {
    logger.error('Backup failed:', error.message);
    process.exit(1);
  }
}

backup();
