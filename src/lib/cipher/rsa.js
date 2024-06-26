import InputError from "../error/input-error";
import { mod, modInverse, phi, gcd, isPrime, modPow } from "../utils/cipher";

export const generateKeys = (p, q) => {
  let errors = [];

  if (!p) {
    errors.push({ field: "p", message: "p is required" });
  } else if (!isPrime(p)) {
    errors.push({ field: "p", message: "p must be a prime number" });
  }

  if (!q) {
    errors.push({ field: "q", message: "q is required" });
  } else if (!isPrime(q)) {
    errors.push({ field: "q", message: "q must be a prime number" });
  }

  if (errors.length > 0) {
    throw new InputError("Missing required input", "MissingInputError", errors);
  }

  const n = p * q;
  const phiN = phi(p, q);
  let e = 2;
  while (e < phiN) {
    if (gcd(e, phiN) === 1) {
      break;
    }
    e++;
  }
  const d = modInverse(e, phiN);
  return { publicKey: { e, n }, privateKey: { d, n } };
};

export const encrypt = (plaintext, publicKey) => {
  let errors = [];

  if (!plaintext) {
    errors.push({ field: "plaintext", message: "Plaintext is required" });
  }

  if (!publicKey) {
    errors.push({ field: "publicKey", message: "Public key is required" });
  }

  if (errors.length > 0) {
    throw new InputError("Missing required input", "MissingInputError", errors);
  }

  const { e, n } = publicKey.e ? publicKey : { e: publicKey.d, n: publicKey.n };
  let encryptedText = "";
  for (let i = 0; i < plaintext.length; i++) {
    const charCode = plaintext.charCodeAt(i);
    if (charCode >= n) {
      throw new InputError("n is too small", "CharacterCodeError", [
        { field: "n", message: "n is too small, try increasing p or q before generating keys from public key owner" },
      ]);
    }
    const encryptedCharCode = modPow(charCode, e, n);
    encryptedText += String.fromCharCode(encryptedCharCode);
  }
  return encryptedText;
};

export const decrypt = (ciphertext, privateKey) => {
  let errors = [];

  if (!ciphertext) {
    errors.push({ field: "ciphertext", message: "Ciphertext is required" });
  }

  if (!privateKey) {
    errors.push({ field: "privateKey", message: "Private key is required" });
  }

  if (errors.length > 0) {
    throw new InputError("Missing required input", "MissingInputError", errors);
  }

  const { d, n } = privateKey.d ? privateKey : { d: privateKey.e, n: privateKey.n };
  let decryptedText = "";
  for (let i = 0; i < ciphertext.length; i++) {
    const charCode = ciphertext.charCodeAt(i);
    const decryptedCharCode = modPow(charCode, d, n);
    decryptedText += String.fromCharCode(decryptedCharCode);
  }
  return decryptedText;
};
