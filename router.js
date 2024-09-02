import Router from "@koa/router";
import { MethodError } from "./errors.js";
import { load } from "./lib.js";
import { validateRPC } from "./middleware.js";

export const router = new Router();
const methods = await load("./methods");

router.post("/rpc", validateRPC(), async (ctx) => {
  const { method, params } = ctx.request.body;
  try {
    let result = await methods[method](...params);
    result = result ? result : {};
    ctx.body = {
      result: result,
    };
  } catch (err) {
    if (err instanceof MethodError) {
      ctx.status = 400;
      ctx.body = {
        error: {
          message: err.message,
          data: err.data,
        },
      };
    } else {
      throw err;
    }
  }
});
