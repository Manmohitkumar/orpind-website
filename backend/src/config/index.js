import dotenv from "dotenv";

dotenv.config();

const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",

  mongoUri: process.env.MONGO_URI,

  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",

  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtAccessExpiry: process.env.JWT_ACCESS_EXPIRY || "15m",
  jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY || "7d",

  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,

  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,

  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,

  resendApiKey: process.env.RESEND_API_KEY,
  emailFrom: process.env.EMAIL_FROM || "noreply@orpind.com",

  sentryDns: process.env.SENTRY_DNS,

  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
    : ["http://localhost:3000", "http://localhost:5173"],

  logLevel: process.env.LOG_LEVEL || "info",
  saltRounds: parseInt(process.env.SALT_ROUNDS, 10) || 12,

  maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS, 10) || 5,
  lockoutDuration: parseInt(process.env.LOCKOUT_DURATION_MINUTES, 10) || 15,
};

if (!config.mongoUri) {
  throw new Error("MONGO_URI environment variable is required");
}

if (config.nodeEnv === "production") {
  const required = [
    "jwtAccessSecret",
    "jwtRefreshSecret",
    "razorpayKeyId",
    "razorpayKeySecret",
  ];
  for (const key of required) {
    if (!config[key]) {
      throw new Error(`${key.toUpperCase()} environment variable is required in production`);
    }
  }
}

export default config;
