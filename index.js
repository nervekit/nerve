import Ajv from "ajv";
import express from "express";
import fs from "node:fs/promises";
import path from "node:path";

const ajv = new Ajv();
const app = express();
app.use(express.json());

const methods = {};
const schemas = {};

const loadMethods = async () => {
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

const loadSchemas = async () => {
  const files = await fs.readdir("./schema", { withFileTypes: true });

  for (const file of files) {
    if (file.isFile()) {
      const module = await import(file.parentPath + "/" + file.name);
      const name = path.parse(file.name).name;
      for (const [key, value] of Object.entries(module)) {
        schemas[name + "." + key] = value;
      }
    }
  }
};

await loadMethods();
await loadSchemas();

app.post("/rpc", async (req, res) => {
  const method = req.body.method;
  const paramsSchema = schemas[method] ? schemas[method] : { type: "array" };

  const schema = {
    type: "object",
    properties: {
      method: { enum: Object.keys(methods) },
      params: paramsSchema,
    },
    required: ["method"],
    additionalProperties: false,
  };

  const validate = ajv.compile(schema);
  const valid = validate(req.body);
  if (!valid) {
    res.status(400).send(validate.errors);
    return;
  }

  const result = await methods[method](...req.body.params);
  res.send(result);
});

app.listen(3000);
