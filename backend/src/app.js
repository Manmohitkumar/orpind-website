import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import config from './config/index.js';
import { requestLogger } from './middleware/requestLogger.middleware.js';
import { csrfProtection } from './middleware/csrf.middleware.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { globalLimiter } from './middleware/rateLimiter.middleware.js';
import v1Routes from './routes/v1/index.js';

const app = express();

app.use(helmet());

app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(compression());
app.use(cookieParser());
app.use(csrfProtection);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    if (config.nodeEnv !== 'production') {
      console.warn(`Sanitized key "${key}" from request on ${req.method} ${req.originalUrl}`);
    }
  },
}));

app.use(requestLogger);
app.use(globalLimiter);

app.use('/api/v1', v1Routes);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
  });
});

app.use(errorHandler);

export default app;
