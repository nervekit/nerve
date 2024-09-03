export const create = {
  type: "array",
  items: [
    { type: "string", format: "email" },
    { type: "string", minLength: 8, maxLength: 64 },
  ],
  minItems: 2,
  maxItems: 2,
};

export const forgotPassword = {
  type: "array",
  items: [{ type: "string", format: "email" }],
  minItems: 1,
  maxItems: 1,
};

export const login = create;

export const logout = {
  type: "array",
  items: [{ type: "string", minLength: 8, maxLength: 64 }],
  minItems: 1,
  maxItems: 1,
};

export const resetPassword = {
  type: "array",
  items: [
    { type: "string", minLength: 8, maxLength: 64 },
    { type: "string", minLength: 8, maxLength: 64 },
  ],
  minItems: 2,
  maxItems: 2,
};
