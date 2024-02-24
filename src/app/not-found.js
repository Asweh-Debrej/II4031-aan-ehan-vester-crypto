export const metadata = {
  title: "Not Found",
  description: "Page not found",
};

export default function NotFound() {
  return (
    <div className="flex relative items-center justify-center grow h-full">
      <div className="text-center">
        <p className="sm:text-lg md:text-4xl font-bold">
          404 | Not Found
        </p>
      </div>
    </div>
  );
}
