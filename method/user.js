export const create = async (email, password) => {
  return { user: { email: email, password: password } };
};
