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

  const textLength = plaintext.length;
  const keyLength = key.length;
  let encryptedText = "";

  for (let i = 0; i < textLength; i++) {
    const textChar = plaintext[i];
    const keyChar = key[i % keyLength].charCodeAt(0);
    const textCharIndex = textChar.charCodeAt(0);
    let encryptedCharIndex = (textCharIndex + keyChar) % 256;
    encryptedText += String.fromCharCode(encryptedCharIndex);
  }

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

  const textLength = ciphertext.length;
  const keyLength = key.length;
  let decryptedText = "";

  for (let i = 0; i < textLength; i++) {
    const textChar = ciphertext[i];
    const keyChar = key[i % keyLength].charCodeAt(0);
    const textCharIndex = textChar.charCodeAt(0);
    let decryptedCharIndex = (textCharIndex - keyChar + 256) % 256;
    decryptedText += String.fromCharCode(decryptedCharIndex);
  }

  return decryptedText;
};
