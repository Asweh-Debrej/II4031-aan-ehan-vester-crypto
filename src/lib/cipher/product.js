import MissingInputError from "../error/missing-input-error";
import { alphabet, mod } from "../utils/cipher";

export const encrypt = (plaintext, key, transposeKey) => {
  // Define the alphabet for the Vigenère cipher
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let errors = [];

  if (!plaintext) {
    errors.push({ field: "plaintext", message: "Plaintext is required" });
  }

  if (!key) {
    errors.push({ field: "key", message: "Key is required" });
  }

  if (!transposeKey || isNaN(transposeKey)) {
    errors.push({
      field: "transposeKey",
      message: "Transpose key is required and must be a number",
    });
  }

  if (errors.length > 0) {
    throw new MissingInputError(
      "Missing required input",
      "MissingInputError",
      errors
    );
  }

  plaintext = plaintext.replace(/[^A-Z]/gi, "").toUpperCase();
  key = key.toUpperCase();

  const keyLength = key.length;
  let encryptedText = plaintext;

  //   // Function to apply the Vigenère cipher
  function vigenereCipher(input, key) {
    let result = "";
    for (let i = 0; i < input.length; i++) {
      const textChar = input[i];
      const keyChar = key[i % keyLength];
      const textCharIndex = alphabet.indexOf(textChar);
      const keyCharIndex = alphabet.indexOf(keyChar);
      let encryptedCharIndex = (textCharIndex + keyCharIndex) % 26;
      result += alphabet[encryptedCharIndex];
    }
    return result;
  }

  //   // Apply Vigenère cipher
  encryptedText = vigenereCipher(plaintext, key);

  function addPadding(plaintext, key) {
    let paddedLength = key - (plaintext.length % key);
    plaintext += "X".repeat(paddedLength);
    return plaintext;
  }

  function transpositionCipher(plaintext, key) {
    plaintext = addPadding(plaintext, key);
    let numRows = Math.ceil(plaintext.length / key);
    let transposedText = "";

    // Split plaintext into rows
    let rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(plaintext.substr(i * key, key));
    }

    // Take characters from top to bottom
    for (let col = 0; col < key; col++) {
      for (let row = 0; row < numRows; row++) {
        if (col < rows[row].length) {
          transposedText += rows[row][col];
        }
      }
    }

    return transposedText;
  }

  // Apply transposition cipher
  encryptedText = transpositionCipher(encryptedText, transposeKey);

  return encryptedText;
};

export const decrypt = (ciphertext, key, transposeKey) => {
  // Define the alphabet for the Vigenère cipher
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let errors = [];

  if (!ciphertext) {
    errors.push({ field: "ciphertext", message: "Ciphertext is required" });
  }

  if (!key) {
    errors.push({ field: "key", message: "Key is required" });
  }

  if (!transposeKey || isNaN(transposeKey)) {
    errors.push({
      field: "transposeKey",
      message: "Transpose key is required and must be a number",
    });
  }

  if (errors.length > 0) {
    throw new MissingInputError(
      "Missing required input",
      "MissingInputError",
      errors
    );
  }

  key = key.toUpperCase();

  const keyLength = key.length;
  let decryptedText = "";

  // Function to apply the Vigenère cipher decryption
  //   function vigenereDecipher(input, key) {
  //     let result = "";
  //     for (let i = 0; i < input.length; i++) {
  //       const cipherChar = input[i];
  //       const keyChar = key[i % keyLength];
  //       const cipherCharIndex = alphabet.indexOf(cipherChar);
  //       const keyCharIndex = alphabet.indexOf(keyChar);
  //       let decryptedCharIndex = (cipherCharIndex - keyCharIndex + 26) % 26; // Adding 26 to handle negative values
  //       result += alphabet[decryptedCharIndex];
  //     }
  //     return result;
  //   }

  function transpositionDecipher(ciphertext, key) {
    let numRows = Math.ceil(ciphertext.length / key);
    let decryptedText = "";

    // Split ciphertext into rows
    let rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(ciphertext.substr(i * key, key));
    }

    // Take characters from left to right
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < key; col++) {
        if (row < rows[col].length) {
          decryptedText += rows[col][row];
        }
      }
    }

    return decryptedText;
  }

  decryptedText = transpositionDecipher(ciphertext, transposeKey);

  return decryptedText;
};
