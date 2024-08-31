import Ajv from "ajv";
import addFormats from "ajv-formats";
import express from "express";
import { MethodError } from "./errors.js";
import { load } from "./lib.js";
import "./db.js";

const methods = await load("./methods");
const schemas = await load("./schemas");

const ajv = new Ajv();
addFormats(ajv);

const app = express();
app.use(express.json());

const sendError = (res, message, data) => {
  const body = {
    error: {
      message: message,
      data: data,
    },
  };
  res.status(200).send(body);
};

const sendResult = (res, result = {}) => {
  const body = {
    result: result,
  };
  res.status(200).send(body);
};

app.post("/rpc", async (req, res) => {
  const method = req.body.method;
  const paramsSchema = schemas[method] ? schemas[method] : { type: "array" };
  const schema = {
    type: "object",
    properties: {
      method: { enum: Object.keys(methods) },
      params: paramsSchema,
    },
    required: ["method", "params"],
    additionalProperties: false,
  };

  const validate = ajv.compile(schema);
  const valid = validate(req.body);
  if (!valid) {
    sendError(res, "Invalid request.", validate.errors);
    return;
  }

  try {
    const result = await methods[method](...req.body.params);
    sendResult(res, result);
  } catch (err) {
    if (err instanceof MethodError) {
      sendError(res, err.message, err.data);
    } else {
      throw err;
    }
  }
});

app.listen(3000);
