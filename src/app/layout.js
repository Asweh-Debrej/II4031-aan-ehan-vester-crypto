import { Inter } from "next/font/google";
import "./globals.css";

import { Providers } from "./providers";
import NavbarComponent from "./navbar";
import { Suspense } from "react";
import { Skeleton } from "@nextui-org/react";

import ProgressBar from "./progress-bar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "VAR-C | Vester Aan Rehan - Cipher",
  description: "Vester Aan Rehan - Sign is a simple web app to encrypt and decrypt text using various ciphers. It is built using Next.js and Tailwind CSS.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark size-full">
      <body className={`size-full bg-[rgb(36,36,36)] ${inter.className}`}>
        <Suspense fallback={<Skeleton height="2px" />}>
          <ProgressBar />
        </Suspense>
        <Providers className={"flex flex-col size-full overflow-y-auto"}>
          <NavbarComponent />
          {children}
        </Providers>
      </body>
    </html>
  );
}
