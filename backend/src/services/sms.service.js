import { logger } from '../config/logger.js';

class SmsService {
  constructor() { this.provider = 'MSG91'; }

  async sendSMS(phone, message) {
    logger.info(`SMS to ${phone}: ${message}`);
    return { success: true, provider: this.provider, phone, message };
  }

  async sendOTPSMS(phone, otp) {
    return this.sendSMS(phone, `Your Orpind verification code is ${otp}. Valid for 5 minutes.`);
  }

  async sendOrderUpdateSMS(phone, orderNumber, status) {
    return this.sendSMS(phone, `Your Orpind order ${orderNumber} is now: ${status}. Track at orpind.com/track`);
  }
}

export default new SmsService();
