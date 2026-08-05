import emailService from '../services/email.service.js';
import logger from '../config/logger.js';

export async function sendWelcomeEmail(job) {
  const { user } = job.data;
  try {
    const result = await emailService.sendWelcomeEmail(user);
    logger.info('Welcome email sent', { userId: user._id, jobId: job.id });
    return result;
  } catch (error) {
    logger.error('Welcome email failed', { userId: user._id, jobId: job.id, error: error.message });
    throw error;
  }
}

export async function sendVerificationEmail(job) {
  const { user, url } = job.data;
  try {
    const result = await emailService.sendVerificationEmail(user, url);
    logger.info('Verification email sent', { userId: user._id, jobId: job.id });
    return result;
  } catch (error) {
    logger.error('Verification email failed', { userId: user._id, jobId: job.id, error: error.message });
    throw error;
  }
}

export async function sendPasswordResetEmail(job) {
  const { user, url } = job.data;
  try {
    const result = await emailService.sendPasswordResetEmail(user, url);
    logger.info('Password reset email sent', { userId: user._id, jobId: job.id });
    return result;
  } catch (error) {
    logger.error('Password reset email failed', { userId: user._id, jobId: job.id, error: error.message });
    throw error;
  }
}

export async function sendOrderConfirmation(job) {
  const { user, order } = job.data;
  try {
    const result = await emailService.sendOrderConfirmation(user, order);
    logger.info('Order confirmation email sent', { orderId: order._id, jobId: job.id });
    return result;
  } catch (error) {
    logger.error('Order confirmation email failed', { orderId: order._id, jobId: job.id, error: error.message });
    throw error;
  }
}

export async function sendOrderShipped(job) {
  const { user, order } = job.data;
  try {
    const result = await emailService.sendOrderShipped(user, order);
    logger.info('Order shipped email sent', { orderId: order._id, jobId: job.id });
    return result;
  } catch (error) {
    logger.error('Order shipped email failed', { orderId: order._id, jobId: job.id, error: error.message });
    throw error;
  }
}

export async function sendOrderDelivered(job) {
  const { user, order } = job.data;
  try {
    const result = await emailService.sendOrderDelivered(user, order);
    logger.info('Order delivered email sent', { orderId: order._id, jobId: job.id });
    return result;
  } catch (error) {
    logger.error('Order delivered email failed', { orderId: order._id, jobId: job.id, error: error.message });
    throw error;
  }
}

export async function sendRefundConfirmation(job) {
  const { user, order, amount } = job.data;
  try {
    const result = await emailService.sendRefundConfirmation(user, order, amount);
    logger.info('Refund confirmation email sent', { orderId: order._id, jobId: job.id });
    return result;
  } catch (error) {
    logger.error('Refund confirmation email failed', { orderId: order._id, jobId: job.id, error: error.message });
    throw error;
  }
}

export async function sendInvoiceEmail(job) {
  const { user, order } = job.data;
  try {
    const result = await emailService.sendInvoiceEmail(user, order);
    logger.info('Invoice email sent', { orderId: order._id, jobId: job.id });
    return result;
  } catch (error) {
    logger.error('Invoice email failed', { orderId: order._id, jobId: job.id, error: error.message });
    throw error;
  }
}
