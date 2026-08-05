import { v2 as cloudinary } from "cloudinary";
import config from "./index.js";
import logger from "./logger.js";

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
  secure: config.nodeEnv === "production",
});

logger.info("Cloudinary configured successfully");

export default cloudinary;
