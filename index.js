import fs from "node:fs/promises";
import path from "node:path";
import express from "express";

const app = express();
app.use(express.json());

const methods = {};

const main = async () => {
  const files = await fs.readdir("./method", { withFileTypes: true });

  for (const file of files) {
    if (file.isFile()) {
      const module = await import(file.parentPath + "/" + file.name);
      const name = path.parse(file.name).name;
      for (const [key, value] of Object.entries(module)) {
        methods[name + "." + key] = value;
      }
    }
  }
};

await main();

app.post("/rpc", (req, res) => {
  const method = req.body.method;
  const params = req.body.params;

  if (method && Object.hasOwn(methods, method)) {
    const result = methods[method](...params);
    res.send(result);
  } else {
    res.status(400).send();
  }
});

app.listen(3000);
