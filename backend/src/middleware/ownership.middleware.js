import { ERROR_CODES } from "../constants/errorCodes.js";

const ADMIN_LEVEL = 3;

const checkOwnership = (Model, field = "user") => {
  return async (req, res, next) => {
    try {
      if (!req.params.id) {
        return res.status(400).json({
          success: false,
          code: ERROR_CODES.BAD_REQUEST,
          message: "Resource ID is required.",
        });
      }

      const resource = await Model.findById(req.params.id);

      if (!resource) {
        return res.status(404).json({
          success: false,
          code: ERROR_CODES.NOT_FOUND,
          message: "Resource not found.",
        });
      }

      if (req.user.role && req.user.role.level >= ADMIN_LEVEL) {
        req.resource = resource;
        return next();
      }

      const ownerId = resource[field];

      if (!ownerId) {
        req.resource = resource;
        return next();
      }

      if (ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          code: ERROR_CODES.FORBIDDEN,
          message: "You do not have access to this resource.",
        });
      }

      req.resource = resource;
      next();
    } catch (err) {
      next(err);
    }
  };
};

export { checkOwnership };
