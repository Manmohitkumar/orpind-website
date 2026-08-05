import multer from "multer";
import logger from "../config/logger.js";
import config from "../config/index.js";
import { ERROR_CODES } from "../constants/errorCodes.js";

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let code = err.code || ERROR_CODES.INTERNAL_SERVER;
  let message = err.message || "Internal server error";
  let details = undefined;

  if (err.name === "ValidationError" && err.errors) {
    statusCode = 400;
    code = ERROR_CODES.VALIDATION_ERROR;
    message = "Validation failed";
    details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400;
    code = ERROR_CODES.BAD_REQUEST;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.code === 11000) {
    statusCode = 409;
    code = ERROR_CODES.DUPLICATE_ENTRY;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for field: ${field}`;
    details = { field, value: err.keyValue[field] };
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    code = ERROR_CODES.AUTH_TOKEN_INVALID;
    message = "Invalid token.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    code = ERROR_CODES.AUTH_TOKEN_EXPIRED;
    message = "Token has expired.";
  }

  if (err instanceof multer.MulterError) {
    statusCode = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    code = err.code === "LIMIT_FILE_SIZE"
      ? ERROR_CODES.FILE_TOO_LARGE
      : ERROR_CODES.INVALID_FILE_TYPE;
    message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File size exceeds the maximum limit."
        : `Upload error: ${err.message}`;
  }

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  const logPayload = {
    statusCode,
    code,
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: req.user?._id,
  };

  if (statusCode >= 500) {
    logger.error("Server error", logPayload);
  } else {
    logger.warn("Client error", logPayload);
  }

  const response = {
    success: false,
    code,
    message,
  };

  if (details) {
    response.details = details;
  }

  if (config.nodeEnv !== "production") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export { errorHandler, AppError };
