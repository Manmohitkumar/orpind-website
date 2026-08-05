import Joi from "joi";

const subscribe = Joi.object({
  email: Joi.string().email().lowercase().required(),
});

const unsubscribe = Joi.object({
  email: Joi.string().email().lowercase().required(),
});

export { subscribe, unsubscribe };
