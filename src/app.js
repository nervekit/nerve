import { bodyParser } from "@koa/bodyparser";
import Koa from "koa";
import { logger } from "./middleware/logger.js";
import "./db.js";
import { router } from "./router.js";

const app = new Koa();
app.use(logger());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);
