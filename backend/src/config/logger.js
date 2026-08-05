import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import config from "./index.js";

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

const consoleFormat = printf(({ level, message, timestamp: ts, stack, ...meta }) => {
  let log = `${ts} [${level}]: ${message}`;
  if (stack) {
    log += `\n${stack}`;
  }
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  return log + metaStr;
});

const fileFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  json()
);

const transports = [];

if (config.nodeEnv === "development") {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: "HH:mm:ss" }),
        consoleFormat
      ),
    })
  );
}

transports.push(
  new DailyRotateFile({
    filename: "app-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    dirname: "logs",
    maxSize: "20m",
    maxFiles: "14d",
    format: fileFormat,
  })
);

transports.push(
  new DailyRotateFile({
    filename: "error-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    dirname: "logs",
    level: "error",
    maxSize: "20m",
    maxFiles: "30d",
    format: fileFormat,
  })
);

const logger = winston.createLogger({
  level: config.logLevel,
  levels: winston.config.npm.levels,
  transports,
  exitOnError: false,
});

function createChildLogger(meta = {}) {
  return logger.child(meta);
}

export default logger;
export { logger, createChildLogger };
