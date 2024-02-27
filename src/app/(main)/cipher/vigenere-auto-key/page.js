import VigenereAutoKeyForm from "@/components/cipher/form/vigenere-auto-key";

export const metadata = {
  title: "AVC | Vigenere Auto-Key Cipher",
  description: "Vigenere auto-key cipher page",
};

export default function VigenereAutoKeyPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-4 max-w-5xl w-full">
      <h1 className="text-4xl font-bold">Vigenere Auto-Key Cipher</h1>
      <VigenereAutoKeyForm />
    </div>
  );
}
