export {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendOrderConfirmation,
  sendOrderShipped,
  sendOrderDelivered,
  sendRefundConfirmation,
  sendInvoiceEmail,
} from './emailJob.js';

export {
  processProductImages,
  processAvatarImage,
  processBlogImage,
  processGenericImage,
  generateThumbnailUrls,
} from './imageProcessingJob.js';

export { generateInvoice } from './invoiceJob.js';

export {
  aggregateDailyRevenue,
  aggregateOrderCounts,
  aggregateUserGrowth,
  aggregateProductPerformance,
  runFullAnalytics,
} from './analyticsJob.js';

export {
  cleanTempFiles,
  cleanExpiredSessions,
  cleanOldAuditLogs,
  cleanOrphanedMedia,
  cleanExpiredOTPs,
  cleanOldNotifications,
  runFullCleanup,
} from './cleanupJob.js';

export { dispatchNotification, dispatchBulkNotifications } from './notificationJob.js';

export { checkLowStock, autoReorder, syncProductStock } from './inventoryJob.js';

export { updateSearchSuggestions, generateSitemap, updateCategoryProductCounts } from './seoJob.js';

export { findAbandonedCarts, sendAbandonedCartEmails } from './abandonedCartJob.js';

export {
  generateDailySalesReport,
  generateWeeklyPerformanceReport,
  generateMonthlySummaryReport,
  sendReportEmail,
} from './reportJob.js';
