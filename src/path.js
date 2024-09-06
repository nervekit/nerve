import path from "node:path";
import { fileURLToPath } from "url";

// Always pass `import.meta.url` from the module you are basing the path on:
//      modulePath(import.meta.url, ...paths)
export const modulePath = (moduleUrl, ...paths) => {
  const dir = path.dirname(fileURLToPath(moduleUrl));
  return path.resolve(dir, ...paths);
};
