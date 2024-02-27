export default function Layout({ children }) {
  return (
    <main
      className="flex h-fit flex-col items-center justify-between px-2"
    >
      {children}
    </main>
  );
}

