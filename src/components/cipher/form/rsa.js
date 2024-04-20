"use client";

import { useContext, useEffect, useState } from "react";

import { Input, Divider, Button } from "@nextui-org/react";

import { encrypt, decrypt } from "@/lib/cipher/rsa";
import { CipherInputContext } from "@/lib/store/cipher-input-context";
import InputError from "@/lib/error/input-error";
import CipherError from "../cipher-error";
import { explode } from "@/lib/utils/cipher";
import PlainCipherTextarea from "../plain-cipher-textarea";
import CipherButton from "../cipher-button";
import FileForm from "../file-form";

const explodeResult = true;

export default function RSAForm() {
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

  const person = (
    <div className="flex flex-col gap-4 items-center justify-center w-full">
      <p className="text-2xl font-bold">Alice</p>
      <div className="flex flex-row gap-4 items-center justify-center w-full">
        <Input
          label="p"
          value={data.key}
          onChange={(e) => setKeyHandler(e.target.value)}
          placeholder="p"
          width="100%"
          required
        />
        <Input
          label="q"
          value={data.key}
          onChange={(e) => setKeyHandler(e.target.value)}
          placeholder="q"
          width="100%"
          required
        />
      </div>
      <Button auto onClick={() => {}} className="w-full">
        Generate Key
      </Button>
      <Input
        label="Generated Private Key"
        value={data.key}
        onChange={(e) => setKeyHandler(e.target.value)}
        placeholder="Generated Public Key"
        width="100%"
        isReadOnly
      />
      <Input
        label="Generated Private Key"
        value={data.key}
        onChange={(e) => setKeyHandler(e.target.value)}
        placeholder="Generated Public Key"
        width="100%"
        isReadOnly
      />
      <Button auto onClick={() => {}} className="w-full">
        Send Public Key
      </Button>
      <Input
        label="Received Public Key"
        value={data.key}
        onChange={(e) => setKeyHandler(e.target.value)}
        placeholder="Received Public Key"
        width="100%"
        isReadOnly
      />
    </div>
  );

  return (
    <>
      <div className="flex flex-row gap-4 items-center justify-center w-full">
        {person}
        <Divider orientation="vertical" />
        {person}
      </div>
      <p className="text-2xl font-bold">Chat</p>
      <div className="flex flex-col gap-4 items-center justify-center w-full bg-neutral-800 min-h-[300px] max-w-[500px] rounded-md"></div>
    </>

    // <>
    //   <Input
    //     label="Public Key"
    //     value={data.key}
    //     onChange={(e) => setKeyHandler(e.target.value)}
    //     placeholder="Public Key"
    //     width="100%"
    //     required
    //   />
    //   <FileForm
    //     data={data}
    //     setPlainText={setPlainText}
    //     setCipherText={setCipherText}
    //     setErrors={setErrors}
    //     setErrorMessage={setErrorMessage}
    //     setCurrentSuccess={setCurrentSuccess}
    //   />
    //   <PlainCipherTextarea
    //     data={data}
    //     setPlainText={setPlainText}
    //     setCipherText={setCipherText}
    //   />
    //   <CipherButton
    //     handleEncrypt={handleEncrypt}
    //     handleDecrypt={handleDecrypt}
    //   />
    //   <CipherError errors={errors} message={errorMessage} />
    // </>
  );
}
