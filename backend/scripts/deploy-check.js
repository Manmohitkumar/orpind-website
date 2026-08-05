import logger from '../src/config/logger.js';

const required = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'REDIS_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
];

const recommended = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'FROM_EMAIL',
  'FROM_NAME',
  'FRONTEND_URL',
  'CORS_ORIGIN',
  'SENTRY_DSN',
];

function check() {
  const missing = [];
  const warnings = [];

  for (const key of required) {
    if (!process.env[key]) missing.push(key);
  }
  for (const key of recommended) {
    if (!process.env[key]) warnings.push(key);
  }

  if (missing.length > 0) {
    logger.error(`Missing required env vars: ${missing.join(', ')}`);
  }
  if (warnings.length > 0) {
    logger.warn(`Missing recommended env vars: ${warnings.join(', ')}`);
  }
  if (missing.length === 0 && warnings.length === 0) {
    logger.info('All environment variables are set.');
  }

  const checks = [
    { name: 'Node.js version', ok: parseInt(process.version.slice(1)) >= 18 },
    { name: 'Environment', ok: !!process.env.NODE_ENV },
  ];

  console.log('\n--- Deploy Readiness ---');
  for (const c of checks) {
    console.log(`  ${c.ok ? '✓' : '✗'} ${c.name}`);
  }
  console.log(`  Required vars: ${required.length - missing.length}/${required.length}`);
  console.log(`  Recommended vars: ${recommended.length - warnings.length}/${recommended.length}`);
  console.log(`\nResult: ${missing.length === 0 ? 'READY' : 'NOT READY'}`);

  process.exit(missing.length === 0 ? 0 : 1);
}

check();
