import PlayfairForm from "@/components/cipher/form/playfair";

export const metadata = {
  title: "AVC | Playfair Cipher",
  description: "Playfair cipher page",
};

export default function VigenerePage() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-4 max-w-5xl w-full">
      <h1 className="text-4xl font-bold">Playfair Cipher</h1>
      <PlayfairForm />
    </div>
  );
}
