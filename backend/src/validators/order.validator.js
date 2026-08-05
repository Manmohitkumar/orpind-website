import Joi from "joi";

const createOrder = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().hex().length(24).required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),
  addressId: Joi.string().hex().length(24).required(),
  paymentMethod: Joi.string().valid("cod", "razorpay").required(),
  couponCode: Joi.string().trim().optional().allow("", null),
  isGift: Joi.boolean().optional(),
  giftMessage: Joi.string().trim().max(500).optional().allow("", null),
  notes: Joi.string().trim().max(500).optional().allow("", null),
});

const cancelOrder = Joi.object({
  reason: Joi.string().trim().min(1).max(500).required(),
});

const returnRequest = Joi.object({
  reason: Joi.string().trim().min(1).max(500).required(),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().hex().length(24).required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),
});

export { createOrder, cancelOrder, returnRequest };
