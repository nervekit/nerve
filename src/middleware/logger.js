export function logger(format) {
  return async function logger(ctx, next) {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.status} ${ctx.method} ${ctx.url} - ${ms}ms`);
  };
}
