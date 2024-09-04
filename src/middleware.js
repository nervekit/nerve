import Ajv from "ajv";
import addFormats from "ajv-formats";
import { loadMethods } from "./lib.js";

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
    const methods = await loadMethods();
    const { method } = ctx.request.body;
    const schema = {
      type: "object",
      properties: {
        method: { enum: Object.keys(methods) },
        params: methods[method].schema,
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
      ctx.status = 200;
      ctx.body = {
        error: {
          message: "Invalid Request",
          data: validate.errors,
        },
      };
    }
  };
}
