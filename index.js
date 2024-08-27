import Ajv from "ajv";
import addFormats from "ajv-formats";
import express from "express";
import { load } from "./lib.js";

const methods = await load("./methods");
const schemas = await load("./schemas");

const ajv = new Ajv();
addFormats(ajv);

const app = express();
app.use(express.json());

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
