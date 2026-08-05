import mongoose from "mongoose";
import config from "./index.js";
import logger from "./logger.js";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

let retryCount = 0;

mongoose.set("strictQuery", true);

mongoose.connection.on("connected", () => {
  retryCount = 0;
  logger.info("MongoDB connected successfully");
});

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  logger.error("MongoDB connection error", { error: err.message });
});

mongoose.connection.on("reconnected", () => {
  logger.info("MongoDB reconnected");
});

async function connectDB() {
  try {
    await mongoose.connect(config.mongoUri, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    logger.info("MongoDB connection established");
  } catch (err) {
    retryCount++;
    logger.error(`MongoDB connection attempt ${retryCount}/${MAX_RETRIES} failed`, {
      error: err.message,
    });

    if (retryCount < MAX_RETRIES) {
      logger.info(`Retrying MongoDB connection in ${RETRY_DELAY_MS / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return connectDB();
    }

    logger.error("Max MongoDB connection retries reached. Exiting.");
    throw err;
  }
}

async function disconnectDB() {
  try {
    await mongoose.disconnect();
    logger.info("MongoDB disconnected gracefully");
  } catch (err) {
    logger.error("Error during MongoDB disconnect", { error: err.message });
    throw err;
  }
}

function getConnectionState() {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  return states[mongoose.connection.readyState] || "unknown";
}

export { connectDB, disconnectDB, getConnectionState };
