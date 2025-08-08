import Joi, { type SchemaMap } from "joi";

export const signup: SchemaMap = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    phone: Joi.string().required(),
    country: Joi.string().required(),
  }),
};
