import VigenereExtForm from "@/components/cipher/form/vigenere-ext";


export const metadata = {
  title: "AVC | Extended Vigenere Cipher",
  description: "Extended vigenere cipher page",
};

export default function VigenerePage() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-4">
      <h1 className="text-4xl font-bold">Extended Vigenere Cipher</h1>
      <VigenereExtForm />
    </div>
  );
}
