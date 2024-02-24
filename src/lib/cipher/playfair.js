export const encrypt = (text, key) => {
  // filter only alphabet characters
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  text = text.toLowerCase().replace(/[^a-z]/g, "");
  key = key.toLowerCase().replace(/[^a-z]/g, "");




}
