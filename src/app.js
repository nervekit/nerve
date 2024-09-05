import { bodyParser } from "@koa/bodyparser";
import Koa from "koa";
import { logger } from "./middleware/logger.js";
import mongoose from "mongoose";
import { loadModules, loadMethods, modulePath } from "./modules.js";

export class App {
  models = {};
  methods = {};

  async init() {
    this.#initKoa();
    await this.#initMongoose();
    await this.#initModels();
    await this.#initMethods();
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
    const kit = await loadModules(modulePath(import.meta.url, "./models"));
    const app = await loadModules("./src/models");
    for (const m of kit.concat(app)) {
      this.models[m.name] = this.mongoose.model(m.name, m.schema);
    }
  }

  async #initMethods() {
    const kit = await loadMethods(modulePath(import.meta.url, "./methods"));
    const app = await loadMethods("./src/methods");
    this.methods = { ...kit, ...app };
  }

  listen(port) {
    this.koa.listen(port);
  }
}
