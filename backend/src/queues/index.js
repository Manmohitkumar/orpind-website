import { Queue } from 'bullmq';
import { createQueueConnection } from '../config/bullmq.js';

const defaultJobOptions = {
  removeOnComplete: { count: 100, age: 86400 },
  removeOnFail: { count: 50, age: 604800 },
  attempts: 3,
  backoff: { type: 'exponential', delay: 2000 },
};

function createQueue(name) {
  return new Queue(name, {
    connection: createQueueConnection(),
    defaultJobOptions,
  });
}

const emailQueue = createQueue('email');
const notificationQueue = createQueue('notification');
const imageProcessingQueue = createQueue('image-processing');
const invoiceQueue = createQueue('invoice');
const analyticsQueue = createQueue('analytics');
const cleanupQueue = createQueue('cleanup');
const inventoryQueue = createQueue('inventory');
const seoQueue = createQueue('seo');
const abandonedCartQueue = createQueue('abandoned-cart');
const reportQueue = createQueue('report');

export {
  emailQueue,
  notificationQueue,
  imageProcessingQueue,
  invoiceQueue,
  analyticsQueue,
  cleanupQueue,
  inventoryQueue,
  seoQueue,
  abandonedCartQueue,
  reportQueue,
};
