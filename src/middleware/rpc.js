import Ajv from "ajv";
import addFormats from "ajv-formats";
import { loadMethods } from "../lib.js";

const ajv = new Ajv();
addFormats(ajv);

const methods = await loadMethods();

const primarySchema = {
  type: "object",
  properties: {
    method: { enum: Object.keys(methods) },
    params: { type: "array" },
  },
  required: ["method", "params"],
  additionalProperties: false,
};

const errorResponse = (ctx, errors) => {
  ctx.status = 200;
  ctx.body = {
    error: {
      message: "Invalid Request",
      data: errors,
    },
  };
};

const primary = async (body) => {
  const validate = ajv.compile(primarySchema);
  validate(body);
  return validate.errors;
};

const secondary = async (body) => {
  const schema = { ...primarySchema };
  schema.properties.params = methods[body.method]["schema"];
  const validate = ajv.compile(schema);
  validate(body);
  return validate.errors;
};

export function rpc() {
  return async function (ctx, next) {
    for (const check of [primary, secondary]) {
      const errors = await check(ctx.request.body);
      if (errors) {
        errorResponse(ctx, errors);
        return;
      }
    }
    await next();
  };
}
