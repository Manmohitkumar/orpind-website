import { ERROR_CODES } from "../constants/errorCodes.js";

const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: true,
    });

    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join("."),
        message: d.message,
      }));

      return res.status(400).json({
        success: false,
        code: ERROR_CODES.VALIDATION_ERROR,
        message: "Validation failed",
        details,
      });
    }

    req[source] = value;
    next();
  };
};

export { validate };
