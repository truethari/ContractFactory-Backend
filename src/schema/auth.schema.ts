import Joi, { type SchemaMap } from "joi";
import { ethAddressSchema } from "../utils/ethers";

export const loginSchema: SchemaMap = {
  body: Joi.object({
    message: Joi.string().required(),
    address: ethAddressSchema,
    signature: Joi.string().required(),
  }),
};
