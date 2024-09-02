import Ajv from "ajv";
import addFormats from "ajv-formats";
import { load } from "./lib.js";

export function logger(format) {
  return async function logger(ctx, next) {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.status} ${ctx.method} ${ctx.url} - ${ms}ms`);
  };
}

export function validateRPC() {
  return async function (ctx, next) {
    const methods = await load("./methods");
    const schemas = await load("./schemas");
    const { method } = ctx.request.body;
    const paramsSchema = schemas[method] ? schemas[method] : { type: "array" };
    const schema = {
      type: "object",
      properties: {
        method: { enum: Object.keys(methods) },
        params: paramsSchema,
      },
      required: ["method", "params"],
      additionalProperties: false,
    };
    const ajv = new Ajv();
    addFormats(ajv);
    const validate = ajv.compile(schema);
    const valid = validate(ctx.request.body);
    if (valid) {
      await next();
    } else {
      ctx.status = 400;
      ctx.body = {
        error: {
          message: "Invalid Request",
          data: validate.errors,
        },
      };
    }
  };
}
