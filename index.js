import fs from "node:fs/promises";

const main = async () => {
  const files = await fs.readdir("./method", { withFileTypes: true });

  for (const file of files) {
    if (file.isFile()) {
      const module = await import(file.parentPath + "/" + file.name);
      console.log(module);
    }
  }
};

await main();
