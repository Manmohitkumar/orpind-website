import { logger } from '../config/logger.js';

class WhatsAppService {
  constructor() { this.provider = 'WhatsApp Business API'; }

  async sendWhatsAppMessage(phone, message) {
    logger.info(`WhatsApp to ${phone}: ${message}`);
    return { success: true, provider: this.provider, phone, message };
  }

  async sendOrderUpdateWhatsApp(phone, orderNumber, status) {
    return this.sendWhatsAppMessage(phone, `Your Orpind order ${orderNumber} is now: ${status}.`);
  }
}

export default new WhatsAppService();
