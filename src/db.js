import mongoose from "mongoose";

export const idSchema = {
  type: "string",
  pattern: "[0-9a-f]{24}",
};

const options = { serverSelectionTimeoutMS: 5000 };
const uri = process.env.MONGODB_URI;
export const db = await mongoose.createConnection(uri, options).asPromise();
