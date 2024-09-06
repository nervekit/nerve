import Ajv from "ajv";
import addFormats from "ajv-formats";
import { methods } from "../methods.js";

const ajv = new Ajv();
addFormats(ajv);

const errorResponse = (ctx, errors) => {
  ctx.status = 200;
  ctx.body = {
    error: {
      message: "Invalid Request",
      data: errors,
    },
  };
};

const primarySchema = () => {
  return {
    type: "object",
    properties: {
      method: { enum: Object.keys(methods) },
      params: { type: "array" },
    },
    required: ["method", "params"],
    additionalProperties: false,
  };
};

const primary = async (body) => {
  const validate = ajv.compile(primarySchema());
  validate(body);
  return validate.errors;
};

const secondary = async (body) => {
  const schema = { ...primarySchema() };
  schema.properties.params = methods[body.method]["schema"];
  const validate = ajv.compile(schema);
  validate(body);
  return validate.errors;
};

export function rpc() {
  return async function (ctx, next) {
    console.log(ctx.request.body);

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
