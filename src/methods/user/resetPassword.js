import { Token, TokenScope } from "../../models/token.js";
import { MethodError, ErrorMessage } from "../../errors.js";
import argon2 from "argon2";

export default async (token, password) => {
  const tokenDocument = await Token.findOne({
    scope: TokenScope.PASSWORD_RESET,
    token: token,
  }).populate("user");

  if (!tokenDocument) {
    throw new MethodError(ErrorMessage.INVALID_TOKEN);
  }

  tokenDocument.user.password = await argon2.hash(password);
  await tokenDocument.user.save();
  await Token.deleteOne({ token: token });
};

export const schema = {
  type: "array",
  items: [
    { type: "string", minLength: 8, maxLength: 64 },
    { type: "string", minLength: 8, maxLength: 64 },
  ],
  minItems: 2,
  maxItems: 2,
};
