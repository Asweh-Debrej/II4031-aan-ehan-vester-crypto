// extended vigenere cipher up to 256 characters
export const encrypt = (text, key) => {


  const textLength = text.length;
  const keyLength = key.length;
  let encryptedText = "";

  for (let i = 0; i < textLength; i++) {
    const textChar = text[i];
    const keyChar = key[i % keyLength];
    let encryptedCharIndex = (textChar.charCodeAt(0) + keyChar.charCodeAt(0)) % 256;
    encryptedText += String.fromCharCode(encryptedCharIndex);
  }

  return encryptedText;
}
