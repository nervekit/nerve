import Router from "@koa/router";
import { MethodError } from "./errors.js";
import { rpc } from "./middleware/rpc.js";
import { methods } from "./methods.js";

export const router = new Router();

router.post("/rpc", rpc(), async (ctx) => {
  const { method, params } = ctx.request.body;
  try {
    let result = await methods[method]["default"](...params);
    result = result ? result : {};
    ctx.body = {
      result: result,
    };
  } catch (err) {
    if (err instanceof MethodError) {
      ctx.status = 200;
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
