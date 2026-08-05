import mongoose from "mongoose";
import { ERROR_CODES } from "../constants/errorCodes.js";

const validateObjectId = (paramName = "id") => {
  return (req, res, next) => {
    const value = req.params[paramName];

    if (!value || !mongoose.Types.ObjectId.isValid(value)) {
      return res.status(400).json({
        success: false,
        code: ERROR_CODES.BAD_REQUEST,
        message: "Invalid ID format.",
      });
    }

    next();
  };
};

export { validateObjectId };
