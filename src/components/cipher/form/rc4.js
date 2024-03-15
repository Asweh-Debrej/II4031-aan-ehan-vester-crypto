"use client";

import { useContext, useEffect, useState } from "react";

import { Input } from "@nextui-org/react";

import { encrypt, decrypt } from "@/lib/cipher/rc4";
import { CipherInputContext } from "@/lib/store/cipher-input-context";
import InputError from "@/lib/error/missing-input-error";
import CipherError from "../cipher-error";
import FileForm from "../file-form";
import CipherButton from "../cipher-button";
import PlainCipherTextarea from "../plain-cipher-textarea";

export default function RC4Form() {
  const { data, setPlainText, setCipherText, setKeyHandler } =
    useContext(CipherInputContext);

  const [errors, setErrors] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentSuccess, setCurrentSuccess] = useState("");

  const handleError = (error) => {
    if (error instanceof InputError) {
      setErrors(error.errors);
      setErrorMessage(error.message);
    } else {
      console.error(error);
    }
  };

  const clearErrors = () => {
    setErrors([]);
    setErrorMessage("");
  };

  const handleEncrypt = () => {
    try {
      const ciphertext = encrypt(data.plainText, data.key);

      setCipherText(ciphertext);
      setCurrentSuccess("encrypt");
      clearErrors();
    } catch (error) {
      setCipherText("");
      handleError(error);
    }
  };

  const handleDecrypt = () => {
    try {
      const plaintext = decrypt(data.cipherText, data.key);

      setPlainText(plaintext);
      setCurrentSuccess("decrypt");
      clearErrors();
    } catch (error) {
      setPlainText("");
      handleError(error);
    }
  };

  useEffect(() => {
    let timer;

    if (currentSuccess) {
      timer = setTimeout(() => {
        setCurrentSuccess("");
      }, 2000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [currentSuccess]);

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full">
      <form className="flex flex-col gap-4 items-center justify-center w-full">
        <PlainCipherTextarea errors={errors} currentSuccess={currentSuccess} />
        <Input
          value={data.key}
          onValueChange={setKeyHandler({ onlyAlphabet: false })}
          label="Key"
          className="w-full"
          isInvalid={
            errors.find((error) => error.field === "key") !== undefined
          }
          errorMessage={errors.find((error) => error.field === "key")?.message}
        />
        <CipherButton
          onEncrypt={handleEncrypt}
          onDecrypt={handleDecrypt}
          encryptWarningTypes={["missing-plaintext", "missing-key"]}
          decryptWarningTypes={["missing-ciphertext", "missing-key"]}
        />
        <FileForm setCurrentSuccess={setCurrentSuccess} raw />
      </form>
      <CipherError errors={errors} errorMessage={errorMessage} />
    </div>
  );
}
