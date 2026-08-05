import mongoose from "mongoose";
import { getRedis } from "../config/redis.js";
import { ERROR_CODES } from "../constants/errorCodes.js";

const CACHE_TTL = 300;

const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          code: ERROR_CODES.UNAUTHORIZED,
          message: "Authentication required.",
        });
      }

      const userId = req.user._id.toString();
      const cacheKey = `permissions:${userId}`;

      let permissionNames;

      const redis = await getRedis();
      const cached = await redis.get(cacheKey);

      if (cached) {
        permissionNames = JSON.parse(cached);
      } else {
        const role = await mongoose
          .model("Role")
          .findById(req.user.role)
          .populate("permissions", "name");

        if (!role || !role.isActive) {
          return res.status(403).json({
            success: false,
            code: ERROR_CODES.FORBIDDEN,
            message: "No valid role assigned.",
          });
        }

        permissionNames = role.permissions.map((p) => p.name);
        await redis.set(cacheKey, JSON.stringify(permissionNames), "EX", CACHE_TTL);
      }

      if (!permissionNames.includes(permission)) {
        return res.status(403).json({
          success: false,
          code: ERROR_CODES.PERMISSION_DENIED,
          message: `Missing required permission: ${permission}`,
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

const invalidatePermissionCache = async (userId) => {
  try {
    const redis = await getRedis();
    await redis.del(`permissions:${userId}`);
  } catch {
  }
};

export { requirePermission, invalidatePermissionCache };
