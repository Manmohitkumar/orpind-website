import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import AuditLog from '../models/auditLog.model.js';
import Notification from '../models/notification.model.js';
import Media from '../models/media.model.js';
import cloudinary from '../config/cloudinary.js';
import { getRedis } from '../config/redis.js';
import logger from '../config/logger.js';

async function cleanTempFiles() {
  const tempDir = os.tmpdir();
  const now = Date.now();
  let cleaned = 0;

  try {
    const files = await fs.readdir(tempDir);
    for (const file of files) {
      if (!file.startsWith('upload_') && !file.startsWith('tmp_') && !file.startsWith('multer_')) continue;
      try {
        const filePath = path.join(tempDir, file);
        const stat = await fs.stat(filePath);
        const age = now - stat.mtimeMs;
        if (age > 3600000) {
          await fs.unlink(filePath);
          cleaned++;
        }
      } catch {
        // skip files that can't be accessed
      }
    }
    logger.info('Temp files cleaned', { count: cleaned });
    return { cleaned };
  } catch (error) {
    logger.error('Temp file cleanup failed', { error: error.message });
    throw error;
  }
}

async function cleanExpiredSessions() {
  try {
    const User = (await import('../models/user.model.js')).default;
    const result = await User.updateMany(
      {},
      { $pull: { refreshTokens: { expiresAt: { $lt: new Date() } } } }
    );
    logger.info('Expired sessions cleaned', { modified: result.modifiedCount });
    return { modified: result.modifiedCount };
  } catch (error) {
    logger.error('Session cleanup failed', { error: error.message });
    throw error;
  }
}

async function cleanOldAuditLogs(ttlDays = 90) {
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - ttlDays);
    const result = await AuditLog.deleteMany({ createdAt: { $lt: cutoff } });
    logger.info('Old audit logs cleaned', { deleted: result.deletedCount, olderThan: ttlDays });
    return { deleted: result.deletedCount };
  } catch (error) {
    logger.error('Audit log cleanup failed', { error: error.message });
    throw error;
  }
}

async function cleanOrphanedMedia() {
  try {
    const orphans = await Media.find({ usageCount: { $lte: 0 }, isDeleted: false });
    let deleted = 0;

    for (const media of orphans) {
      try {
        await cloudinary.uploader.destroy(media.publicId);
        media.isDeleted = true;
        await media.save();
        deleted++;
      } catch (err) {
        logger.warn('Failed to delete orphaned media from cloudinary', { mediaId: media._id, error: err.message });
        media.isDeleted = true;
        await media.save({ validateBeforeSave: false });
        deleted++;
      }
    }

    logger.info('Orphaned media cleaned', { count: deleted });
    return { deleted };
  } catch (error) {
    logger.error('Orphaned media cleanup failed', { error: error.message });
    throw error;
  }
}

async function cleanExpiredOTPs() {
  try {
    const redis = await getRedis();
    const keys = await redis.keys('otp:*');
    let cleaned = 0;
    for (const key of keys) {
      const ttl = await redis.ttl(key);
      if (ttl <= 0) {
        await redis.del(key);
        cleaned++;
      }
    }
    logger.info('Expired OTPs cleaned', { count: cleaned });
    return { cleaned };
  } catch (error) {
    logger.error('OTP cleanup failed', { error: error.message });
    throw error;
  }
}

async function cleanOldNotifications(ttlDays = 90) {
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - ttlDays);
    const result = await Notification.deleteMany({ createdAt: { $lt: cutoff }, isRead: true });
    logger.info('Old notifications cleaned', { deleted: result.deletedCount });
    return { deleted: result.deletedCount };
  } catch (error) {
    logger.error('Notification cleanup failed', { error: error.message });
    throw error;
  }
}

async function runFullCleanup() {
  const [temp, sessions, auditLogs, orphans, otps, notifications] = await Promise.allSettled([
    cleanTempFiles(),
    cleanExpiredSessions(),
    cleanOldAuditLogs(),
    cleanOrphanedMedia(),
    cleanExpiredOTPs(),
    cleanOldNotifications(),
  ]);

  return {
    temp: temp.status === 'fulfilled' ? temp.value : { error: temp.reason.message },
    sessions: sessions.status === 'fulfilled' ? sessions.value : { error: sessions.reason.message },
    auditLogs: auditLogs.status === 'fulfilled' ? auditLogs.value : { error: auditLogs.reason.message },
    orphans: orphans.status === 'fulfilled' ? orphans.value : { error: orphans.reason.message },
    otps: otps.status === 'fulfilled' ? otps.value : { error: otps.reason.message },
    notifications: notifications.status === 'fulfilled' ? notifications.value : { error: notifications.reason.message },
  };
}

export {
  cleanTempFiles,
  cleanExpiredSessions,
  cleanOldAuditLogs,
  cleanOrphanedMedia,
  cleanExpiredOTPs,
  cleanOldNotifications,
  runFullCleanup,
};
