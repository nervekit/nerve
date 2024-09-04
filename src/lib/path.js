import path from "node:path";
import { fileURLToPath } from "url";

// Always pass `import.meta.url` from the module you are basing the path on:
//      moduleDir(import.meta.url)
export const moduleDir = (url) => {
  return path.dirname(fileURLToPath(url));
};
