import jwt from "jsonwebtoken";
import config from "../config/index.js";
import User from "../models/user.model.js";
import { ERROR_CODES } from "../constants/errorCodes.js";

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.access_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        code: ERROR_CODES.AUTH_TOKEN_MISSING,
        message: "Authentication required. Please log in.",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtAccessSecret);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          code: ERROR_CODES.AUTH_TOKEN_EXPIRED,
          message: "Access token has expired. Please refresh.",
        });
      }
      return res.status(401).json({
        success: false,
        code: ERROR_CODES.AUTH_TOKEN_INVALID,
        message: "Invalid access token.",
      });
    }

    const user = await User.findById(decoded.sub).select("-password -refreshTokens");

    if (!user) {
      return res.status(401).json({
        success: false,
        code: ERROR_CODES.UNAUTHORIZED,
        message: "User no longer exists.",
      });
    }

    if (!user.isActive || user.isDeleted) {
      return res.status(401).json({
        success: false,
        code: ERROR_CODES.ACCOUNT_DISABLED,
        message: "Account is disabled or deactivated.",
      });
    }

    if (user.isPasswordChanged(decoded.iat)) {
      return res.status(401).json({
        success: false,
        code: ERROR_CODES.AUTH_TOKEN_INVALID,
        message: "Password was recently changed. Please log in again.",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export { authenticate };
