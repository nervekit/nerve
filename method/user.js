export function create(email, password) {
  return { user: { email: email, password: password } };
}
