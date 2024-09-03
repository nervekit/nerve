import argon2 from "argon2";
import { MethodError } from "../errors.js";
import { addSeconds } from "../lib.js";
import { Token, TokenScope } from "../models/token.js";
import { User } from "../models/user.js";

const EMAIL_EXISTS = "User already exists with email.";
const INVALID_LOGIN = "Invalid email or password.";

export const create = async (email, password) => {
  if (await User.exists({ email: email }).exec()) {
    throw new MethodError(EMAIL_EXISTS);
  }
  const hashed = await argon2.hash(password);
  await User.create({ email: email, password: hashed });
};

export const login = async (email, password) => {
  const user = await User.findOne({ email: email }).exec();
  if (!user) {
    throw new MethodError(INVALID_LOGIN);
  }
  if (await argon2.verify(user.password, password)) {
    const document = await Token.create({
      scope: TokenScope.SESSION,
      user: user,
      expiration: addSeconds(new Date(), 3600),
    });
    return { token: document.token };
  }
  throw new MethodError(INVALID_LOGIN);
};

export const logout = async (token) => {
  await Token.findOneAndDelete({ token: token });
};
