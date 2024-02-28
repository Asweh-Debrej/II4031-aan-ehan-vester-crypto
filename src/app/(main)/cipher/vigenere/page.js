import VigenereForm from "@/components/cipher/form/vigenere";

import Notes from "@/components/cipher/notes";

const notes = [
  {
    title: "What is Vigenere Cipher?",
    content: `Vigenere Cipher is a method of encrypting alphabetic text by using a simple form of polyalphabetic substitution. A polyalphabetic cipher uses multiple substitution alphabets to encrypt the plaintext. The Vigenere Cipher uses a keyword to create the substitution alphabets.`,
  },
  {
    title: "How to use",
    content: `To use the Vigenere Cipher, you need to provide a plaintext or ciphertext and a key. The key must be a string of characters. The key will be used to encrypt/decrypt the plaintext/ciphertext.`,
  },
  {
    title: "How it works",
    content: `The Vigenere Cipher works by using the key to encrypt/decrypt the plaintext/ciphertext. The key is repeated as many times as necessary to match the length of the plaintext/ciphertext. Then, each character of the plaintext/ciphertext is encrypted/decrypted using the corresponding character of the key.`,
  },
];

export const metadata = {
  title: "AVC | Vigenere Cipher",
  description: "Vigenere cipher page",
};

export default function VigenerePage() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-4 max-w-5xl w-full">
      <h1 className="text-4xl font-bold">Vigenere Cipher</h1>
      <VigenereForm />
    </div>
  );
}
