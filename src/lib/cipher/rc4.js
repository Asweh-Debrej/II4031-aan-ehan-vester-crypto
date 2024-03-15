import InputError from "../error/missing-input-error";
import { mod } from "../utils/cipher";

const removeInvalidChars = false;

// Function to generate key stream based on modified RC4
export const generateKeyStream = (key, length) => {
    let S = [];
    let j = 0;

    // Initialize S array based on key
    for (let i = 0; i < 256; i++) {
        S[i] = i;
    }

    // Initial permutation of S based on key
    for (let i = 0; i < 256; i++) {
        j = (j + S[i] + key[i % key.length].charCodeAt(0)) % 256;
        // Swap S[i] and S[j]
        let temp = S[i];
        S[i] = S[j];
        S[j] = temp;
    }

    // Generate key stream
    let keyStream = [];
    let i = 0;
    j = 0;

    for (let k = 0; k < length; k++) {
        i = (i + 1) % 256;
        j = (j + S[i]) % 256;
        // Swap S[i] and S[j]
        let temp = S[i];
        S[i] = S[j];
        S[j] = temp;
        // Calculate key stream byte
        let t = (S[i] + S[j]) % 256;
        keyStream.push(S[t]);
    }

    return keyStream;
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
        throw new InputError(
            "Missing required input",
            "MissingInputError",
            errors
        );
    }

    key = key.trim();

    const keyStream = generateKeyStream(key, plaintext.length); // Generate key stream
    let encryptedText = "";

    for (let i = 0; i < plaintext.length; i++) {
        const plaintextChar = plaintext[i];
        const keyByte = keyStream[i];
        const encryptedCharCode = (plaintextChar.charCodeAt(0) + keyByte) % 256; // XOR operation
        encryptedText += String.fromCharCode(encryptedCharCode);
    }

    return encryptedText;
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

    const keyStream = generateKeyStream(key, ciphertext.length); // Generate key stream
    let decryptedText = "";

    for (let i = 0; i < ciphertext.length; i++) {
        const ciphertextChar = ciphertext[i];
        const keyByte = keyStream[i];
        const decryptedCharCode = mod((ciphertextChar.charCodeAt(0) - keyByte), 256); // XOR operation
        decryptedText += String.fromCharCode(decryptedCharCode);
    }

    return decryptedText;
};