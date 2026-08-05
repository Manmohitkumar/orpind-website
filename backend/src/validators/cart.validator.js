import Joi from "joi";

const addToCart = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  quantity: Joi.number().integer().min(1).default(1),
});

const updateCart = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
});

const applyCoupon = Joi.object({
  couponCode: Joi.string().trim().min(1).required(),
});

export { addToCart, updateCart, applyCoupon };
