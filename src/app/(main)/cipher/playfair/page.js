import PlayfairForm from "@/components/cipher/form/playfair";

import Notes from "@/components/cipher/notes";

const notes1 = [
  {
    title: "What is Playfair Cipher?",
    content: `Playfair Cipher is a type of substitution cipher. It works by using a key to create a 5x5 grid. The key is used to fill the grid with the characters of the plaintext. The characters of the plaintext are then encrypted by using the characters of the grid. The characters are encrypted by using the following rules:`,
  },
];

const rules = [
  "If the characters are the same, they are replaced by the character 'X'.",
  "If the characters are in the same row, they are replaced by the characters to their right. If the characters are at the rightmost of the row, they are replaced by the characters at the leftmost of the row.",
  "If the characters are in the same column, they are replaced by the characters below them. If the characters are at the bottom of the column, they are replaced by the characters at the top of the column.",
  "If the characters form a rectangle, they are replaced by the characters in the opposite corners of the rectangle.",
]

const notes2 = [
  {
    title: "How to use",
    content: `To use the Playfair Cipher, you need to provide a plaintext or ciphertext and a key. The key must be a string of characters. The key will be used to encrypt/decrypt the plaintext/ciphertext.`,
  },
  {
    title: "How it works",
    content: `The Playfair Cipher works by using the key to create a 5x5 grid. The characters of the plaintext are then encrypted by using the characters of the grid. The characters are encrypted by using the following rules:`,
  },
  {title: "Notes",
  content: `If the characters are "X", they are appended by the character "Q". In this case, "XX" would be "XQXQ" when decrypted back to "XX".`}
];



export const metadata = {
  title: "AVC | Playfair Cipher",
  description: "Playfair cipher page",
};

export default function VigenerePage() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-4 max-w-5xl w-full">
      <h1 className="text-4xl font-bold">Playfair Cipher</h1>
      <PlayfairForm />
      <Notes notes={notes1} />
      <ul className="list-disc list-inside text-sm">
        {rules.map((rule, index) => (
          <li key={index}>{rule}</li>
        ))}
      </ul>
      <Notes notes={notes2} />

    </div>
  );
}
