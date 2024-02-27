"use client";

import { useContext, useEffect, useState, useRef } from "react";

import { Textarea, Input, Button } from "@nextui-org/react";

import { encrypt, decrypt } from "@/lib/cipher/vigenere-ext";
import { CipherInputContext } from "@/lib/store/cipher-input-context";
import MissingInputError from "@/lib/error/missing-input-error";
import CipherError from "../cipher-error";
import { base64StringToBlob, binaryStringToBlob } from "blob-util";
import { extension } from "mime-types";
import ErrorTooltip from "@/components/cipher/error-tooltip";

const handleUpload = (fileHandler) => (e) => fileHandler(e.target.files[0]);

export default function VigenereExtForm() {
  const {
    data,
    setPlainText,
    setCipherText,
    setKey,
    setPlainFile,
    setCipherFile,
  } = useContext(CipherInputContext);

  const [errors, setErrors] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentSuccess, setCurrentSuccess] = useState("");

  const inputPlaintextFile = useRef(null);
  const savePlaintextFile = useRef(null);
  const inputCiphertextFile = useRef(null);
  const saveCiphertextFile = useRef(null);

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

  const handlePlainFile = (file) => {
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileContent = e.target.result;
        setPlainText(fileContent);
      };

      reader.readAsDataURL(file);
      setPlainFile(file);
      setCurrentSuccess("plainFile");
    }
  };

  const handleCipherFIle = (file) => {
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileContent = e.target.result;
        setCipherText(fileContent);
      };

      reader.readAsText(file);
      setCipherFile(file);
      setCurrentSuccess("cipherFile");
    }
  };

  const handleSavePlaintext = () => {
    const brokenFile = data.plainText; // e.g. data:application/octet-stream;base64,content

    const extensionType = extension(brokenFile.split(";")[0].split(":")[1]);
    const content = brokenFile.split(",")[1];

    if (!content) {
      return;
    }

    let blob = null;

    blob = extensionType
      ? base64StringToBlob(content, extensionType)
      : binaryStringToBlob(brokenFile);

    savePlaintextFile.current.download = `plaintext.${extensionType || "txt"}`;
    savePlaintextFile.current.href = URL.createObjectURL(blob);
    savePlaintextFile.current.href = savePlaintextFile.current.click();
  };

  const handleSaveCiphertext = () => {
    const brokenFile = data.cipherText;

    const extensionType = "application/octet-stream";

    const blob = new Blob([brokenFile], { type: extensionType });

    saveCiphertextFile.current.href = URL.createObjectURL(blob);
    saveCiphertextFile.current.click();
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
            color={
              currentSuccess === "decrypt" || currentSuccess === "plainFile"
                ? "success"
                : "default"
            }
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
            color={
              currentSuccess === "encrypt" || currentSuccess === "cipherFile"
                ? "success"
                : "default"
            }
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
          <ErrorTooltip
            warningTypes={["missing-plaintext", "missing-key"]}
            className="w-full">
            <Button
              auto
              onClick={handleEncrypt}
              className="w-full rounded-md bg-amber-600"
              isDisabled={data.plainText === "" || data.key === ""}>
              Encrypt ==&gt;
            </Button>
          </ErrorTooltip>
          <ErrorTooltip
            warningTypes={["missing-ciphertext", "missing-key"]}
            className="w-full">
            <Button
              auto
              onClick={handleDecrypt}
              className="w-full rounded-md bg-amber-600"
              isDisabled={data.cipherText === "" || data.key === ""}>
              &lt;== Decrypt
            </Button>
          </ErrorTooltip>
        </div>
        <div className="flex flex-row gap-4 items-center justify-center w-full">
          <Button
            auto
            onClick={() => {
              inputPlaintextFile.current.click();
            }}
            className="w-full rounded-md">
            Upload Plaintext
          </Button>
          <Button
            auto
            onClick={handleSavePlaintext}
            className="w-full rounded-md"
            isDisabled={!data.plainText}>
            Save Plaintext
          </Button>
          <Button
            auto
            onClick={() => {
              inputCiphertextFile.current.click();
            }}
            className="w-full rounded-md">
            Upload Ciphertext
          </Button>
          <Button
            auto
            onClick={handleSaveCiphertext}
            className="w-full rounded-md"
            isDisabled={!data.cipherText}>
            Save Ciphertext
          </Button>
        </div>
        <div className="flex flex-row gap-4 items-center justify-center w-full">
          <Button
            color="success"
            className={`w-full rounded-md ${
              data.plainFile ? "visible" : "invisible"
            }`}
            onClick={() => {
              handlePlainFile(data.plainFile);
            }}>
            Open &quot;{data.plainFile?.name || "No file selected"}&quot; as
            plaintext
          </Button>
          <Button
            color="success"
            className={`w-full rounded-md ${
              data.cipherFile ? "visible" : "invisible"
            }`}
            onClick={() => {
              handleCipherFIle(data.cipherFile);
            }}>
            Open &quot;{data.cipherFile?.name || "No file selected"}&quot; as
            ciphertext
          </Button>
        </div>
        <input
          type="file"
          ref={inputPlaintextFile}
          className="hidden"
          onChange={handleUpload(handlePlainFile)}
        />
        <input
          type="file"
          ref={inputCiphertextFile}
          className="hidden"
          onChange={handleUpload(handleCipherFIle)}
        />
        <a ref={savePlaintextFile} className="hidden" download />
        <a
          ref={saveCiphertextFile}
          className="hidden"
          download="encrypted.AAN"
        />
      </form>
      <CipherError errors={errors} errorMessage={errorMessage} />
    </div>
  );
}
