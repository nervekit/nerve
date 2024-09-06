export const ErrorMessage = {
  EMAIL_EXISTS: "User already exists with email.",
  INVALID_LOGIN: "Invalid email or password.",
  INVALID_TOKEN: "Invalid token.",
  NOT_FOUND: "Not found.",
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
