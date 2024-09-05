import mongoose from "mongoose";

const options = { serverSelectionTimeoutMS: 5000 };
const uri = process.env.MONGODB_URI;
export const db = await mongoose.createConnection(uri, options).asPromise();
