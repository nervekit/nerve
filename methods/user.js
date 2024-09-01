import { User } from "../models/user.js";
import { MethodError } from "../errors.js";
import argon2 from "argon2";

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
    return { sessionToken: "some random cool token" };
  }
  throw new MethodError(INVALID_LOGIN);
};
