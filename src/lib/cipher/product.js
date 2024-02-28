import InputError from "../error/missing-input-error";
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
    throw new InputError(
      "Missing required input",
      "MissingInputError",
      errors
    );
  }

  plaintext = plaintext.replace(/[^A-Z]/gi, "").toUpperCase();
  key = key.trim().replace(/[^A-Z]/gi, "").toUpperCase();

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
    throw new InputError(
      "Missing required input",
      "MissingInputError",
      errors
    );
  }

  key = key.trim().replace(/[^A-Z]/gi, "").toUpperCase();

  const keyLength = key.length;

  function removeSpaces(inputString) {
    return inputString.replace(/\s/g, "");
  }

  let decryptedText = removeSpaces(ciphertext);

  function reverseVigenereCipher(input, key) {
    let result = "";
    for (let i = 0; i < input.length; i++) {
      const textChar = input[i];
      const keyChar = key[i % keyLength];
      const textCharIndex = alphabet.indexOf(textChar);
      const keyCharIndex = alphabet.indexOf(keyChar);
      let decryptedCharIndex = (textCharIndex - keyCharIndex + 26) % 26; // Adding 26 to ensure positive modulo
      result += alphabet[decryptedCharIndex];
    }
    return result;
  }

  // Reverse transposition cipher
  function reverseTranspositionCipher(ciphertext, key) {
    let numRows = Math.ceil(ciphertext.length / key);
    let transposedText = "";

    let cols = [];
    let rowLengths = [];

    // Determine row lengths
    let remainingChars = ciphertext.length;
    for (let i = 0; i < key; i++) {
      const colLength = Math.ceil(remainingChars / (key - i));
      rowLengths.push(colLength);
      remainingChars -= colLength;
    }

    // Populate cols array
    let currentIndex = 0;
    for (let i = 0; i < key; i++) {
      cols.push(ciphertext.substr(currentIndex, rowLengths[i]));
      currentIndex += rowLengths[i];
    }

    // Reconstruct transposed text
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < key; col++) {
        if (row < rowLengths[col]) {
          transposedText += cols[col][row];
        }
      }
    }

    return transposedText;
  }

  // Reverse transposition cipher
  decryptedText = reverseTranspositionCipher(decryptedText, transposeKey);

  // Remove any trailing 'X' characters added during encryption padding
  decryptedText = decryptedText.replace(/X+$/g, "");

  // Reverse Vigenère cipher
  decryptedText = reverseVigenereCipher(decryptedText, key);

  return decryptedText;
};
