import Joi from "joi";

const createCategory = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
  description: Joi.string().trim().optional().allow("", null),
  parent: Joi.string().hex().length(24).optional().allow(null),
  image: Joi.object({
    url: Joi.string().uri().required(),
    publicId: Joi.string().required(),
  }).optional(),
  icon: Joi.string().trim().optional().allow("", null),
  sortOrder: Joi.number().integer().min(0).optional(),
  metaTitle: Joi.string().trim().max(70).optional().allow("", null),
  metaDescription: Joi.string().trim().max(160).optional().allow("", null),
});

const updateCategory = Joi.object({
  name: Joi.string().trim().min(1).max(100).optional(),
  description: Joi.string().trim().optional().allow("", null),
  parent: Joi.string().hex().length(24).optional().allow(null),
  image: Joi.object({
    url: Joi.string().uri().required(),
    publicId: Joi.string().required(),
  }).optional(),
  icon: Joi.string().trim().optional().allow("", null),
  sortOrder: Joi.number().integer().min(0).optional(),
  isActive: Joi.boolean().optional(),
  metaTitle: Joi.string().trim().max(70).optional().allow("", null),
  metaDescription: Joi.string().trim().max(160).optional().allow("", null),
});

export { createCategory, updateCategory };
