import mongoose from "mongoose";
import { secureToken } from "../lib/token.js";
import { db } from "../db.js";

export const TokenScope = {
  SESSION: "session",
  PASSWORD_RESET: "password_reset",
  EMAIL_VERIFY: "email_verify",
};

const schema = new mongoose.Schema({
  scope: {
    type: String,
    required: true,
    enum: Object.values(TokenScope),
  },
  token: {
    type: String,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expiration: {
    type: Date,
    required: true,
    expires: 0,
  },
});

schema.pre("save", async function () {
  if (!this.token) {
    this.token = await secureToken();
  }
});

export const Token = db.model("Token", schema);
