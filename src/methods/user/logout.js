import { ErrorMessage, MethodError } from "../../errors.js";
import { Token, TokenScope } from "../../models/token.js";

export default async (token) => {
  const doc = await Token.findOne({
    scope: TokenScope.SESSION,
    token: token,
  });
  if (!doc) {
    throw new MethodError(ErrorMessage.INVALID_TOKEN);
  }
  await doc.deleteOne();
};

export const schema = {
  type: "array",
  items: [{ type: "string", minLength: 8, maxLength: 64 }],
  minItems: 1,
  maxItems: 1,
};
