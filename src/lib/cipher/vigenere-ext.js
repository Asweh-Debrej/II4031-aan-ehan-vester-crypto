import MissingInputError from "../error/missing-input-error";
import { mod } from "../utils/cipher";

const removeInvalidChars = false;

export const encrypt = (plaintext, key) => {
  let errors = [];

  if (!plaintext) {
    errors.push({ field: "plaintext", message: "Plaintext is required" });
  }

  if (!key) {
    errors.push({ field: "key", message: "Key is required" });
  }

  if (errors.length > 0) {
    throw new MissingInputError(
      "Missing required input",
      "MissingInputError",
      errors
    );
  }

  key = key.trim();

  let newPlaintext = "";
  if (removeInvalidChars) {
    for (let i = 0; i < plaintext.length; i++) {
      if (plaintext.charCodeAt(i) < 256) {
        newPlaintext += plaintext[i];
      }
    }
  } else {
    newPlaintext = plaintext;
  }

  const textLength = newPlaintext.length;
  const keyLength = key.length;
  let encryptedText = "";

  for (let i = 0; i < textLength; i++) {
    const textChar = newPlaintext[i];
    const keyChar = key[i % keyLength].charCodeAt(0);
    const textCharIndex = textChar.charCodeAt(0);
    let encryptedCharIndex;

    // Precondition: invalid characters are removed if removeInvalidChars is true
    if (textCharIndex < 256) {
      encryptedCharIndex = (textCharIndex + keyChar) % 256;
    } else {
      encryptedCharIndex = textCharIndex;
    }

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
    throw new MissingInputError(
      "Missing required input",
      "MissingInputError",
      errors
    );
  }

  key = key.trim();

  let newCiphertext = "";
  if (removeInvalidChars) {
    for (let i = 0; i < ciphertext.length; i++) {
      if (ciphertext.charCodeAt(i) < 256) {
        newCiphertext += ciphertext[i];
      }
    }
  } else {
    newCiphertext = ciphertext;
  }

  const textLength = newCiphertext.length;
  const keyLength = key.length;
  let decryptedText = "";

  for (let i = 0; i < textLength; i++) {
    const textChar = newCiphertext[i];
    const keyChar = key[i % keyLength].charCodeAt(0);
    const textCharIndex = textChar.charCodeAt(0);
    let decryptedCharIndex;

    // Precondition: invalid characters are removed if removeInvalidChars is true
    if (textCharIndex < 256) {
      decryptedCharIndex = mod(textCharIndex - keyChar, 256);
    } else {
      decryptedCharIndex = textCharIndex;
    }

    decryptedText += String.fromCharCode(decryptedCharIndex);
  }

  return decryptedText;
};
