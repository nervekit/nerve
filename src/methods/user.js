import argon2 from "argon2";
import { MethodError } from "../errors.js";
import { addSeconds } from "../lib.js";
import { Token, TokenScope } from "../models/token.js";
import { User } from "../models/user.js";
import { send } from "../email.js";

const EMAIL_EXISTS = "User already exists with email.";
const INVALID_LOGIN = "Invalid email or password.";
const INVALID_TOKEN = "Invalid token.";

export const create = async (email, password) => {
  if (await User.exists({ email: email })) {
    throw new MethodError(EMAIL_EXISTS);
  }
  const hashed = await argon2.hash(password);
  const user = await User.create({ email: email, password: hashed });
  await send.welcome(user.email);
};

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email: email });
  if (user) {
    const token = await Token.create({
      scope: TokenScope.PASSWORD_RESET,
      user: user,
      expiration: addSeconds(new Date(), 600),
    });
    await send.forgotPassword(email, token.token);
  }
};

export const resetPassword = async (token, password) => {
  const tokenDocument = await Token.findOne({
    scope: TokenScope.PASSWORD_RESET,
    token: token,
  }).populate("user");

  if (!tokenDocument) {
    throw new MethodError(INVALID_TOKEN);
  }

  tokenDocument.user.password = await argon2.hash(password);
  await tokenDocument.user.save();
  await Token.deleteOne({ token: token });
};

export const login = async (email, password) => {
  const user = await User.findOne({ email: email });
  if (!user || !(await argon2.verify(user.password, password))) {
    throw new MethodError(INVALID_LOGIN);
  }

  const token = await Token.create({
    scope: TokenScope.SESSION,
    user: user,
    expiration: addSeconds(new Date(), 3600),
  });
  return { token: token.token };
};

export const logout = async (token) => {
  await Token.findOneAndDelete({ token: token });
};
