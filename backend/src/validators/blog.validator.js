import Joi from "joi";

const createBlog = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),
  excerpt: Joi.string().trim().max(500).optional().allow("", null),
  content: Joi.string().min(1).required(),
  category: Joi.string().trim().optional().allow("", null),
  tags: Joi.array().items(Joi.string().trim().lowercase()).optional(),
  status: Joi.string().valid("draft", "review", "published", "archived").default("draft"),
  metaTitle: Joi.string().trim().max(70).optional().allow("", null),
  metaDescription: Joi.string().trim().max(160).optional().allow("", null),
  ogImage: Joi.string().uri().optional().allow("", null),
});

const updateBlog = Joi.object({
  title: Joi.string().trim().min(1).max(200).optional(),
  excerpt: Joi.string().trim().max(500).optional().allow("", null),
  content: Joi.string().min(1).optional(),
  category: Joi.string().trim().optional().allow("", null),
  tags: Joi.array().items(Joi.string().trim().lowercase()).optional(),
  status: Joi.string().valid("draft", "review", "published", "archived").optional(),
  metaTitle: Joi.string().trim().max(70).optional().allow("", null),
  metaDescription: Joi.string().trim().max(160).optional().allow("", null),
  ogImage: Joi.string().uri().optional().allow("", null),
});

export { createBlog, updateBlog };
