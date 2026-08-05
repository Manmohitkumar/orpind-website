import morgan from "morgan";
import logger from "../config/logger.js";
import config from "../config/index.js";

const stream = {
  write: (message) => {
    logger.info(message.trim(), { source: "http" });
  },
};

const devFormat = morgan(
  ":method :url :status :response-time ms - :res[content-length]"
);

const prodFormat = morgan("combined", { stream });

const requestLogger = config.nodeEnv === "production" ? prodFormat : devFormat;

export { requestLogger };
