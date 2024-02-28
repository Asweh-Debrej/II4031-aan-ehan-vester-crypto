"use client";

import { useContext, useEffect, useState } from "react";

import { Input } from "@nextui-org/react";

import { encrypt, decrypt, generateKeySquare } from "@/lib/cipher/playfair";
import { CipherInputContext } from "@/lib/store/cipher-input-context";
import MissingInputError from "@/lib/error/missing-input-error";
import CipherError from "../cipher-error";
import PlainCipherTextarea from "../plain-cipher-textarea";
import CipherButton from "../cipher-button";
import FileForm from "../file-form";

// render the key square below the input fields in a 5x5 grid
const renderKeySquare = (key) => {
  const keySquare = generateKeySquare(key);

  return (
    <table className="w-fit border-spacing-2 border-separate aspect-square">
      <tbody>
        {[0, 1, 2, 3, 4].map((row) => (
          <tr key={row}>
            {[0, 1, 2, 3, 4].map((col) => (
              <td
                key={col}
                className="text-center rounded-md bg-gray-600 bg-opacity-20 size-[40px]">
                {keySquare[row * 5 + col]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default function PlayfairForm() {
  const { data, setPlainText, setCipherText, setKeyHandler } =
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
      <form className="flex flex-col gap-4 items-center justify-center w-full">
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
        <CipherButton
          onEncrypt={handleEncrypt}
          onDecrypt={handleDecrypt}
          encryptWarningTypes={["missing-plaintext", "missing-key"]}
          decryptWarningTypes={["missing-ciphertext", "missing-key"]}
        />
        <FileForm setCurrentSuccess={setCurrentSuccess} />
      </form>
      <CipherError errors={errors} errorMessage={errorMessage} />
      {renderKeySquare(data.key)}
    </div>
  );
}
