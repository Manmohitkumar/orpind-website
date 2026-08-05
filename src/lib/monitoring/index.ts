import * as Sentry from '@sentry/nextjs';

// ─── Initialize Sentry ───────────────────────────────
export function initSentry() {
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      environment: process.env.NODE_ENV,
    });
  }
}

// ─── Log Error to Sentry ─────────────────────────────
export function logError(error: Error, context?: Record<string, unknown>) {
  console.error('Error:', error.message, context);

  if (process.env.NODE_ENV === 'production') {
    Sentry.withScope(scope => {
      if (context) {
        Object.entries(context).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }
      Sentry.captureException(error);
    });
  }
}

// ─── Log Warning ─────────────────────────────────────
export function logWarning(message: string, context?: Record<string, unknown>) {
  console.warn('Warning:', message, context);

  if (process.env.NODE_ENV === 'production') {
    Sentry.withScope(scope => {
      if (context) {
        Object.entries(context).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }
      Sentry.captureMessage(message, 'warning');
    });
  }
}

// ─── Performance Monitoring ──────────────────────────
export function startTransaction(name: string, op: string) {
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    return Sentry.startSpan({ name, op }, span => span);
  }
  return null;
}

export function finishTransaction(span: any, status?: string) {
  if (span && typeof span.finish === 'function') {
    if (status) span.setStatus(status);
    span.finish();
  }
}

// ─── Custom Metrics ──────────────────────────────────
export function recordMetric(name: string, value: number, tags?: Record<string, string>) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.setMeasurement(name, value, 'none');
    if (tags) {
      Object.entries(tags).forEach(([key, val]) => {
        Sentry.setTag(`metric.${key}`, val);
      });
    }
  }
}

// ─── Business Metrics ────────────────────────────────
export function recordOrderMetrics(orderId: string, amount: number, itemCount: number) {
  recordMetric('order.total', amount, { currency: 'INR' });
  recordMetric('order.items', itemCount);
}

export function recordPaymentMetrics(orderId: string, amount: number, method: string, status: string) {
  recordMetric('payment.amount', amount, { method, status });
}

// ─── Health Check ────────────────────────────────────
export async function healthCheck(): Promise<{ status: string; checks: Record<string, string> }> {
  const checks: Record<string, string> = {};

  // Database check
  try {
    const { default: prisma } = await import('@/lib/db');
    await prisma.$queryRaw`SELECT 1`;
    checks.database = 'healthy';
  } catch {
    checks.database = 'unhealthy';
  }

  // Redis check (if configured)
  if (process.env.REDIS_URL) {
    try {
      // Redis health check would go here
      checks.redis = 'healthy';
    } catch {
      checks.redis = 'unhealthy';
    }
  }

  // S3 check
  if (process.env.AWS_S3_BUCKET) {
    checks.s3 = 'configured';
  } else {
    checks.s3 = 'not configured';
  }

  // Razorpay check
  if (process.env.RAZORPAY_KEY_ID) {
    checks.razorpay = 'configured';
  } else {
    checks.razorpay = 'not configured';
  }

  const allHealthy = Object.values(checks).every(v => v === 'healthy' || v === 'configured');

  return {
    status: allHealthy ? 'healthy' : 'degraded',
    checks,
  };
}

// ─── Structured Logger ───────────────────────────────
export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => {
    console.log(JSON.stringify({ level: 'info', message, ...meta, timestamp: new Date().toISOString() }));
  },
  warn: (message: string, meta?: Record<string, unknown>) => {
    console.warn(JSON.stringify({ level: 'warn', message, ...meta, timestamp: new Date().toISOString() }));
  },
  error: (message: string, error?: Error, meta?: Record<string, unknown>) => {
    const entry = { level: 'error', message, ...meta, timestamp: new Date().toISOString() };
    console.error(JSON.stringify(entry));
    if (error) logError(error, meta);
  },
  debug: (message: string, meta?: Record<string, unknown>) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(JSON.stringify({ level: 'debug', message, ...meta, timestamp: new Date().toISOString() }));
    }
  },
};
