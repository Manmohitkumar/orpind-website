const ORDER_STATUS_TEMPLATES = {
  pending: {
    title: 'Order Pending',
    message: 'Your order {{orderNumber}} has been placed and is awaiting confirmation.',
  },
  confirmed: {
    title: 'Order Confirmed',
    message: 'Great news! Your order {{orderNumber}} has been confirmed and is being processed.',
  },
  processing: {
    title: 'Order Processing',
    message: 'Your order {{orderNumber}} is being prepared and will be shipped soon.',
  },
  shipped: {
    title: 'Order Shipped',
    message: 'Your order {{orderNumber}} has been shipped! Tracking number: {{trackingNumber}}.',
  },
  out_for_delivery: {
    title: 'Out for Delivery',
    message: 'Your order {{orderNumber}} is out for delivery and will arrive today.',
  },
  delivered: {
    title: 'Order Delivered',
    message: 'Your order {{orderNumber}} has been delivered successfully. Enjoy your spices!',
  },
  cancelled: {
    title: 'Order Cancelled',
    message: 'Your order {{orderNumber}} has been cancelled. {{reason}}',
  },
  returned: {
    title: 'Return Requested',
    message: 'A return has been requested for your order {{orderNumber}}.',
  },
  refunded: {
    title: 'Refund Processed',
    message: 'Your refund for order {{orderNumber}} of {{refundAmount}} has been processed.',
  },
  failed: {
    title: 'Order Failed',
    message: 'Unfortunately, your order {{orderNumber}} could not be processed. Please try again.',
  },
};

const DEFAULT_TEMPLATE = {
  title: 'Order Update',
  message: 'Your order {{orderNumber}} status has been updated to {{status}}.',
};

export function getOrderUpdateTemplate(status, data = {}) {
  const template = ORDER_STATUS_TEMPLATES[status] || DEFAULT_TEMPLATE;
  let title = template.title;
  let message = template.message;

  const allData = { ...data, status };

  for (const [key, value] of Object.entries(allData)) {
    const placeholder = `{{${key}}}`;
    const safeValue = value === null || value === undefined ? '' : String(value);
    title = title.replaceAll(placeholder, safeValue);
    message = message.replaceAll(placeholder, safeValue);
  }

  const remainingPlaceholders = /\{\{[^}]+\}\}/g;
  title = title.replace(remainingPlaceholders, '');
  message = message.replace(remainingPlaceholders, '');

  return { title, message };
}

export default getOrderUpdateTemplate;
