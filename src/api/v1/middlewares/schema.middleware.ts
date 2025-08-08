import { type Handler } from "express";
import Joi, { type SchemaMap } from "joi";
import { ERROR_RESPONSE } from "../../../lib/customHandler";
import { HTTP_STATUS_CODE } from "../../../utils/constants";

type SupportedKeys = "params" | "body" | "query";

interface Options {
  params?: SchemaMap;
  body?: SchemaMap;
  query?: SchemaMap;
}

type ExpressJoiValidate = (schemaOptions: Options) => Handler;

/**
 * Route validation using Joi
 * Takes a schema with properties defined using Joi:
 *  - params
 *  - body
 *  - query
 * Validates the request properties specified in the schema
 * @param {Object} schema { params, body, query }
 */
const validationSchema: ExpressJoiValidate = (schema: Options) => (req, res, next) => {
  if (!schema) {
    next();
    return;
  }

  const obj: Options = {};
  ["params", "body", "query"].forEach((key) => {
    const k: SupportedKeys = key as SupportedKeys;

    if (schema[k]) obj[k] = req[k];
  });

  const joiSchema = Joi.object(schema);
  const { error } = joiSchema.validate(obj);

  const valid = error == null;
  if (valid) {
    next();
  } else {
    const { details } = error;
    const message: string = details
      .map((i: { message: string }) => i.message)
      .join(",")
      ?.replace(/"/g, "")
      ?.replace("body.", "");

    return ERROR_RESPONSE(res, false, HTTP_STATUS_CODE.BAD_REQUEST_RESPONSE_CODE, message);
  }
};

export default validationSchema;
