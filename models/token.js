import mongoose from "mongoose";

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
    required: true,
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

export const Token = mongoose.model("Token", schema);
