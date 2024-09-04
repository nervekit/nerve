import crypto from "crypto";
import { promisify } from "util";

const randomBytes = promisify(crypto.randomBytes);

// Generate a URL-safe secure token.
export const secureToken = async () => {
  const token = await randomBytes(32);
  return token.toString("base64url");
};
