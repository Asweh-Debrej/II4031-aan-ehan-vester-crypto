export default function CipherError({ errors, errorMessage }) {
  if (errors.length > 0) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center w-full">
        <p className="text-red-500 text-lg font-bold">{errorMessage}</p>
        <ul className="list-disc list-inside">
          {errors.map((error, index) => (
            <li key={index}>{error.message}</li>
          ))}
        </ul>
      </div>
    );
  }
}
