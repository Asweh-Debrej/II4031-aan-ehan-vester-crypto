import InputError from "../error/missing-input-error";
import { mod } from "../utils/cipher";

const removeInvalidChars = false;

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
  let k = 0;
  let keyStream = "";
  for (let k = 0; k < textLength; k++) {
    i = (i + 1) % 256;
    j = (j + S[i]) % 256;
    // Swap S[i] and S[j]
    let temp = S[i];
    S[i] = S[j];
    S[j] = temp;
    let t = (S[i] + S[j]) % 256;
    keyStream += String.fromCharCode(S[t]);
    // extended vigenere cipher with keyLength shift
    
  }
  return keyStream;
}

export const encrypt = (plaintext, key) => {
    let errors = [];

    if (!plaintext) {
        errors.push({ field: "plaintext", message: "Plaintext is required" });
    }

    if (!key) {
        errors.push({ field: "key", message: "Key is required" });
    }

    if (errors.length > 0) {
        throw new InputError(
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

    let ksaKey = ksa(key);
    let S = prga(ksaKey, textLength, keyLength);
    // S XOR newPlaintext
    cipherText = "";
    for (let i = 0; i < textLength; i++) {
        cipherText += String.fromCharCode(newPlaintext.charCodeAt(i) ^ S.charCodeAt(i));
    }
    return cipherText;
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
        throw new InputError(
            "Missing required input",
            "MissingInputError",
            errors
        );
    }

    key = key.trim();

    const textLength = ciphertext.length;
    const keyLength = key.length;
    let decryptedText = "";

    let ksaKey = ksa(key);
    let S = prga(ksaKey, textLength, keyLength);
    // S XOR newPlaintext
    decryptedText = "";
    for (let i = 0; i < textLength; i++) {
        decryptedText += String.fromCharCode(ciphertext.charCodeAt(i) ^ S.charCodeAt(i));
    }
    return decryptedText;
};