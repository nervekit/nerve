import Koa from "koa";
import { bodyParser } from "@koa/bodyparser";
import { logger } from "./middleware/logger.js";
import { router } from "./router.js";
import "./db.js";
import { addMethods } from "./methods.js";
import { modulePath } from "./path.js";

export const init = async () => {
  await addMethods("./src/methods");
  await addMethods(modulePath(import.meta.url, "methods"));

  const app = new Koa();
  app.use(logger());
  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.allowedMethods());
  return app;
};
