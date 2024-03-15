import RC4Form from "@/components/cipher/form/rc4";

import Notes from "@/components/cipher/notes";

const notes = [
  {
    title: "What is Modified RC4?",
    content: `EMPTY`,
  },
  {
    title: "How to use",
    content: `EMPTY`,
  },
  {
    title: "How it works",
    content: `EMPTY`,
  },
];

export const metadata = {
  title: "AVC | Modified RC4",
  description: "Modified RC4 page",
};

export default function RC4Page() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-4 max-w-5xl w-full">
      <h1 className="text-4xl font-bold">Modified RC4</h1>
      <RC4Form />
      <Notes notes={notes} />
    </div>
  );
}
