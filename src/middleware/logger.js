import { log } from "../log.js";

export function logger() {
  return async function logger(ctx, next) {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    log.info(`${ctx.status} ${ctx.method} ${ctx.url} - ${ms}ms`);
  };
}
