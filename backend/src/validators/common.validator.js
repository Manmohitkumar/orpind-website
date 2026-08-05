import Joi from "joi";

const pagination = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(12),
});

const idParam = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const slugParam = Joi.object({
  slug: Joi.string().trim().min(1).required(),
});

const dateRange = Joi.object({
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().min(Joi.ref("startDate")),
}).with("startDate", "endDate");

export { pagination, idParam, slugParam, dateRange };
