import VigenereForm from "@/components/cipher/form/vigenere";

export const metadata = {
  title: "AVC | Vigenere Cipher",
  description: "Vigenere cipher page",
};

export default function VigenerePage() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-4">
      <h1 className="text-4xl font-bold">Vigenere Cipher</h1>
      <VigenereForm />
    </div>
  );
}
