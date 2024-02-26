export const explode = (str, length = 5) => {
  return str
  .match(new RegExp(`.{1,${length}}`, "g"))
  .join(" ")
  .toUpperCase();
}

export const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// This allows for negative numbers to be handled properly
export const mod = (m, n) => {
  return ((m % n) + n) % n;
}
