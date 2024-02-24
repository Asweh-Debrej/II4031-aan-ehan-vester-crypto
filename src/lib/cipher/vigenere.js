import MissingInputError from "../error/missing-input-error";

export const encrypt = (plaintext, key) => {
  let errors = [];

  if (!plaintext) {
    errors.push({ field: "plaintext", message: "Plaintext is required" });
  }

  if (!key) {
    errors.push({ field: "key", message: "Key is required" });
  }

  if (errors.length > 0) {
    throw new MissingInputError("Missing required input", "MissingInputError", errors);
  }

  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  plaintext = plaintext.replace(/[^A-Z]/gi, "").toLowerCase();
  key = key.toLowerCase();

  const textLength = plaintext.length;
  const keyLength = key.length;
  let encryptedText = "";

  for (let i = 0; i < textLength; i++) {
    const textChar = plaintext[i];
    const keyChar = key[i % keyLength];
    const textCharIndex = alphabet.indexOf(textChar);
    const keyCharIndex = alphabet.indexOf(keyChar);
    let encryptedCharIndex = (textCharIndex + keyCharIndex) % 26;
    encryptedText += alphabet[encryptedCharIndex];
  }

  encryptedText = encryptedText
    .match(/.{1,5}/g)
    .join(" ")
    .toUpperCase();

  return encryptedText;
};

export const decrypt = (ciphertext, key) => {
  let errors = [];

  if (!ciphertext) {
    errors.push({ field: "ciphertext", message: "Ciphertext is required" });
  }

  if (!key) {
    errors.push({ field: "key", message: "Key is required" });
  }

  if (errors.length > 0) {
    throw new MissingInputError("Missing required input", "MissingInputError", errors);
  }

  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  ciphertext = ciphertext.replace(/[^A-Z]/gi, "").toLowerCase();
  key = key.toLowerCase();

  const textLength = ciphertext.length;
  const keyLength = key.length;
  let decryptedText = "";

  for (let i = 0; i < textLength; i++) {
    const textChar = ciphertext[i];
    const keyChar = key[i % keyLength];
    const textCharIndex = alphabet.indexOf(textChar);
    const keyCharIndex = alphabet.indexOf(keyChar);
    let decryptedCharIndex = (textCharIndex - keyCharIndex + 26) % 26;
    decryptedText += alphabet[decryptedCharIndex];
  }

  decryptedText = decryptedText
    .match(/.{1,5}/g)
    .join(" ")
    .toUpperCase();

  return decryptedText;
};
