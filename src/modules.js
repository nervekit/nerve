import path from "node:path";
import fs from "node:fs/promises";
import url from "node:url";

// Always pass `import.meta.url` from the module you are basing the path on:
//      modulePath(import.meta.url, ...paths)
export const modulePath = (moduleUrl, ...paths) => {
  const dir = path.dirname(url.fileURLToPath(moduleUrl));
  return path.resolve(dir, ...paths);
};

const readDir = async (path, filter) => {
  const files = await fs.readdir(path, { withFileTypes: true });
  return files.filter(filter);
};

const dirFiles = async (dir) => {
  return await readDir(dir, (f) => f.isFile());
};

export const load = async (dir) => {
  const files = await dirFiles(dir);
  const modules = files.map((f) => import(path.resolve(f.parentPath, f.name)));
  return await Promise.all(modules);
};
