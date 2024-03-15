import InputError from "../error/input-error";
import { mod } from "../utils/cipher";

function ksa(key) {
  let keyLength = key.length;
  let S = new Array(256);
  for (let i = 0; i < 256; i++) {
    S[i] = i;
  }
  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + S[i] + key.charCodeAt(i % keyLength)) % 256;
    // Swap S[i] and S[j]
    let temp = S[i];
    S[i] = S[j];
    S[j] = temp;
  }
  return S;
}

function prga(S, textLength, keyLength) {
  let i = 0;
  let j = 0;
  let keyStream = "";
  for (let k = 0; k < textLength; k++) {
    i = (i + 1) % 256;
    j = (j + S[i]) % 256;
    let temp = S[i];
    S[i] = S[j];
    S[j] = temp;
    let t = (S[i] + S[j]) % 256;
    let shift = S[t] % keyLength; // Using shift from vigenere cipher concept
    let shiftedCharCode = (S[t] + shift) % 256;
    keyStream += String.fromCharCode(shiftedCharCode);
  }
  return keyStream;
}

const encryptDecrypt = (text, key) => {
  const textLength = text.length;
  const keyLength = key.length;

  let ksaKey = ksa(key);
  let S = prga(ksaKey, textLength, keyLength);
  // S XOR text
  let res = "";
  for (let i = 0; i < textLength; i++) {
    res += String.fromCharCode(text.charCodeAt(i) ^ S.charCodeAt(i));
  }
  return res;
};

export const encrypt = (plaintext, key) => {
  let errors = [];

  if (!plaintext) {
    errors.push({ field: "plaintext", message: "Plaintext is required" });
  }

  if (!key) {
    errors.push({ field: "key", message: "Key is required" });
  }

  if (errors.length > 0) {
    throw new InputError("Missing required input", "MissingInputError", errors);
  }

  return encryptDecrypt(plaintext, key);
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
    throw new InputError("Missing required input", "MissingInputError", errors);
  }

  return encryptDecrypt(ciphertext, key);
};
