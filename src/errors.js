const EMAIL_EXISTS = "User already exists with email.";
const INVALID_LOGIN = "Invalid email or password.";
const INVALID_TOKEN = "Invalid token.";

export const ErrorMessage = {
  EMAIL_EXISTS: "User already exists with email.",
  INVALID_LOGIN: "Invalid email or password.",
  INVALID_TOKEN: "Invalid token.",
};

export class MethodError extends Error {
  constructor(...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MethodError);
    }

    this.name = "MethodError";
  }
}
