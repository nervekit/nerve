import { bodyParser } from "@koa/bodyparser";
import Koa from "koa";
import mount from "koa-mount";
import serve from "koa-static";
import { addMethods } from "./methods.js";
import { logger } from "./middleware/logger.js";
import { modulePath } from "./path.js";
import { router } from "./router.js";
import "./db.js";

export const init = async () => {
  await addMethods("./src/methods");
  await addMethods(modulePath(import.meta.url, "methods"));

  const app = new Koa();
  app.use(logger());
  app.use(mount("/static", serve("./src/static")));
  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.allowedMethods());
  return app;
};
