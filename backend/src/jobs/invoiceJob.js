import Order from '../models/order.model.js';
import User from '../models/user.model.js';
import InvoiceService from '../services/invoice.service.js';
import cloudinary from '../config/cloudinary.js';
import logger from '../config/logger.js';

async function generateInvoice(job) {
  const { orderId } = job.data;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      logger.warn('Invoice job: order not found', { orderId });
      return null;
    }

    if (order.status === 'cancelled' || order.status === 'failed') {
      logger.warn('Invoice job: order cancelled or failed', { orderId, status: order.status });
      return null;
    }

    const user = await User.findById(order.userId);
    if (!user) {
      logger.warn('Invoice job: user not found', { orderId, userId: order.userId });
      return null;
    }

    if (!order.invoiceNumber) {
      order.invoiceNumber = await InvoiceService.generateInvoiceNumber();
    }

    const pdfBuffer = await InvoiceService.generateInvoicePDF(order, user);

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'invoices',
          resource_type: 'raw',
          public_id: `invoice-${order.invoiceNumber}`,
          format: 'pdf',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(pdfBuffer);
    });

    order.invoiceUrl = uploadResult.secure_url;
    order.invoiceGeneratedAt = new Date();
    await order.save();

    logger.info('Invoice generated and uploaded', {
      orderId,
      invoiceNumber: order.invoiceNumber,
      jobId: job.id,
    });

    return {
      orderId,
      invoiceNumber: order.invoiceNumber,
      invoiceUrl: uploadResult.secure_url,
    };
  } catch (error) {
    logger.error('Invoice generation failed', { orderId, jobId: job.id, error: error.message });
    throw error;
  }
}

export { generateInvoice };
