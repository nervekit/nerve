import fs from "node:fs/promises";
import path from "node:path";
import { moduleDir } from "./path.js";

const methods = {};
const kitPath = path.resolve(moduleDir(import.meta.url), "../methods");
const appPath = "./src/methods";

const readDir = async (path, filter) => {
  const files = await fs.readdir(path, { withFileTypes: true });
  return files.filter(filter);
};

const cache = async (dir) => {
  const dirs = await readDir(dir, (f) => f.isDirectory());
  for (const d of dirs) {
    const p = path.resolve(d.parentPath, d.name);
    const files = await readDir(p, (f) => f.isFile());
    for (const f of files) {
      const module = await import(path.resolve(f.parentPath, f.name));
      const name = path.parse(f.name).name;
      methods[d.name + "." + name] = module;
    }
  }
};

const cacheKit = async () => {
  await cache(kitPath);
};

const cacheApp = async () => {
  try {
    await cache(appPath);
  } catch (err) {
    if (err.code === "ENOENT" && err.path === appPath) {
      console.log("no app methods found");
    } else {
      throw err;
    }
  }
};

export const load = async () => {
  if (Object.keys(methods).length === 0) {
    await cacheKit();
    await cacheApp();
  }
  return methods;
};
