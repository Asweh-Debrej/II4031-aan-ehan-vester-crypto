import AffineForm from "@/components/cipher/form/affine";

export const metadata = {
  title: "AVC | Affine Cipher",
  description: "Affine cipher page",
};

export default function AffinePage() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-4 max-w-5xl w-full">
      <h1 className="text-4xl font-bold">Affine Cipher</h1>
      <AffineForm />
    </div>
  );
}
