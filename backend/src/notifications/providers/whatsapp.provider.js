import whatsappService from '../../services/whatsapp.service.js';
import logger from '../../config/logger.js';

export async function sendWhatsAppNotification(phone, message) {
  if (!phone) {
    logger.warn('WhatsApp notification skipped: no phone number provided');
    return { success: false, error: 'No phone number provided' };
  }

  try {
    const result = await whatsappService.sendWhatsAppMessage(phone, message);
    logger.info('WhatsApp notification sent', { phone, success: result.success });
    return { success: true, provider: result.provider, phone };
  } catch (error) {
    logger.error('WhatsApp notification failed', { phone, error: error.message });
    return { success: false, error: error.message };
  }
}

export async function sendWhatsAppNotificationWithTemplate(phone, template, data = {}) {
  const whatsappTemplates = {
    orderConfirmation: 'Hi {{firstName}}, your Orpind order {{orderNumber}} is confirmed! Total: {{total}}.',
    orderShipped: 'Hi {{firstName}}, your Orpind order {{orderNumber}} has been shipped. Tracking: {{trackingNumber}}.',
    orderDelivered: 'Hi {{firstName}}, your Orpind order {{orderNumber}} has been delivered. Enjoy!',
    refundProcessed: 'Hi {{firstName}}, your refund of {{refundAmount}} for order {{orderNumber}} has been processed.',
    promo: '{{title}}: {{message}}',
  };

  const templateMessage = whatsappTemplates[template];
  if (!templateMessage) {
    logger.warn('Unknown WhatsApp template', { template });
    return { success: false, error: 'Unknown WhatsApp template' };
  }

  let message = templateMessage;
  for (const [key, value] of Object.entries(data)) {
    const placeholder = `{{${key}}}`;
    const safeValue = value === null || value === undefined ? '' : String(value);
    message = message.replaceAll(placeholder, safeValue);
  }

  const remainingPlaceholders = /\{\{[^}]+\}\}/g;
  message = message.replace(remainingPlaceholders, '');

  return sendWhatsAppNotification(phone, message);
}

export default sendWhatsAppNotification;
