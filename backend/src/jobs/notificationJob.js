import Notification from '../models/notification.model.js';
import User from '../models/user.model.js';
import emailService from '../services/email.service.js';
import smsService from '../services/sms.service.js';
import whatsappService from '../services/whatsapp.service.js';
import logger from '../config/logger.js';

async function dispatchNotification(job) {
  const { notificationId } = job.data;
  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      logger.warn('Notification not found', { notificationId });
      return null;
    }

    const user = await User.findById(notification.userId);
    if (!user) {
      logger.warn('User not found for notification', { notificationId, userId: notification.userId });
      return null;
    }

    const results = { inApp: true };

    if (notification.channels?.email?.enabled && user.email) {
      try {
        await emailService.sendEmail({
          to: user.email,
          subject: notification.title,
          html: `<h1>${notification.title}</h1><p>${notification.message}</p>`,
        });
        results.email = true;
        notification.channels.email.sent = true;
        notification.channels.email.sentAt = new Date();
      } catch (error) {
        logger.error('Email notification dispatch failed', { notificationId, error: error.message });
        results.email = false;
      }
    }

    if (notification.channels?.sms?.enabled && user.phone) {
      try {
        await smsService.sendSMS(user.phone, `${notification.title}: ${notification.message}`);
        results.sms = true;
        notification.channels.sms.sent = true;
        notification.channels.sms.sentAt = new Date();
      } catch (error) {
        logger.error('SMS notification dispatch failed', { notificationId, error: error.message });
        results.sms = false;
      }
    }

    if (notification.channels?.whatsapp?.enabled && user.phone) {
      try {
        await whatsappService.sendWhatsAppMessage(user.phone, `${notification.title}: ${notification.message}`);
        results.whatsapp = true;
        notification.channels.whatsapp.sent = true;
        notification.channels.whatsapp.sentAt = new Date();
      } catch (error) {
        logger.error('WhatsApp notification dispatch failed', { notificationId, error: error.message });
        results.whatsapp = false;
      }
    }

    await notification.save();
    logger.info('Notification dispatched', { notificationId, results });
    return results;
  } catch (error) {
    logger.error('Notification dispatch failed', { notificationId, error: error.message });
    throw error;
  }
}

async function dispatchBulkNotifications(job) {
  const { userIds, type, title, message, data, channels } = job.data;
  try {
    const users = await User.find({ _id: { $in: userIds }, isDeleted: false });
    let dispatched = 0;
    let failed = 0;

    for (const user of users) {
      try {
        const notification = await Notification.create({
          userId: user._id,
          type,
          title,
          message,
          data,
          channels: {
            inApp: { sent: true, read: false },
            email: channels?.email ? { enabled: true } : {},
            sms: channels?.sms ? { enabled: true } : {},
            whatsapp: channels?.whatsapp ? { enabled: true } : {},
          },
        });

        if (channels?.email && user.email) {
          await emailService.sendEmail({
            to: user.email,
            subject: title,
            html: `<h1>${title}</h1><p>${message}</p>`,
          });
          notification.channels.email.sent = true;
          notification.channels.email.sentAt = new Date();
          await notification.save();
        }

        dispatched++;
      } catch (error) {
        failed++;
        logger.error('Bulk notification dispatch failed for user', { userId: user._id, error: error.message });
      }
    }

    logger.info('Bulk notifications dispatched', { dispatched, failed, total: userIds.length });
    return { dispatched, failed, total: userIds.length };
  } catch (error) {
    logger.error('Bulk notification dispatch failed', { error: error.message });
    throw error;
  }
}

export { dispatchNotification, dispatchBulkNotifications };
