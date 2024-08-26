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
      const name = path.parse(file.name);
      methods[name.name] = module;
    }
  }
  console.log(methods);
};

await main();

app.post("/rpc", (req, res) => {
  console.log(req.body);
  res.send("response body");
});

app.listen(3000);
