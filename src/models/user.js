import mongoose from "mongoose";
import { db } from "../db.js";

export const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: { unique: true },
  },
  password: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export const User = db.model("User", schema);
