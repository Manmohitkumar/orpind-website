import emailService from '../../services/email.service.js';
import { renderTemplate } from '../../emails/render.js';
import logger from '../../config/logger.js';

const TEMPLATE_SUBJECT_MAP = {
  welcome: 'Welcome to Orpind!',
  verification: 'Verify Your Email Address',
  passwordReset: 'Reset Your Password',
  orderConfirmation: 'Order Confirmed',
  orderShipped: 'Your Order Has Been Shipped',
  orderDelivered: 'Order Delivered Successfully',
  refundProcessed: 'Your Refund Has Been Processed',
  newsletter: '',
  invoice: 'Your Invoice from Orpind',
};

export async function sendEmailNotification(to, template, data = {}) {
  try {
    const subject = data.subject || TEMPLATE_SUBJECT_MAP[template] || 'Notification from Orpind';
    const html = await renderTemplate(template, data);

    const result = await emailService.sendEmail({
      to,
      subject,
      html,
    });

    logger.info('Email notification sent', { to, template, messageId: result.messageId });
    return { success: true, messageId: result.messageId, provider: result.provider };
  } catch (error) {
    logger.error('Email notification failed', { to, template, error: error.message });
    return { success: false, error: error.message };
  }
}

export default sendEmailNotification;
