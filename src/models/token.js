import mongoose from "mongoose";
import { secureToken } from "../lib/token.js";

export const TokenScope = {
  SESSION: "session",
  PASSWORD_RESET: "password_reset",
  EMAIL_VERIFY: "email_verify",
};

export const name = "Token";
export const schema = new mongoose.Schema({
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
