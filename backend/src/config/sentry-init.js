import app from "../app.js";
import { initSentry, createSentryMiddleware } from "./sentry.js";

export async function initializeSentry() {
  const sentry = await initSentry(app);
  if (sentry) {
    const errorHandler = createSentryMiddleware();
    app.use(errorHandler);
  }
}
