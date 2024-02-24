"use client";

import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";

import { CipherInputProvider } from "@/lib/store/cipher-input-context";

export function Providers({ className, children }) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push} className={className}>
      <CipherInputProvider>
        {children}
      </CipherInputProvider>
    </NextUIProvider>
  );
}
