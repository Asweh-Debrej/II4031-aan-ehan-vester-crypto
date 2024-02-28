import VigenereExtForm from "@/components/cipher/form/vigenere-ext";

import Notes from "@/components/cipher/notes";

const notes = [
  {
    title: "What is Extended Vigenere Cipher?",
    content: `Extended Vigenere Cipher is a variant of the Vigenere Cipher. The difference is that the characters used in the key are not limited to the 26 characters of the English alphabet. The key can be any string of characters in the ASCII table. The key is repeated as many times as necessary to match the length of the plaintext/ciphertext.`,
  },
  {
    title: "How to use",
    content: `To use the Extended Vigenere Cipher, you need to provide a plaintext or ciphertext and a key. The key must be a string of characters. The key will be used to encrypt/decrypt the plaintext/ciphertext.`,
  },
  {
    title: "How it works",
    content: `The Extended Vigenere Cipher works by using the key to encrypt/decrypt the plaintext/ciphertext. The key is repeated as many times as necessary to match the length of the plaintext/ciphertext. Then, each character of the plaintext/ciphertext is encrypted/decrypted using the corresponding character of the key.`,
  },
];

export const metadata = {
  title: "AVC | Extended Vigenere Cipher",
  description: "Extended vigenere cipher page",
};

export default function VigenerePage() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-4 max-w-5xl w-full">
      <h1 className="text-4xl font-bold">Extended Vigenere Cipher</h1>
      <VigenereExtForm />
      <Notes notes={notes} />
    </div>
  );
}
