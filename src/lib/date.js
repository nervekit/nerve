// Add the given number of seconds to a Date (returns new instance of Date).
export const addSeconds = (date, seconds) => {
  return new Date(date.getTime() + 1000 * seconds);
};
