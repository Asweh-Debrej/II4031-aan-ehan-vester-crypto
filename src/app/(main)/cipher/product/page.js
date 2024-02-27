import ProductForm from "@/components/cipher/form/product";

export const metadata = {
  title: "AVC | Product Cipher",
  description: "Product cipher page",
};

export default function ProductPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-4">
      <h1 className="text-4xl font-bold">Vigenere Cipher</h1>
      <ProductForm />
    </div>
  );
}