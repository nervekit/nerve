import crypto from "crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "util";

const randomBytes = promisify(crypto.randomBytes);

// Add the given number of seconds to a Date (returns new instance of Date).
export const addSeconds = (date, seconds) => {
  return new Date(date.getTime() + 1000 * seconds);
};

// Generate a URL safe secure token.
export const secureToken = async () => {
  const token = await randomBytes(32);
  return token.toString("base64url");
};

// Import the modules in a given directory.
export const load = async (dir) => {
  const modules = {};
  const files = await fs.readdir(dir, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile()) {
      const module = await import(file.parentPath + "/" + file.name);
      const name = path.parse(file.name).name;
      for (const [key, value] of Object.entries(module)) {
        modules[name + "." + key] = value;
      }
    }
  }
  return modules;
};
