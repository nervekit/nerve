import { send } from "../../email.js";
import { addSeconds } from "../../lib.js";
import { Token, TokenScope } from "../../models/token.js";
import { User } from "../../models/user.js";

export default async (email) => {
  const user = await User.findOne({ email: email });
  if (user) {
    const token = await Token.create({
      scope: TokenScope.PASSWORD_RESET,
      user: user,
      expiration: addSeconds(new Date(), 600),
    });
    await send.forgotPassword(email, token.token);
  }
};

export const schema = {
  type: "array",
  items: [{ type: "string", format: "email" }],
  minItems: 1,
  maxItems: 1,
};
