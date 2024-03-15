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

export const encrypt = (plaintext, key) => {
    
};

export const decrypt = (ciphertext, key) => {
    
};