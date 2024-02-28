import InputError from "../error/missing-input-error";
import { alphabet, mod } from "../utils/cipher";

const isRelativePrime = (a, b) => {
  if (b === 0) {
    return a === 1;
  }

  return isRelativePrime(b, a % b);
}

const modInverse = (a, m) => {
  for (let i = 1; i < m; i++) {
    if ((a * i) % m === 1) {
      return i;
    }
  }

  return 1;
}

export const encrypt = (plaintext, multiplier, shift) => {
  let errors = [];

  if (!plaintext) {
    errors.push({ field: "plaintext", message: "Plaintext is required" });
  }

  if (!multiplier) {
    errors.push({ field: "multiplier", message: "Multiplier is required" });
  }

  if (!shift) {
    errors.push({ field: "shift", message: "Shift is required" });
  }

  if (!isRelativePrime(multiplier, 26)) {
    errors.push({ field: "multiplier", message: "Multiplier must be a relative prime of 26" });
  }

  if (errors.length > 0) {
    throw new InputError("Missing required input", "MissingInputError", errors);
  }

  plaintext = plaintext.replace(/[^A-Z]/gi, "").toUpperCase();

  multiplier = parseInt(multiplier);
  shift = parseInt(shift);

  const textLength = plaintext.length;
  let encryptedText = "";

  for (let i = 0; i < textLength; i++) {
    const textChar = plaintext[i];
    const textCharIndex = alphabet.indexOf(textChar);
    let encryptedCharIndex = (multiplier * textCharIndex + shift) % 26;
    encryptedText += alphabet[encryptedCharIndex];
  }

  return encryptedText;
};

export const decrypt = (ciphertext, multiplier, shift) => {
  let errors = [];

  if (!ciphertext) {
    errors.push({ field: "ciphertext", message: "Ciphertext is required" });
  }

  if (!multiplier) {
    errors.push({ field: "multiplier", message: "Multiplier is required" });
  }

  if (!shift) {
    errors.push({ field: "shift", message: "Shift is required" });
  }

  if (!isRelativePrime(multiplier, 26)) {
    errors.push({ field: "multiplier", message: "Multiplier must be a relative prime of 26" });
  }

  if (errors.length > 0) {
    throw new InputError("Missing required input", "MissingInputError", errors);
  }

  ciphertext = ciphertext.replace(/[^A-Z]/gi, "").toUpperCase();

  multiplier = parseInt(multiplier);
  shift = parseInt(shift);

  const textLength = ciphertext.length;
  let decryptedText = "";

  for (let i = 0; i < textLength; i++) {
    const textChar = ciphertext[i];
    const textCharIndex = alphabet.indexOf(textChar);
    let decryptedCharIndex = mod(modInverse(multiplier, 26) * (textCharIndex - shift + 26), 26);
    decryptedText += alphabet[decryptedCharIndex];
  }

  return decryptedText;
};
