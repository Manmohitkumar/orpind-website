import Joi from "joi";

const createCoupon = Joi.object({
  code: Joi.string().trim().min(1).max(50).required(),
  description: Joi.string().trim().max(500).optional().allow("", null),
  discountType: Joi.string().valid("percentage", "fixed", "free_shipping").required(),
  discountValue: Joi.number().min(0).required(),
  minimumOrder: Joi.number().min(0).default(0),
  maximumDiscount: Joi.number().min(0).optional().allow(null),
  usageLimit: Joi.number().integer().min(1).optional().allow(null),
  perUserLimit: Joi.number().integer().min(1).optional().allow(null),
  startDate: Joi.date().iso().optional().allow(null),
  expiresAt: Joi.date().iso().greater(Joi.ref("startDate")).optional().allow(null),
  applicableProducts: Joi.array().items(Joi.string().hex().length(24)).optional(),
  applicableCategories: Joi.array().items(Joi.string().hex().length(24)).optional(),
  excludedProducts: Joi.array().items(Joi.string().hex().length(24)).optional(),
  isActive: Joi.boolean().optional(),
});

const updateCoupon = Joi.object({
  code: Joi.string().trim().min(1).max(50).optional(),
  description: Joi.string().trim().max(500).optional().allow("", null),
  discountType: Joi.string().valid("percentage", "fixed", "free_shipping").optional(),
  discountValue: Joi.number().min(0).optional(),
  minimumOrder: Joi.number().min(0).optional(),
  maximumDiscount: Joi.number().min(0).optional().allow(null),
  usageLimit: Joi.number().integer().min(1).optional().allow(null),
  perUserLimit: Joi.number().integer().min(1).optional().allow(null),
  startDate: Joi.date().iso().optional().allow(null),
  expiresAt: Joi.date().iso().optional().allow(null),
  applicableProducts: Joi.array().items(Joi.string().hex().length(24)).optional(),
  applicableCategories: Joi.array().items(Joi.string().hex().length(24)).optional(),
  excludedProducts: Joi.array().items(Joi.string().hex().length(24)).optional(),
  isActive: Joi.boolean().optional(),
});

const validateCoupon = Joi.object({
  code: Joi.string().trim().min(1).required(),
  subtotal: Joi.number().min(0).optional(),
});

export { createCoupon, updateCoupon, validateCoupon };
