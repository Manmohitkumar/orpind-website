import smsService from '../../services/sms.service.js';
import logger from '../../config/logger.js';

export async function sendSmsNotification(phone, message) {
  if (!phone) {
    logger.warn('SMS notification skipped: no phone number provided');
    return { success: false, error: 'No phone number provided' };
  }

  try {
    const result = await smsService.sendSMS(phone, message);
    logger.info('SMS notification sent', { phone, success: result.success });
    return { success: true, provider: result.provider, phone };
  } catch (error) {
    logger.error('SMS notification failed', { phone, error: error.message });
    return { success: false, error: error.message };
  }
}

export async function sendSmsNotificationWithTemplate(phone, template, data = {}) {
  const smsTemplates = {
    orderConfirmation: 'Hi {{firstName}}, your Orpind order {{orderNumber}} is confirmed. Total: {{total}}. Track at orpind.com/track',
    orderShipped: 'Hi {{firstName}}, your Orpind order {{orderNumber}} has been shipped. Tracking: {{trackingNumber}}. Track at orpind.com/track',
    orderDelivered: 'Hi {{firstName}}, your Orpind order {{orderNumber}} has been delivered. Enjoy!',
    refundProcessed: 'Hi {{firstName}}, your refund of {{refundAmount}} for order {{orderNumber}} has been processed.',
    passwordReset: 'Your Orpind password reset code is {{otp}}. Valid for 5 minutes.',
    promo: '{{title}}: {{message}}',
  };

  const smsMessage = smsTemplates[template];
  if (!smsMessage) {
    logger.warn('Unknown SMS template', { template });
    return { success: false, error: 'Unknown SMS template' };
  }

  let rendered = smsMessage;
  for (const [key, value] of Object.entries(data)) {
    const placeholder = `{{${key}}}`;
    const safeValue = value === null || value === undefined ? '' : String(value);
    rendered = rendered.replaceAll(placeholder, safeValue);
  }

  const remainingPlaceholders = /\{\{[^}]+\}\}/g;
  rendered = rendered.replace(remainingPlaceholders, '');

  return sendSmsNotification(phone, rendered);
}

export default sendSmsNotification;
