import MissingInputError from "../error/missing-input-error";
import { alphabet, mod } from "../utils/cipher";

// Vigenere cipher with auto key

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

  plaintext = plaintext.replace(/[^A-Z]/gi, "").toUpperCase();
  key = key.trim().replace(/[^A-Z]/gi, "").toUpperCase();

  const textLength = plaintext.length;
  let encryptedText = "";

  for (let i = 0; i < textLength; i++) {
    const textChar = plaintext[i];
    const keyChar = key[i];
    const textCharIndex = alphabet.indexOf(textChar);
    const keyCharIndex = alphabet.indexOf(keyChar);
    let encryptedCharIndex = (textCharIndex + keyCharIndex) % 26;
    encryptedText += alphabet[encryptedCharIndex];
    key += textChar;
  }

  return encryptedText;
}

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

  ciphertext = ciphertext.replace(/[^A-Z]/gi, "").toUpperCase();
  key = key.trim().replace(/[^A-Z]/gi, "").toUpperCase();

  const textLength = ciphertext.length;
  let decryptedText = "";

  for (let i = 0; i < textLength; i++) {
    const textChar = ciphertext[i];
    const keyChar = key[i];
    const textCharIndex = alphabet.indexOf(textChar);
    const keyCharIndex = alphabet.indexOf(keyChar);
    let decryptedCharIndex = mod(textCharIndex - keyCharIndex, 26);
    decryptedText += alphabet[decryptedCharIndex];
    key += alphabet[decryptedCharIndex];
  }

  return decryptedText;
}
