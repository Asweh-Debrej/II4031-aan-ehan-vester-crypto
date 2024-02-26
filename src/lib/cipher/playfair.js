import MissingInputError from "../error/missing-input-error";
import { alphabet } from "../utils/cipher";

const removedChar = "J";

export const generateKeySquare = (key) => {
  const removeRegex = new RegExp(removedChar, "g");
  const keySquare = (key || "").toUpperCase().replace(/[^A-Z]/g, "").replace(removeRegex, "I");
  const alphabetSet = new Set(alphabet);
  alphabetSet.delete(removedChar);

  const keySet = new Set(keySquare);
  const remainingAlphabet = [...alphabetSet].filter((char) => !keySet.has(char));

  const keySquareArray = [...keySet, ...remainingAlphabet]

  return keySquareArray;
}

const findChar = (char, keySquare) => {
  let index = keySquare.indexOf(char);
  let row = Math.floor(index / 5);
  let col = index % 5;

  return { row, col };
}

export const encrypt = (plaintext, key) => {
  let errors = [];

  if (!plaintext) {
    errors.push({ field: "plaintext", message: "Plaintext is required" });
  }

  if (errors.length > 0) {
    throw new MissingInputError("Missing required input", "MissingInputError", errors);
  }

  const keySquare = generateKeySquare(key);
  let newPlaintext = "";
  plaintext = plaintext.replace(/[^A-Z]/gi, "").toUpperCase();
  const textLength = plaintext.length;

  for (let i = 0; i < textLength; i += 2) {
    let firstChar = plaintext[i].toUpperCase();
    let secondChar = plaintext[i + 1]?.toUpperCase() || "X";

    if (firstChar === secondChar) {
      newPlaintext += firstChar + "X";
      i--;
    } else {
      newPlaintext += firstChar + secondChar;
    }
  }

  if (newPlaintext.length % 2 !== 0) {
    newPlaintext += "X";
  }

  let encryptedText = "";
  const newTextLength = newPlaintext.length;

  for (let i = 0; i < newTextLength; i += 2) {
    let firstChar = newPlaintext[i].toUpperCase();
    let secondChar = newPlaintext[i + 1].toUpperCase();
    let firstCharIndex = findChar(firstChar, keySquare);
    let secondCharIndex = findChar(secondChar, keySquare);

    if (firstCharIndex.row === secondCharIndex.row) {
      encryptedText += keySquare[firstCharIndex.row * 5 + (firstCharIndex.col + 1) % 5];
      encryptedText += keySquare[secondCharIndex.row * 5 + (secondCharIndex.col + 1) % 5];
    } else if (firstCharIndex.col === secondCharIndex.col) {
      encryptedText += keySquare[((firstCharIndex.row + 1) % 5) * 5 + firstCharIndex.col];
      encryptedText += keySquare[((secondCharIndex.row + 1) % 5) * 5 + secondCharIndex.col];
    } else {
      encryptedText += keySquare[firstCharIndex.row * 5 + secondCharIndex.col];
      encryptedText += keySquare[secondCharIndex.row * 5 + firstCharIndex.col];
    }
  }

  return encryptedText;
};

export const decrypt = (ciphertext, key) => {
  let errors = [];

  if (!ciphertext) {
    errors.push({ field: "ciphertext", message: "Ciphertext is required" });
  }

  if (errors.length > 0) {
    throw new MissingInputError("Missing required input", "MissingInputError", errors);
  }

  const keySquare = generateKeySquare(key);
  let decryptedText = "";
  ciphertext = ciphertext.replace(/[^A-Z]/gi, "").toUpperCase();
  const textLength = ciphertext.length;

  for (let i = 0; i < textLength; i += 2) {
    let firstChar = ciphertext[i].toUpperCase();
    let secondChar = ciphertext[i + 1].toUpperCase();
    let firstCharIndex = findChar(firstChar, keySquare);
    let secondCharIndex = findChar(secondChar, keySquare);

    if (firstCharIndex.row === secondCharIndex.row) {
      decryptedText += keySquare[firstCharIndex.row * 5 + (firstCharIndex.col + 4) % 5];
      decryptedText += keySquare[secondCharIndex.row * 5 + (secondCharIndex.col + 4) % 5];
    } else if (firstCharIndex.col === secondCharIndex.col) {
      decryptedText += keySquare[((firstCharIndex.row + 4) % 5) * 5 + firstCharIndex.col];
      decryptedText += keySquare[((secondCharIndex.row + 4) % 5) * 5 + secondCharIndex.col];
    } else {
      decryptedText += keySquare[firstCharIndex.row * 5 + secondCharIndex.col];
      decryptedText += keySquare[secondCharIndex.row * 5 + firstCharIndex.col];
    }
  }

  return decryptedText;
};
