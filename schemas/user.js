export const create = {
  type: "array",
  items: [
    { type: "string", format: "email" },
    { type: "string", minLength: 8, maxLength: 64 },
  ],
  minItems: 2,
  maxItems: 2,
};

export const login = create;
