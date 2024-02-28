"use client";

import { useContext, useEffect, useState } from "react";

import { Textarea, Input, Button } from "@nextui-org/react";

import { encrypt, decrypt } from "@/lib/cipher/vigenere";
import { CipherInputContext } from "@/lib/store/cipher-input-context";
import MissingInputError from "@/lib/error/missing-input-error";
import CipherError from "../cipher-error";
import { explode } from "@/lib/utils/cipher";
import ErrorTooltip from "@/components/cipher/error-tooltip";

const explodeResult = true;

export default function VigenereForm() {
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
      let ciphertext = encrypt(data.plainText, data.key);

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
      let plaintext = decrypt(data.cipherText, data.key);

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
      <form className="flex flex-col gap-4 items-center justify-center w-full">
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
            color={currentSuccess === "encrypt" ? "success" : "default"}
          />
          <Textarea
            label="Ciphertext base64"
            className="w-full"
            value={btoa(data.cipherText)}
            onValueChange={() => {}}
            isInvalid={false}
            errorMessage={""}
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
          <ErrorTooltip warningTypes={["missing-plaintext", "missing-key"]} className="w-full">
            <Button
              auto
              onClick={handleEncrypt}
              className="w-full rounded-md bg-amber-600"
              isDisabled={data.plainText === "" || data.key === ""}>
              Encrypt ==&gt;
            </Button>
          </ErrorTooltip>
          <ErrorTooltip warningTypes={["missing-ciphertext", "missing-key"]} className="w-full">
            <Button
              auto
              onClick={handleDecrypt}
              className="w-full rounded-md bg-amber-600 disabled:pointer-events-none"
              isDisabled={data.cipherText === "" || data.key === ""}>
              &lt;== Decrypt
            </Button>
          </ErrorTooltip>
        </div>
      </form>
      <CipherError errors={errors} errorMessage={errorMessage} />
    </div>
  );
}
