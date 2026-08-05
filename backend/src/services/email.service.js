import nodemailer from 'nodemailer';
import config from '../config/index.js';
import { logger } from '../config/logger.js';

const transporter = nodemailer.createTransport({
  host: config.nodeEnv === 'production' ? config.smtpHost : 'smtp.ethereal.email',
  port: config.nodeEnv === 'production' ? 587 : 587,
  secure: false,
  auth: { user: config.smtpUser || 'test@ethereal.email', pass: config.smtpPass || 'test' },
});

class EmailService {
  constructor() { this.from = config.emailFrom || 'Orpind <noreply@orpind.com>'; }

  async sendEmail({ to, subject, html, text }) {
    try {
      const info = await transporter.sendMail({ from: this.from, to, subject, html, text });
      logger.info(`Email sent to ${to}: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error('Email send error:', error);
      throw error;
    }
  }

  async sendTemplatedEmail(to, templateName, data) {
    const template = this.getTemplate(templateName, data);
    return this.sendEmail({ to, subject: template.subject, html: template.html });
  }

  getTemplate(name, data) {
    const templates = {
      welcome: { subject: 'Welcome to Orpind!', html: `<h1>Welcome ${data.firstName}!</h1><p>Thank you for joining Orpind. We deliver the finest organic spices from Punjab to your doorstep.</p>` },
      verification: { subject: 'Verify Your Email', html: `<h1>Email Verification</h1><p>Hi ${data.firstName}, please verify your email: <a href="${data.url}">Verify Email</a></p>` },
      passwordReset: { subject: 'Reset Your Password', html: `<h1>Password Reset</h1><p>Hi ${data.firstName}, reset your password: <a href="${data.url}">Reset Password</a></p><p>This link expires in 1 hour.</p>` },
      orderConfirmation: { subject: `Order Confirmed - ${data.orderNumber}`, html: `<h1>Order Confirmed</h1><p>Hi ${data.firstName}, your order ${data.orderNumber} is confirmed. Total: ₹${data.total}</p>` },
      orderShipped: { subject: `Order Shipped - ${data.orderNumber}`, html: `<h1>Order Shipped</h1><p>Hi ${data.firstName}, your order ${data.orderNumber} has been shipped. Tracking: ${data.trackingNumber}</p>` },
      orderDelivered: { subject: `Order Delivered - ${data.orderNumber}`, html: `<h1>Order Delivered</h1><p>Hi ${data.firstName}, your order ${data.orderNumber} has been delivered.</p>` },
      refundProcessed: { subject: 'Refund Processed', html: `<h1>Refund Processed</h1><p>Hi ${data.firstName}, your refund of ₹${data.amount} for order ${data.orderNumber} has been processed.</p>` },
      invoice: { subject: `Invoice for Order ${data.orderNumber}`, html: `<h1>Invoice</h1><p>Hi ${data.firstName}, please find your invoice for order ${data.orderNumber}.</p>` },
    };
    return templates[name] || { subject: 'Notification', html: '<p>You have a new notification.</p>' };
  }

  async sendWelcomeEmail(user) { return this.sendTemplatedEmail(user.email, 'welcome', { firstName: user.firstName }); }

  async sendVerificationEmail(user, url) { return this.sendTemplatedEmail(user.email, 'verification', { firstName: user.firstName, url }); }

  async sendPasswordResetEmail(user, url) { return this.sendTemplatedEmail(user.email, 'passwordReset', { firstName: user.firstName, url }); }

  async sendOrderConfirmation(user, order) { return this.sendTemplatedEmail(user.email, 'orderConfirmation', { firstName: user.firstName, orderNumber: order.orderNumber, total: order.total }); }

  async sendOrderShipped(user, order) { return this.sendTemplatedEmail(user.email, 'orderShipped', { firstName: user.firstName, orderNumber: order.orderNumber, trackingNumber: order.trackingNumber }); }

  async sendOrderDelivered(user, order) { return this.sendTemplatedEmail(user.email, 'orderDelivered', { firstName: user.firstName, orderNumber: order.orderNumber }); }

  async sendRefundConfirmation(user, order, amount) { return this.sendTemplatedEmail(user.email, 'refundProcessed', { firstName: user.firstName, orderNumber: order.orderNumber, amount }); }

  async sendInvoiceEmail(user, order) { return this.sendTemplatedEmail(user.email, 'invoice', { firstName: user.firstName, orderNumber: order.orderNumber }); }
}

export default new EmailService();
