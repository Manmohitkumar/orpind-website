import Joi from "joi";

const ingredientSchema = Joi.object({
  productId: Joi.string().hex().length(24).optional().allow(null),
  productName: Joi.string().trim().min(1).required(),
  quantity: Joi.string().trim().min(1).required(),
  isOptional: Joi.boolean().optional(),
});

const createRecipe = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),
  description: Joi.string().trim().max(1000).optional().allow("", null),
  ingredients: Joi.array().items(ingredientSchema).min(1).required(),
  instructions: Joi.array().items(Joi.string().trim()).min(1).required(),
  prepTime: Joi.number().integer().min(0).optional(),
  cookTime: Joi.number().integer().min(0).optional(),
  servings: Joi.number().integer().min(1).optional(),
  difficulty: Joi.string().valid("easy", "medium", "hard").default("medium"),
  cuisine: Joi.string().trim().optional().allow("", null),
  tags: Joi.array().items(Joi.string().trim().lowercase()).optional(),
  metaTitle: Joi.string().trim().max(70).optional().allow("", null),
  metaDescription: Joi.string().trim().max(160).optional().allow("", null),
});

const updateRecipe = Joi.object({
  title: Joi.string().trim().min(1).max(200).optional(),
  description: Joi.string().trim().max(1000).optional().allow("", null),
  ingredients: Joi.array().items(ingredientSchema).min(1).optional(),
  instructions: Joi.array().items(Joi.string().trim()).min(1).optional(),
  prepTime: Joi.number().integer().min(0).optional(),
  cookTime: Joi.number().integer().min(0).optional(),
  servings: Joi.number().integer().min(1).optional(),
  difficulty: Joi.string().valid("easy", "medium", "hard").optional(),
  cuisine: Joi.string().trim().optional().allow("", null),
  tags: Joi.array().items(Joi.string().trim().lowercase()).optional(),
  status: Joi.string().valid("draft", "published").optional(),
  metaTitle: Joi.string().trim().max(70).optional().allow("", null),
  metaDescription: Joi.string().trim().max(160).optional().allow("", null),
});

export { createRecipe, updateRecipe };
