"use client";

import { useContext } from "react";

import { Textarea } from "@nextui-org/react";

import { CipherInputContext } from "@/lib/store/cipher-input-context";

export default function PlainCipherTextarea({
  errors = [],
  currentSuccess = "",
}) {
  const { data, setPlainText, setCipherText, setPlainTextBase64, setCipherTextBase64 } = useContext(CipherInputContext);

  return (
    <div className="flex flex-row gap-4 items-center justify-center w-full">
      <Textarea
        label="Plaintext UTF-8"
        className="w-full"
        value={data.plainText}
        onValueChange={setPlainText}
        isInvalid={
          errors.find((error) => error.field === "plaintext") !== undefined
        }
        errorMessage={
          errors.find((error) => error.field === "plaintext")?.message
        }
        color={
          currentSuccess === "decrypt" || currentSuccess === "plainFile"
            ? "success"
            : "default"
        }
      />
      <Textarea
        label="Plaintext base64"
        className="w-full"
        value={data.plainTextBase64}
        onValueChange={setPlainTextBase64}
        isInvalid={false}
        errorMessage={""}
        color={currentSuccess === "decrypt" ? "success" : "default"}
      />
      <Textarea
        label="Ciphertext UTF-8"
        className="w-full"
        value={data.cipherText}
        onValueChange={setCipherText}
        isInvalid={
          errors.find((error) => error.field === "ciphertext") !== undefined
        }
        errorMessage={
          errors.find((error) => error.field === "ciphertext")?.message
        }
        color={
          currentSuccess === "encrypt" || currentSuccess === "cipherFile"
            ? "success"
            : "default"
        }
      />
      <Textarea
        label="Ciphertext base64"
        className="w-full"
        value={data.cipherTextBase64}
        onValueChange={setCipherTextBase64}
        isInvalid={false}
        errorMessage={""}
        color={currentSuccess === "encrypt" ? "success" : "default"}
      />
    </div>
  );
}
