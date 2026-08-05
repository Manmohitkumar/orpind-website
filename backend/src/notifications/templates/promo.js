const PROMO_TEMPLATES = {
  general: {
    title: '{{title}}',
    message: '{{message}}',
  },
  discount: {
    title: 'Special Offer Just for You!',
    message: '{{message}} Use code {{code}} at checkout for {{discount}} off.',
  },
  newProduct: {
    title: 'New Arrivals at Orpind',
    message: '{{message}} Be the first to try our latest organic spice collection.',
  },
  sale: {
    title: 'Limited Time Sale',
    message: '{{message}} Hurry, this offer expires on {{expiryDate}}.',
  },
  referral: {
    title: 'Refer & Earn',
    message: '{{message}} Share your referral code {{referralCode}} and earn rewards.',
  },
  backInStock: {
    title: 'Back in Stock!',
    message: '{{message}} {{productName}} is available again. Order before it sells out.',
  },
};

const DEFAULT_PROMO_TEMPLATE = {
  title: '{{title}}',
  message: '{{message}}',
};

export function getPromoTemplate(type = 'general', data = {}) {
  const template = PROMO_TEMPLATES[type] || DEFAULT_PROMO_TEMPLATE;
  let title = template.title;
  let message = template.message;

  const allData = { ...data };

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

export default getPromoTemplate;
