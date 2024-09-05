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

const getFiles = async (dir) => {
  return await readDir(dir, (f) => f.isFile());
};

const getDirs = async (dir) => {
  return await readDir(dir, (f) => f.isDirectory());
};

export const loadModules = async (dir) => {
  const files = await getFiles(dir);
  const modules = files.map((f) => import(path.resolve(f.parentPath, f.name)));
  return await Promise.all(modules);
};

export const loadMethods = async (dir) => {
  const methods = {};
  const dirs = await getDirs(dir);
  for (const d of dirs) {
    const files = await getFiles(path.resolve(d.parentPath, d.name));
    for (const f of files) {
      const module = await import(path.resolve(f.parentPath, f.name));
      const name = path.parse(f.name).name;
      methods[d.name + "." + name] = module;
    }
  }
  return methods;
};
