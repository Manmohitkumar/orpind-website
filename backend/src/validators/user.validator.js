import Joi from "joi";

const updateProfile = Joi.object({
  firstName: Joi.string().trim().min(1).max(50).optional(),
  lastName: Joi.string().trim().min(1).max(50).optional(),
});

const address = Joi.object({
  firstName: Joi.string().trim().min(1).max(50).required(),
  lastName: Joi.string().trim().min(1).max(50).required(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  addressLine1: Joi.string().trim().min(1).max(200).required(),
  addressLine2: Joi.string().trim().max(200).optional().allow("", null),
  city: Joi.string().trim().min(1).required(),
  state: Joi.string().trim().min(1).required(),
  pincode: Joi.string()
    .pattern(/^\d{6}$/)
    .required(),
  country: Joi.string().trim().default("India"),
  landmark: Joi.string().trim().optional().allow("", null),
  type: Joi.string().valid("home", "work", "other").default("home"),
});

export { updateProfile, address };
