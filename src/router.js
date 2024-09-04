import Router from "@koa/router";
import { MethodError } from "./errors.js";
import { load } from "./lib/methods.js";
import { rpc } from "./middleware/rpc.js";

export const router = new Router();
const methods = await load();

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
