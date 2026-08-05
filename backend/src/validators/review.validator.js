import Joi from "joi";

const createReview = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  title: Joi.string().trim().max(100).optional().allow("", null),
  comment: Joi.string().trim().max(2000).optional().allow("", null),
});

const updateReview = Joi.object({
  rating: Joi.number().integer().min(1).max(5).optional(),
  title: Joi.string().trim().max(100).optional().allow("", null),
  comment: Joi.string().trim().max(2000).optional().allow("", null),
});

export { createReview, updateReview };
