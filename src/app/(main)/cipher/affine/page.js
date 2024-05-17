import AffineForm from "./affine";

import Notes from "../notes";

const notes = [
  {
    title: "What is Affine Cipher?",
    content: `Affine Cipher is a type of substitution cipher. It works by using a pair of keys to encrypt/decrypt the plaintext/ciphertext. The first key is the multiplier, and the second key is the shift. The plaintext/ciphertext is then encrypted/decrypted using the formula (ax + b) mod m, where a is the multiplier, b is the shift, x is the character position in the alphabet, and m is the size of the alphabet.`,
  },
  {
    title: "How to use",
    content: `To use the Affine Cipher, you need to provide a plaintext or ciphertext and a pair of keys. The keys must be a pair of integers. The first key will be used as the multiplier, and the second key will be used as the shift to encrypt/decrypt the plaintext/ciphertext.`,
  },
  {
    title: "How it works",
    content: `The Affine Cipher works by using a pair of keys to encrypt/decrypt the plaintext/ciphertext. The first key is the multiplier, and the second key is the shift. The plaintext/ciphertext is then encrypted/decrypted using the formula (ax + b) mod m, where a is the multiplier, b is the shift, x is the character position in the alphabet, and m is the size of the alphabet.`,
  },
];

export const metadata = {
  title: "AVC | Affine Cipher",
  description: "Affine cipher page",
};

export default function AffinePage() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-4 max-w-5xl w-full">
      <h1 className="text-4xl font-bold">Affine Cipher</h1>
      <AffineForm />
      <Notes notes={notes} />
    </div>
  );
}
