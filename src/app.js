import { bodyParser } from "@koa/bodyparser";
import Koa from "koa";
import { logger } from "./middleware/logger.js";
import mongoose from "mongoose";
import { load, modulePath } from "./modules.js";

export class App {
  models = {};

  async init() {
    this.#initKoa();
    await this.#initMongoose();
    await this.#initModels();
  }

  #initKoa() {
    this.koa = new Koa();
    this.koa.use(logger());
    this.koa.use(bodyParser());
    // this.koa.use(router.routes());
    // this.koa.use(router.allowedMethods());
  }

  async #initMongoose() {
    const options = { serverSelectionTimeoutMS: 5000 };
    this.mongoose = await mongoose
      .createConnection(process.env.MONGODB_URI, options)
      .asPromise();
  }

  async #initModels() {
    const kit = await load(modulePath(import.meta.url, "./models"));
    const app = await load("./src/models");
    for (const m of kit.concat(app)) {
      this.models[m.name] = this.mongoose.model(m.name, m.schema);
    }
  }

  listen(port) {
    this.koa.listen(port);
  }
}
