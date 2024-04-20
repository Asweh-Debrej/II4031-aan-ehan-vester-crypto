"use client";

import { useContext, useEffect, useState } from "react";

import { Input, Divider, Button } from "@nextui-org/react";

import { generateKeys, encrypt, decrypt } from "@/lib/cipher/rsa";
import { CipherInputContext } from "@/lib/store/cipher-input-context";
import InputError from "@/lib/error/input-error";
import CipherError from "../cipher-error";
import { explode } from "@/lib/utils/cipher";
import PlainCipherTextarea from "../plain-cipher-textarea";
import CipherButton from "../cipher-button";
import FileForm from "../file-form";
import { set } from "lodash";

const explodeResult = true;

export default function RSAForm() {
  const [errors, setErrors] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentSuccess, setCurrentSuccess] = useState("");

  const [pAlice, setPAlice] = useState(0);
  const [qAlice, setQAlice] = useState(0);
  const [generatedPrivateKeyAlice, setGeneratedPrivateKeyAlice] = useState(0);
  const [generatedPublicKeyAlice, setGeneratedPublicKeyAlice] = useState(0);
  const [receivedPublicKeyAlice, setReceivedPublicKeyAlice] = useState(0);
  const [pBob, setPBob] = useState(0);
  const [qBob, setQBob] = useState(0);
  const [generatedPrivateKeyBob, setGeneratedPrivateKeyBob] = useState(0);
  const [generatedPublicKeyBob, setGeneratedPublicKeyBob] = useState(0);
  const [receivedPublicKeyBob, setReceivedPublicKeyBob] = useState(0);

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

  const handleGenerateKeyAlice = (pAlice, qAlice) => {
    try {
      let generatedKeys = generateKeys(pAlice, qAlice);

      setGeneratedPrivateKeyAlice(generatedKeys.privateKey.d);
      setGeneratedPublicKeyAlice(generatedKeys.publicKey.e);

      setCurrentSuccess("generate key");
      clearErrors();
    } catch (error) {
      handleError(error);
    }
  };
  const handleGenerateKeyBob = (pBob, qBob) => {
    try {
      let generatedKeys = generateKeys(pBob, qBob);

      setGeneratedPrivateKeyBob(generatedKeys.privateKey.d);
      setGeneratedPublicKeyBob(generatedKeys.publicKey.e);

      setCurrentSuccess("generate key");
      clearErrors();
    } catch (error) {
      handleError(error);
    }
  };

  const sendPublicKeyHandlerAlice = (generatedPublicKeyAlice) => {
    try {
      setReceivedPublicKeyBob(generatedPublicKeyAlice);

      setCurrentSuccess("send key");
      clearErrors();
    } catch (error) {
      handleError(error);
    }
  };

  const sendPublicKeyHandlerBob = (generatedPublicKeyBob) => {
    try {
      setReceivedPublicKeyAlice(generatedPublicKeyBob);

      setCurrentSuccess("send key");
      clearErrors();
    } catch (error) {
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

  const alice = (
    <div className="flex flex-col gap-4 items-center justify-center w-full">
      <p className="text-2xl font-bold">Alice</p>
      <div className="flex flex-row gap-4 items-center justify-center w-full">
        <Input
          label="p"
          value={pAlice}
          onChange={(e) => setPAlice(e.target.value)}
          placeholder="p"
          width="100%"
          required
          type="number"
          isInvalid={errors.find((error) => error.field === "p") !== undefined}
          errorMessage={errors.find((error) => error.field === "p")?.message}
        />
        <Input
          label="q"
          value={qAlice}
          onChange={(e) => setQAlice(e.target.value)}
          placeholder="q"
          width="100%"
          required
          type="number"
          isInvalid={errors.find((error) => error.field === "q") !== undefined}
          errorMessage={errors.find((error) => error.field === "q")?.message}
        />
      </div>
      <Button
        auto
        onClick={() => {
          handleGenerateKeyAlice(pAlice, qAlice);
        }}
        className="w-full"
      >
        Generate Key
      </Button>
      <Input label="Generated Private Key" value={generatedPrivateKeyAlice} onChange={(e) => setGeneratedPrivateKeyAlice(e.target.value)} placeholder="Generated Private Key" width="100%" isReadOnly />
      <Input label="Generated Public Key" value={generatedPublicKeyAlice} onChange={(e) => setGeneratedPublicKeyAlice(e.target.value)} placeholder="Generated Public Key" width="100%" isReadOnly />
      <Button
        auto
        onClick={() => {
          sendPublicKeyHandlerAlice(generatedPublicKeyAlice);
        }}
        className="w-full"
      >
        Send Public Key
      </Button>
      <Input label="Received Public Key" value={receivedPublicKeyAlice} onChange={(e) => setReceivedPublicKeyAlice(e.target.value)} placeholder="Received Public Key" width="100%" isReadOnly />
    </div>
  );

  const bob = (
    <div className="flex flex-col gap-4 items-center justify-center w-full">
      <p className="text-2xl font-bold">Bob</p>
      <div className="flex flex-row gap-4 items-center justify-center w-full">
        <Input
          label="p"
          value={pBob}
          onChange={(e) => setPBob(e.target.value)}
          placeholder="p"
          width="100%"
          required
          type="number"
          isInvalid={errors.find((error) => error.field === "p") !== undefined}
          errorMessage={errors.find((error) => error.field === "p")?.message}
        />
        <Input
          label="q"
          value={qBob}
          onChange={(e) => setQBob(e.target.value)}
          placeholder="q"
          width="100%"
          required
          type="number"
          isInvalid={errors.find((error) => error.field === "q") !== undefined}
          errorMessage={errors.find((error) => error.field === "q")?.message}
        />
      </div>
      <Button
        auto
        onClick={() => {
          handleGenerateKeyBob(pBob, qBob);
        }}
        className="w-full"
      >
        Generate Key
      </Button>
      <Input label="Generated Private Key" value={generatedPrivateKeyBob} onChange={(e) => setGeneratedPrivateKeyBob(e.target.value)} placeholder="Generated Private Key" width="100%" isReadOnly />
      <Input label="Generated Public Key" value={generatedPublicKeyBob} onChange={(e) => setGeneratedPublicKeyBob(e.target.value)} placeholder="Generated Public Key" width="100%" isReadOnly />
      <Button
        auto
        onClick={() => {
          sendPublicKeyHandlerBob(generatedPublicKeyBob);
        }}
        className="w-full"
      >
        Send Public Key
      </Button>
      <Input label="Received Public Key" value={receivedPublicKeyBob} onChange={(e) => setReceivedPublicKeyBob(e.target.value)} placeholder="Received Public Key" width="100%" isReadOnly />
    </div>
  );
  return (
    <>
      <div className="flex flex-row gap-4 items-center justify-center w-full">
        {alice}
        <Divider orientation="vertical" />
        {bob}
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
