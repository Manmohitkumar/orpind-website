import { sendEmailNotification } from './email.provider.js';
import { sendSmsNotification, sendSmsNotificationWithTemplate } from './sms.provider.js';
import { sendWhatsAppNotification, sendWhatsAppNotificationWithTemplate } from './whatsapp.provider.js';

const providers = {
  email: sendEmailNotification,
  sms: sendSmsNotification,
  whatsapp: sendWhatsAppNotification,
};

export async function sendNotification(channel, to, messageOrTemplate, data = {}) {
  const provider = providers[channel];
  if (!provider) {
    throw new Error(`Unknown notification channel: ${channel}`);
  }

  if (data && typeof data === 'object' && Object.keys(data).length > 0) {
    if (channel === 'email') {
      return provider(to, messageOrTemplate, data);
    }
    if (channel === 'sms') {
      return sendSmsNotificationWithTemplate(to, messageOrTemplate, data);
    }
    if (channel === 'whatsapp') {
      return sendWhatsAppNotificationWithTemplate(to, messageOrTemplate, data);
    }
  }

  return provider(to, messageOrTemplate);
}

export async function sendMultiChannelNotification({ email, sms, whatsapp }, data = {}) {
  const results = {};

  if (email) {
    results.email = await sendEmailNotification(email.to, email.template, { ...data, ...email.data });
  }

  if (sms) {
    results.sms = await sendSmsNotificationWithTemplate(sms.to, sms.template, { ...data, ...sms.data });
  }

  if (whatsapp) {
    results.whatsapp = await sendWhatsAppNotificationWithTemplate(whatsapp.to, whatsapp.template, { ...data, ...whatsapp.data });
  }

  return results;
}

export {
  sendEmailNotification,
  sendSmsNotification,
  sendSmsNotificationWithTemplate,
  sendWhatsAppNotification,
  sendWhatsAppNotificationWithTemplate,
};

export default providers;
