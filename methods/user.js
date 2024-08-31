import { User } from "../models/user.js";
import { MethodError } from "../errors.js";
import argon2 from "argon2";

export const create = async (email, password) => {
  if (await User.exists({ email: email }).exec()) {
    throw new MethodError("User already exists with email.");
  }
  const hashed = await argon2.hash(password);
  await User.create({ email: email, password: hashed });
};
