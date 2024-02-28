import VigenereAutoKeyForm from "@/components/cipher/form/vigenere-auto-key";

import Notes from "@/components/cipher/notes";

const notes = [
  {
    title: "What is Vigenere Auto-Key Cipher?",
    content: `Vigenere Auto-Key Cipher is a variant of the Vigenere Cipher. The difference is that the key is not repeated to match the length of the plaintext/ciphertext. Instead, the key is appended to the plaintext to match its length. The key is used to encrypt/decrypt the plaintext/ciphertext.`,
  },
  {
    title: "How to use",
    content: `To use the Vigenere Auto-Key Cipher, you need to provide a plaintext or ciphertext and a key. The key must be a string of characters. The key will be used to encrypt/decrypt the plaintext/ciphertext.`,
  },
  {
    title: "How it works",
    content: `The Vigenere Auto-Key Cipher works by using the key to encrypt/decrypt the plaintext/ciphertext. The key is appended to the plaintext to match its length. Then, each character of the plaintext/ciphertext is encrypted/decrypted using the corresponding character of the key.`,
  },
];

export const metadata = {
  title: "AVC | Vigenere Auto-Key Cipher",
  description: "Vigenere auto-key cipher page",
};

export default function VigenereAutoKeyPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-4 max-w-5xl w-full">
      <h1 className="text-4xl font-bold">Vigenere Auto-Key Cipher</h1>
      <VigenereAutoKeyForm />
      <Notes notes={notes} />
    </div>
  );
}
