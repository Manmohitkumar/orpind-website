import config from "./index.js";
import logger from "./logger.js";

let Sentry;

export async function initSentry(app) {
  if (!config.sentryDns) {
    logger.warn("Sentry DSN not configured — skipping Sentry initialization");
    return null;
  }

  try {
    Sentry = await import("@sentry/node");
    const { nodeProfilingIntegration } = await import("@sentry/profiling-node");

    Sentry.init({
      dsn: config.sentryDns,
      environment: config.nodeEnv,
      tracesSampleRate: config.nodeEnv === "production" ? 0.2 : 0,
      profilesSampleRate: config.nodeEnv === "production" ? 0.2 : 0,
      integrations: [nodeProfilingIntegration()],
      maxBreadcrumbs: 50,
      debug: false,
      beforeSend(event) {
        if (event?.exception?.values?.[0]?.type === "AppError") {
          event.level = "warning";
        }
        return event;
      },
    });

    if (app && Sentry?.Handlers) {
      app.use(Sentry.Handlers.requestHandler());
      app.use(Sentry.Handlers.tracingHandler());
    }

    logger.info("Sentry initialized successfully");
    return Sentry;
  } catch (err) {
    logger.warn("Failed to initialize Sentry", { error: err.message });
    return null;
  }
}

export function getSentry() {
  return Sentry;
}

export function createSentryMiddleware() {
  if (!Sentry?.Handlers) {
    return (err, req, res, _next) => _next(err);
  }
  return Sentry.Handlers.errorHandler();
}
