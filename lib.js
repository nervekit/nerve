import fs from "node:fs/promises";
import path from "node:path";

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
