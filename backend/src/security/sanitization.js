const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input
      .replace(/<[^>]*>/g, '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .trim();
  }
  if (Array.isArray(input)) {
    return input.map((item) => sanitizeInput(item));
  }
  if (typeof input === 'object' && input !== null) {
    const sanitized = {};
    for (const [key, value] of Object.entries(input)) {
      const cleanKey = key.replace(/[\$\.\[\]]/g, '');
      sanitized[cleanKey] = sanitizeInput(value);
    }
    return sanitized;
  }
  return input;
};

const preventNoSQLInjection = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj;
  if (Array.isArray(obj)) {
    return obj.map((item) => preventNoSQLInjection(item));
  }
  const cleaned = {};
  const dangerousKeys = ['$', 'prototype', '__proto__', 'constructor'];
  for (const [key, value] of Object.entries(obj)) {
    if (dangerousKeys.includes(key)) continue;
    if (typeof value === 'object' && value !== null) {
      cleaned[key] = preventNoSQLInjection(value);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
};

const sanitizeSearchQuery = (query) => {
  if (typeof query !== 'string') return '';
  return query
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\s+/g, ' ')
    .trim();
};

const escapeHtml = (str) => {
  if (typeof str !== 'string') return '';
  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;',
    '`': '&#x60;',
  };
  return str.replace(/[&<>"'\/`]/g, (char) => htmlEntities[char]);
};

export { sanitizeInput, preventNoSQLInjection, sanitizeSearchQuery, escapeHtml };
