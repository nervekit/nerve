import { Token, TokenScope } from "../../models/token.js";

export default async (token) => {
  await Token.findOneAndDelete({
    scope: TokenScope.SESSION,
    token: token,
  });
};

export const schema = {
  type: "array",
  items: [{ type: "string", minLength: 8, maxLength: 64 }],
  minItems: 1,
  maxItems: 1,
};
