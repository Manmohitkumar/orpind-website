import User from "../models/user.model.js";
import { ERROR_CODES } from "../constants/errorCodes.js";

const requireRole = (minLevel) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          code: ERROR_CODES.UNAUTHORIZED,
          message: "Authentication required.",
        });
      }

      await req.user.populate({ path: "role", select: "name level isActive" });

      if (!req.user.role || !req.user.role.isActive) {
        return res.status(403).json({
          success: false,
          code: ERROR_CODES.FORBIDDEN,
          message: "No valid role assigned to this account.",
        });
      }

      if (req.user.role.level < minLevel) {
        return res.status(403).json({
          success: false,
          code: ERROR_CODES.FORBIDDEN,
          message: "Insufficient role privileges.",
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export { requireRole };
