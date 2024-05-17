"use client";

import { useContext, useEffect, useState } from "react";

import { Input } from "@nextui-org/react";

import { encrypt, decrypt } from "@/lib/cipher/product";
import { CipherInputContext } from "@/lib/store/cipher-input-context";
import InputError from "@/lib/error/input-error";
import CipherError from "../cipher-error";
import { explode } from "@/lib/utils/cipher";
import PlainCipherTextarea from "../plain-cipher-textarea";
import CipherButton from "../cipher-button";
import FileForm from "../file-form";

const explodeResult = true;

export default function ProductForm() {
  const { data, setPlainText, setCipherText, setKeyHandler, setTransposeKey } =
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
      let ciphertext = encrypt(data.plainText, data.key, data.transposeKey);

      if (explodeResult) {
        ciphertext = explode(ciphertext);
      }

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
      let plaintext = decrypt(data.cipherText, data.key, data.transposeKey);

      if (explodeResult) {
        plaintext = explode(plaintext);
      }

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
      <form className="flex flex-col gap-4 items-center justify-center w-full" acceptCharset="utf-8">
        <PlainCipherTextarea errors={errors} currentSuccess={currentSuccess} />
        <Input
          value={data.key}
          onValueChange={setKeyHandler()}
          label="Key"
          className="w-full"
          isInvalid={
            errors.find((error) => error.field === "key") !== undefined
          }
          errorMessage={errors.find((error) => error.field === "key")?.message}
        />
        <Input
          value={data.transposeKey}
          onValueChange={setTransposeKey}
          label="Transpose Key"
          className="w-full"
          type="number"
          isInvalid={
            errors.find((error) => error.field === "transposeKey") !== undefined
          }
          errorMessage={
            errors.find((error) => error.field === "transposeKey")?.message
          }
        />
        <CipherButton
          onEncrypt={handleEncrypt}
          onDecrypt={handleDecrypt}
          encryptWarningTypes={[
            "missing-plaintext",
            "missing-key",
            "missing-transpose-key",
          ]}
          decryptWarningTypes={[
            "missing-ciphertext",
            "missing-key",
            "missing-transpose-key",
          ]}
          additionalRequiredFields={["key", "transposeKey"]}
        />
        <FileForm setCurrentSuccess={setCurrentSuccess} />
      </form>
      <CipherError errors={errors} errorMessage={errorMessage} />
    </div>
  );
}
