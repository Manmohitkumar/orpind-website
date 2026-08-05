import { Worker } from 'bullmq';
import { createQueueConnection } from '../config/bullmq.js';
import { sendWelcomeEmail, sendVerificationEmail, sendPasswordResetEmail, sendOrderConfirmation, sendOrderShipped, sendOrderDelivered, sendRefundConfirmation, sendInvoiceEmail } from '../jobs/emailJob.js';
import { processProductImages, processAvatarImage, processBlogImage, processGenericImage } from '../jobs/imageProcessingJob.js';
import { generateInvoice } from '../jobs/invoiceJob.js';
import { aggregateDailyRevenue, aggregateOrderCounts, aggregateUserGrowth, aggregateProductPerformance } from '../jobs/analyticsJob.js';
import { cleanTempFiles, cleanExpiredSessions, cleanOldAuditLogs, cleanOrphanedMedia, cleanExpiredOTPs, cleanOldNotifications } from '../jobs/cleanupJob.js';
import { dispatchNotification, dispatchBulkNotifications } from '../jobs/notificationJob.js';
import { checkLowStock, autoReorder, syncProductStock } from '../jobs/inventoryJob.js';
import { updateSearchSuggestions, generateSitemap, updateCategoryProductCounts } from '../jobs/seoJob.js';
import { findAbandonedCarts, sendAbandonedCartEmails } from '../jobs/abandonedCartJob.js';
import { generateDailySalesReport, generateWeeklyPerformanceReport, generateMonthlySummaryReport, sendReportEmail } from '../jobs/reportJob.js';
import logger from '../config/logger.js';

const connection = createQueueConnection();
const concurrency = parseInt(process.env.WORKER_CONCURRENCY || '5', 10);

function createWorker(name, processor) {
  const worker = new Worker(name, processor, { connection, concurrency, limiter: { max: 100, duration: 1000 } });
  worker.on('completed', (job) => logger.info(`[${name}] Job ${job.id} completed`));
  worker.on('failed', (job, err) => logger.error(`[${name}] Job ${job?.id} failed: ${err.message}`));
  worker.on('error', (err) => logger.error(`[${name}] Worker error: ${err.message}`));
  return worker;
}

const workers = [
  createWorker('email', async (job) => {
    const map = { 'send-welcome': sendWelcomeEmail, 'send-verification': sendVerificationEmail, 'send-password-reset': sendPasswordResetEmail, 'send-order-confirmation': sendOrderConfirmation, 'send-order-shipped': sendOrderShipped, 'send-order-delivered': sendOrderDelivered, 'send-refund-confirmation': sendRefundConfirmation, 'send-invoice': sendInvoiceEmail };
    const fn = map[job.name];
    if (fn) return fn(job.data);
    logger.warn(`Unknown email job: ${job.name}`);
  }),

  createWorker('notification', async (job) => {
    if (job.name === 'dispatch') return dispatchNotification(job.data);
    if (job.name === 'dispatch-bulk') return dispatchBulkNotifications(job.data);
  }),

  createWorker('image-processing', async (job) => {
    const map = { 'process-product': processProductImages, 'process-avatar': processAvatarImage, 'process-blog': processBlogImage, 'process-generic': processGenericImage };
    const fn = map[job.name];
    if (fn) return fn(job.data);
  }),

  createWorker('invoice', async (job) => {
    if (job.name === 'generate-invoice') return generateInvoice(job.data);
  }),

  createWorker('analytics', async (job) => {
    const map = { 'aggregate-revenue': aggregateDailyRevenue, 'aggregate-orders': aggregateOrderCounts, 'aggregate-users': aggregateUserGrowth, 'aggregate-products': aggregateProductPerformance };
    const fn = map[job.name];
    if (fn) return fn(job.data);
  }),

  createWorker('cleanup', async (job) => {
    const map = { 'clean-temp': cleanTempFiles, 'clean-sessions': cleanExpiredSessions, 'clean-audit': cleanOldAuditLogs, 'clean-media': cleanOrphanedMedia, 'clean-otps': cleanExpiredOTPs, 'clean-notifications': cleanOldNotifications };
    const fn = map[job.name];
    if (fn) return fn(job.data);
  }),

  createWorker('inventory', async (job) => {
    const map = { 'check-low-stock': checkLowStock, 'auto-reorder': autoReorder, 'sync-stock': syncProductStock };
    const fn = map[job.name];
    if (fn) return fn(job.data);
  }),

  createWorker('seo', async (job) => {
    const map = { 'update-suggestions': updateSearchSuggestions, 'generate-sitemap': generateSitemap, 'update-category-counts': updateCategoryProductCounts };
    const fn = map[job.name];
    if (fn) return fn(job.data);
  }),

  createWorker('abandoned-cart', async (job) => {
    const map = { 'find-abandoned': findAbandonedCarts, 'send-reminder': sendAbandonedCartEmails };
    const fn = map[job.name];
    if (fn) return fn(job.data);
  }),

  createWorker('report', async (job) => {
    const map = { 'daily-sales': generateDailySalesReport, 'weekly-performance': generateWeeklyPerformanceReport, 'monthly-summary': generateMonthlySummaryReport, 'send-report': sendReportEmail };
    const fn = map[job.name];
    if (fn) return fn(job.data);
  }),
];

logger.info(`Started ${workers.length} BullMQ workers`);

async function gracefulShutdown() {
  logger.info('Shutting down workers...');
  await Promise.all(workers.map((w) => w.close()));
  process.exit(0);
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
