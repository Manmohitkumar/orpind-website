import Joi from "joi";

const createTicket = Joi.object({
  subject: Joi.string().trim().min(1).max(200).required(),
  message: Joi.string().trim().min(1).max(5000).required(),
  category: Joi.string().valid("order", "general", "technical", "billing").required(),
  orderId: Joi.string().hex().length(24).optional().allow(null),
  priority: Joi.string().valid("low", "medium", "high", "urgent").default("medium"),
});

const addMessage = Joi.object({
  message: Joi.string().trim().min(1).max(5000).required(),
});

export { createTicket, addMessage };
