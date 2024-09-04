import crypto from "crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "util";

const randomBytes = promisify(crypto.randomBytes);

const readDir = async (path, filter) => {
  const files = await fs.readdir(path, { withFileTypes: true });
  return files.filter(filter);
};

// Add the given number of seconds to a Date (returns new instance of Date).
export const addSeconds = (date, seconds) => {
  return new Date(date.getTime() + 1000 * seconds);
};

// Generate a URL safe secure token.
export const secureToken = async () => {
  const token = await randomBytes(32);
  return token.toString("base64url");
};

export const loadMethods = async () => {
  const methods = {};
  const dirs = await readDir("./src/methods", (f) => f.isDirectory());
  for (const d of dirs) {
    const p = path.resolve(d.parentPath, d.name);
    const files = await readDir(p, (f) => f.isFile());
    for (const f of files) {
      const module = await import(path.resolve(f.parentPath, f.name));
      const name = path.parse(f.name).name;
      methods[d.name + "." + name] = module;
    }
  }
  return methods;
};
