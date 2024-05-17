import RC4Form from "@/app/(main)/cipher/rc4/rc4";

import Notes from "../notes";

const notes = [
  {
    title: "What is Modified RC4?",
    content: `The Modified RC4 Cipher is an adaptation of the well-known RC4 stream cipher. Stream ciphers operate on individual bits or bytes, generating a keystream that is then XORed with the plaintext to produce the ciphertext. This modified RC4 is combined with the Extended Vigenere Cipher principle`,
  },
  {
    title: "How to use",
    content: `To use the Modified RC4 Cipher, you need to provide a plaintext or ciphertext and a key. The key must be a string of characters. The key will be used to encrypt/decrypt the plaintext/ciphertext.`,
  },
  {
    title: "How it works",
    content: `The Modified RC4 Cipher works by using the key to create a streamkey to encrypt/decrypt the plaintext/ciphertext. Each byte of the streamkey is XORed with the palintext/ciphertext to produce the other.`,
  },
];

export const metadata = {
  title: "AVC | Modified RC4",
  description: "Modified RC4 page",
};

export default function RC4Page() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-4 max-w-5xl w-full">
      <h1 className="text-4xl font-bold">Modified RC4</h1>
      <RC4Form />
      <Notes notes={notes} />
    </div>
  );
}
