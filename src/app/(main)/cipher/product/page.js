import ProductForm from "@/components/cipher/form/product";

import Notes from "@/components/cipher/notes";

const notes = [
  {
    title: "What is Product Cipher?",
    content: `Product Cipher is a type of transposition cipher. It works by using a key to rearrange the characters of the plaintext/ciphertext. The key is used to create a grid. It's not necessary to create a grid with the key, but it's easier to visualize the process. The characters of the plaintext/ciphertext are then written in the grid row by row. The characters are then read column by column to create the ciphertext/plaintext.`,
  },
  {
    title: "How to use",
    content: `To use the Product Cipher, you need to provide a plaintext or ciphertext and a key. The key must be a string of characters. The key will be used to encrypt/decrypt the plaintext/ciphertext.`,
  },
  {
    title: "How it works",
    content: `The Product Cipher works by using the key to create a grid. The characters of the plaintext/ciphertext are then written in the grid row by row. The characters are then read column by column to create the ciphertext/plaintext.`,
  },
];

export const metadata = {
  title: "AVC | Product Cipher",
  description: "Product cipher page",
};

export default function ProductPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-4 max-w-5xl w-full">
      <h1 className="text-4xl font-bold">Product Cipher</h1>
      <ProductForm />
      <Notes notes={notes} />
    </div>
  );
}
