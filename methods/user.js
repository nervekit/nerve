import { User } from "../models/user.js";

export const create = async (email, password) => {
  // make sure the email is unique
  // throw error if email is not unique
  const user = await User.exists({ email: email }).exec();
  if (user) {
    throw new Error();
  }
};
