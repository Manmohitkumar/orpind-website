import { getOrderUpdateTemplate } from './orderUpdate.js';
import { getPromoTemplate } from './promo.js';
import { getSystemTemplate } from './system.js';

const templates = {
  orderUpdate: getOrderUpdateTemplate,
  promo: getPromoTemplate,
  system: getSystemTemplate,
};

export function getTemplate(category, type, data = {}) {
  const generator = templates[category];
  if (!generator) {
    return { title: 'Notification', message: data.message || 'You have a new notification.' };
  }
  return generator(type, data);
}

export { getOrderUpdateTemplate, getPromoTemplate, getSystemTemplate };

export default templates;
