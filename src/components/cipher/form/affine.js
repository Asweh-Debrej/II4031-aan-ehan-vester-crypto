"use client";

import { useContext, useEffect, useState } from "react";

import { Input } from "@nextui-org/react";

import { encrypt, decrypt } from "@/lib/cipher/affine";
import { CipherInputContext } from "@/lib/store/cipher-input-context";
import InputError from "@/lib/error/missing-input-error";
import CipherError from "../cipher-error";
import { explode } from "@/lib/utils/cipher";
import PlainCipherTextarea from "../plain-cipher-textarea";
import CipherButton from "../cipher-button";
import FileForm from "../file-form";

const explodeResult = true;

export default function AffineForm() {
  const { data, setPlainText, setCipherText, setMultiplier, setShift } =
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
      let ciphertext = encrypt(data.plainText, data.multiplier, data.shift);

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
      let plaintext = decrypt(data.cipherText, data.multiplier, data.shift);

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
        <PlainCipherTextarea errors={errors} currentSuccess={currentSuccess} />
        <div className="flex flex-row gap-4 items-center justify-center w-full">
          <Input
            value={data.multiplier}
            onValueChange={setMultiplier}
            label="Multiplier"
            className="w-full"
            isInvalid={
              errors.find((error) => error.field === "multiplier") !== undefined
            }
            errorMessage={
              errors.find((error) => error.field === "multiplier")?.message
            }
            type="number"
          />
          <Input
            value={data.shift}
            onValueChange={setShift}
            label="Shift"
            className="w-full"
            isInvalid={
              errors.find((error) => error.field === "shift") !== undefined
            }
            errorMessage={
              errors.find((error) => error.field === "shift")?.message
            }
            type="number"
          />
        </div>
        <CipherButton
          onEncrypt={handleEncrypt}
          onDecrypt={handleDecrypt}
          encryptWarningTypes={[
            "missing-plaintext",
            "missing-multiplier",
            "missing-shift",
          ]}
          decryptWarningTypes={[
            "missing-ciphertext",
            "missing-multiplier",
            "missing-shift",
          ]}
          additionalRequiredFields={["multiplier", "shift"]}
        />
        <FileForm setCurrentSuccess={setCurrentSuccess} />
      </form>
      <CipherError errors={errors} errorMessage={errorMessage} />
    </div>
  );
}
