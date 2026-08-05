const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
};

const SORT_OPTIONS = {
  NEWEST: { createdAt: -1 },
  OLDEST: { createdAt: 1 },
  PRICE_LOW_HIGH: { sellingPrice: 1 },
  PRICE_HIGH_LOW: { sellingPrice: -1 },
  NAME_A_Z: { name: 1 },
  NAME_Z_A: { name: -1 },
  POPULARITY: { soldCount: -1 },
  RATING: { averageRating: -1 },
  FEATURED: { isFeatured: -1, createdAt: -1 },
};

const DATE_FORMATS = {
  SHORT: 'DD/MM/YYYY',
  LONG: 'MMMM DD, YYYY',
  FULL: 'dddd, MMMM DD, YYYY',
  ISO: 'YYYY-MM-DD',
  DATETIME: 'DD/MM/YYYY HH:mm',
  TIME: 'HH:mm',
  COMPACT: 'DD MMM YYYY',
};

const CURRENCY_FORMAT = {
  INR: { code: 'INR', symbol: '₹', locale: 'en-IN' },
  USD: { code: 'USD', symbol: '$', locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', locale: 'en-GB' },
};

export { HTTP_STATUS, PAGINATION_DEFAULTS, SORT_OPTIONS, DATE_FORMATS, CURRENCY_FORMAT };
