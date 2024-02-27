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
  
    if (!transposeKey) {
      errors.push({ field: "transposeKey", message: "Transpose key is required and must be a number" });
    }
  
    if (errors.length > 0) {
      throw new MissingInputError("Missing required input", "MissingInputError", errors);
    }
  
    plaintext = plaintext.replace(/[^A-Z]/gi, "").toUpperCase();
    key = key.toUpperCase();
  
    const textLength = plaintext.length;
    const keyLength = key.length;
    let encryptedText = "";
  
    // Function to apply the Vigenère cipher
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
  
    // Apply Vigenère cipher
    encryptedText = vigenereCipher(plaintext, key);
  
    // Function to apply the transposition cipher
    function transpositionCipher(inputString, number) {
      // Remove spaces and convert the input string to uppercase
      const cleanedInput = inputString.replace(/\s/g, '').toUpperCase();
  
      // Calculate the number of columns based on the key
      const numColumns = Math.ceil(cleanedInput.length / number);
  
      // Create an array of arrays to represent the columns
      const columns = Array.from({ length: numColumns }, () => []);
  
      // Fill the columns with characters from the input
      for (let i = 0; i < cleanedInput.length; i++) {
          const columnIndex = i % numColumns;
          columns[columnIndex].push(cleanedInput[i]);
      }
  
      // Join the characters from each column to form the encrypted string
      const encryptedString = columns.flat().join('');
  
      return encryptedString;
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
  
    if (!transposeKey) {
      errors.push({ field: "transposeKey", message: "Transpose key is required and must be a number" });
    }
  
    if (errors.length > 0) {
      throw new MissingInputError("Missing required input", "MissingInputError", errors);
    }
  
    key = key.toUpperCase();
  
    const textLength = ciphertext.length;
    const keyLength = key.length;
    let decryptedText = "";
  
    // Function to apply the Vigenère cipher decryption
    function vigenereDecipher(input, key) {
      let result = "";
      for (let i = 0; i < input.length; i++) {
        const cipherChar = input[i];
        const keyChar = key[i % keyLength];
        const cipherCharIndex = alphabet.indexOf(cipherChar);
        const keyCharIndex = alphabet.indexOf(keyChar);
        let decryptedCharIndex = (cipherCharIndex - keyCharIndex + 26) % 26; // Adding 26 to handle negative values
        result += alphabet[decryptedCharIndex];
      }
      return result;
    }
  
    // Apply transposition decryption
    function transpositionDecipher(inputString, number) {
      const numColumns = Math.ceil(inputString.length / number);
      const rows = Array.from({ length: numColumns }, () => []);
  
      let columnIndex = 0;
      for (let i = 0; i < inputString.length; i++) {
        rows[columnIndex].push(inputString[i]);
        columnIndex = (columnIndex + 1) % numColumns;
      }
  
      const transposedColumns = Array.from({ length: number }, () => []);
      for (let i = 0; i < numColumns; i++) {
        for (let j = 0; j < number; j++) {
          transposedColumns[j].push(rows[i][j]);
        }
      }
  
      const decryptedString = transposedColumns.flat().join('');
      return decryptedString;
    }
  
    // Apply transposition decryption
    decryptedText = transpositionDecipher(ciphertext, transposeKey);
  
    // Apply Vigenère cipher decryption
    decryptedText = vigenereDecipher(decryptedText, key);
  
    return decryptedText;
  };  