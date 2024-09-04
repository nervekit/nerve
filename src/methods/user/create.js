import argon2 from "argon2";
import { send } from "../../email.js";
import { MethodError } from "../../errors.js";
import { User } from "../../models/user.js";
import { ErrorMessage } from "../../errors.js";

export default async (email, password) => {
  if (await User.exists({ email: email })) {
    throw new MethodError(ErrorMessage.EMAIL_EXISTS);
  }
  const hashed = await argon2.hash(password);
  const user = await User.create({ email: email, password: hashed });
  await send.welcome(user.email);
};

export const schema = {
  type: "array",
  items: [
    { type: "string", format: "email" },
    { type: "string", minLength: 8, maxLength: 64 },
  ],
  minItems: 2,
  maxItems: 2,
};
