import argon2 from "argon2";
import { MethodError, ErrorMessage } from "../../errors.js";
import { addSeconds } from "../../date.js";
import { Token, TokenScope } from "../../models/token.js";
import { User } from "../../models/user.js";

export default async (email, password) => {
  const user = await User.findOne({ email: email });
  if (!user || !(await argon2.verify(user.password, password))) {
    throw new MethodError(ErrorMessage.INVALID_LOGIN);
  }

  const token = await Token.create({
    scope: TokenScope.SESSION,
    user: user,
    expiration: addSeconds(new Date(), 3600),
  });
  return { token: token.token };
};

export { schema } from "./register.js";
