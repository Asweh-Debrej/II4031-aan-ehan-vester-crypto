import RSAForm from "@/components/cipher/form/rsa-test";

import Notes from "@/components/cipher/notes";

const notes = [
  {
    title: "What is RSA?",
    content:
      "RSA is a public-key cryptosystem that is widely used for secure data transmission. It is also one of the oldest and best-known public-key cryptosystems. The acronym RSA is derived from the surnames of Ron Rivest, Adi Shamir, and Leonard Adleman, who first publicly described the algorithm in 1977.",
  },
  {
    title: "How to use",
    content:
      "To use RSA, you need to generate a public and private key pair. The public key is used to encrypt data, while the private key is used to decrypt it. You can then use the public key to encrypt data and send it to someone else, who can then use their private key to decrypt it.",
  },
  {
    title: "How it works",
    content:
      "RSA works by using two large prime numbers to generate the public and private keys. The public key consists of the product of the two prime numbers, while the private key consists of the two prime numbers themselves. The security of RSA is based on the difficulty of factoring the product of two large prime numbers.",
  },
];

export const metadata = {
  title: "AVC | RSA",
  description: "RSA page",
};

export default function RSAPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-4 max-w-5xl w-full">
      <h1 className="text-4xl font-bold">RSA</h1>
      <RSAForm />
      <Notes notes={notes} />
    </div>
  );
}
