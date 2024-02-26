"use client";

import { useContext, useEffect, useState } from "react";

import { Textarea, Input, Button } from "@nextui-org/react";

import { encrypt, decrypt } from "@/lib/cipher/vigenere-ext";
import { CipherInputContext } from "@/lib/store/cipher-input-context";
import MissingInputError from "@/lib/error/missing-input-error";
import CipherError from "../cipher-error";

export default function VigenereExtForm() {
  const { data, setPlainText, setCipherText, setKey } =
    useContext(CipherInputContext);

  const [errors, setErrors] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentSuccess, setCurrentSuccess] = useState("");

  const handleError = (error) => {
    if (error instanceof MissingInputError) {
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
      <form className="flex flex-col gap-4 items-center justify-center">
        <div className="flex flex-row gap-4 items-center justify-center w-full">
          <Textarea
            label="Plaintext"
            className="w-full"
            value={data.plainText}
            onValueChange={setPlainText}
            isInvalid={
              errors.find((error) => error.field === "plaintext") !== undefined
            }
            errorMessage={
              errors.find((error) => error.field === "plaintext")?.message
            }
            color={currentSuccess === "decrypt" ? "success" : "default"}
          />
          <Textarea
            label="Ciphertext"
            className="w-full"
            value={data.cipherText}
            onValueChange={setCipherText}
            isInvalid={
              errors.find((error) => error.field === "ciphertext") !== undefined
            }
            errorMessage={
              errors.find((error) => error.field === "ciphertext")?.message
            }
            color={currentSuccess === "encrypt" ? "success" : "default"}
          />
        </div>
        <Input
          value={data.key}
          onValueChange={setKey}
          label="Key"
          className="w-full"
          isInvalid={
            errors.find((error) => error.field === "key") !== undefined
          }
          errorMessage={errors.find((error) => error.field === "key")?.message}
        />
        <div className="flex flex-row gap-4 items-center justify-center w-full">
          <Button auto onClick={handleEncrypt} className="w-full rounded-md">
            Encrypt ==&gt;
          </Button>
          <Button auto onClick={handleDecrypt} className="w-full rounded-md">
            &lt;== Decrypt
          </Button>
        </div>
      </form>
      <CipherError errors={errors} errorMessage={errorMessage} />
    </div>
  );
}
