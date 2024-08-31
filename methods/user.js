import { User } from "../models/user.js";
import { MethodError } from "../errors.js";

export const create = async (email, password) => {
  // make sure the email is unique
  // throw error if email is not unique
  if (await User.exists({ email: email }).exec()) {
    throw new MethodError("User already exists with email.");
  }
  // remember: hash password
  await User.create({ email: email, password: password });
};
