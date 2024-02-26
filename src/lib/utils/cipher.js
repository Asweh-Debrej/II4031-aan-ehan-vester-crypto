export const explode = (str, length = 5) => {
  return str
  .match(new RegExp(`.{1,${length}}`, "g"))
  .join(" ")
  .toUpperCase();
}

export const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
