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

const persons = {
  left: "Alice",
  right: "Bob",
};

const Person = ({
  object,
  handleGenerateKey,
  sendPublicKeyHandler,
  errors,
}) => {
  const { data, setRSAP, setRSAQ } = useContext(CipherInputContext);

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full">
      <p className="text-2xl font-bold">{persons.object}</p>
      <div className="flex flex-row gap-4 items-center justify-center w-full">
        <Input
          label="p"
          value={data.rsa[object].p}
          onValueChange={(val) => setRSAP(object, val)}
          placeholder="p"
          required
          type="number"
          isInvalid={errors.find((error) => error.field === "p") !== undefined}
          errorMessage={errors.find((error) => error.field === "p")?.message}
        />
        <Input
          label="q"
          value={data.rsa[object].q}
          onValueChange={(val) => setRSAQ(object, val)}
          placeholder="q"
          required
          type="number"
          isInvalid={errors.find((error) => error.field === "q") !== undefined}
          errorMessage={errors.find((error) => error.field === "q")?.message}
        />
      </div>
      <Button
        auto
        onClick={() => {
          handleGenerateKey(object);
        }}
        className="w-full">
        Generate Key
      </Button>
      <div className="flex flex-col gap-1 items-start justify-center w-full">
        <p className="text-sm">Generated Private Key</p>
        <div className="flex flex-row gap-4 items-center justify-center w-full">
          <Input
            label="d"
            value={data.rsa[object].generatedPrivateKey.d}
            placeholder="d"
            isReadOnly
            isDisabled={data.rsa[object].generatedPrivateKey.d === undefined}
          />
          <Input
            label="n"
            value={data.rsa[object].generatedPrivateKey.n}
            placeholder="n"
            isReadOnly
            isDisabled={data.rsa[object].generatedPrivateKey.n === undefined}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1 items-start justify-center w-full">
        <p className="text-sm">Generated Public Key</p>
        <div className="flex flex-row gap-4 items-center justify-center w-full">
          <Input
            label="e"
            value={data.rsa[object].generatedPublicKey.e}
            placeholder="e"
            isReadOnly
            isDisabled={data.rsa[object].generatedPublicKey.e === undefined}
          />
          <Input
            label="n"
            value={data.rsa[object].generatedPublicKey.n}
            placeholder="n"
            isReadOnly
            isDisabled={data.rsa[object].generatedPublicKey.n === undefined}
          />
        </div>
      </div>
      <Button
        auto
        onClick={() => {
          sendPublicKeyHandler(object);
        }}
        className="w-full"
        isDisabled={data.rsa[object].generatedPublicKey.e === undefined}>
        Send Public Key
      </Button>
      <div className="flex flex-col gap-1 items-start justify-center w-full">
        <p className="text-sm">Received Public Key</p>
        <div className="flex flex-row gap-4 items-center justify-center w-full">
          <Input
            label="e"
            value={data.rsa[object].recievedPublicKey.e}
            placeholder="e"
            width="100%"
            isReadOnly
            isDisabled={data.rsa[object].recievedPublicKey.e === undefined}
          />
          <Input
            label="n"
            value={data.rsa[object].recievedPublicKey.n}
            placeholder="n"
            width="100%"
            isReadOnly
            isDisabled={data.rsa[object].recievedPublicKey.n === undefined}
          />
        </div>
      </div>
    </div>
  );
};

const MessageInput = ({ object }) => {
  const { data, pushMessage } = useContext(CipherInputContext);
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    const encryptedMessage = encrypt(
      message,
      data.rsa[object].recievedPublicKey
    );
    pushMessage(object, object === "left" ? "right" : "left", encryptedMessage);
    setMessage("");
  };

  return (
    <div className="flex flex-row gap-4 items-center justify-center w-full">
      <Input
        value={message}
        onValueChange={setMessage}
        placeholder="Message"
      />
      <Button
        auto
        onClick={handleSendMessage}
        isDisabled={
          message === "" || data.rsa[object].recievedPublicKey.e === undefined
        }
        color="warning"
        >
        Send
      </Button>
    </div>
  );
};

const MessageBox = ({ payload, clearErrors, handleError }) => {
  const { data, setChatDecrypted, revertChat } = useContext(CipherInputContext);
  const { id, sender, receiver, original, decrypted, status } = payload;
  const avatar = (
    <div className="w-[36px] aspect-square rounded-full bg-slate-900 h-fit mb-5" />
  );

  const decryptHandler = () => {
    try {
      setChatDecrypted(
        id,
        decrypt(original, data.rsa[receiver].generatedPrivateKey)
      );
      clearErrors();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div
      className={`flex flex-row gap-2 ${
        sender === "left" ? "justify-start" : "justify-end"
      } items-end w-full`}>
      {sender === "left" ? avatar : ""}
      <div
        className={`flex flex-col gap-1 ${
          sender === "left" ? "items-start" : "items-end"
        } justify-end w-fit`}>
        <div
          className={`flex flex-row gap-2 ${
            sender === "left" ? "justify-start" : "justify-end"
          } items-end bg-zinc-950 w-fit rounded-xl p-2`}>
          <p className="text-sm break-words">
            {status === "decrypted" ? decrypted : original}
          </p>
        </div>
        <div className={`flex flex-row gap-3 items-center ${
            sender === "left" ? "justify-start" : "justify-end"
          } w-full`}>
          {status === "original" ? (
            <button
              className="text-xs text-gray-400 hover:text-gray-300 hover:underline"
              onClick={decryptHandler}>
              decrypt
            </button>
          ) : (
            <button
              className="text-xs text-gray-400 hover:text-gray-300 hover:underline"
              onClick={() => revertChat(id)}>
              revert to original
            </button>
          )}
        </div>
      </div>
      {sender === "right" ? avatar : ""}
    </div>
  );
};

export default function RSAForm() {
  const { data, setRSAGeneratedKeys, setRSARecievedPublicKey } =
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

  const handleGenerateKey = (object) => {
    try {
      const p = data.rsa[object].p;
      const q = data.rsa[object].q;
      const generatedKeys = generateKeys(p, q);
      console.log(generatedKeys);

      setRSAGeneratedKeys(object, generatedKeys);

      setCurrentSuccess("generateKey");
      clearErrors();
    } catch (error) {
      handleError(error);
    }
  };

  const sendPublicKeyHandler = (sender) => {
    try {
      if (sender === "left") {
        setRSARecievedPublicKey("right", data.rsa.left.generatedPublicKey);
      } else {
        setRSARecievedPublicKey("left", data.rsa.right.generatedPublicKey);
      }

      setCurrentSuccess("sendKey");
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

  return (
    <>
      <div className="flex flex-row gap-4 items-center justify-center w-full">
        <Person
          object="left"
          data={data}
          handleGenerateKey={handleGenerateKey}
          sendPublicKeyHandler={sendPublicKeyHandler}
          errors={errors}
        />
        <Divider orientation="vertical" />
        <Person
          object="right"
          data={data}
          handleGenerateKey={handleGenerateKey}
          sendPublicKeyHandler={sendPublicKeyHandler}
          errors={errors}
        />
      </div>
      <p className="text-2xl font-bold">Chat</p>
      <div className="relative flex flex-col gap-2 items-end justify-end w-full bg-neutral-800 h-[400px] max-w-[600px] rounded-md p-4 overflow-y-auto">
        {/* <MessageBox message="Hello!" object="left" />
        <MessageBox message="Hi!" object="right" />
        <MessageBox message="How are you?" object="right" />
        <MessageBox message="Hello!" object="left" />
        <MessageBox message="Hi!" object="right" />
        <MessageBox message="How are you?" object="right" />
        <MessageBox message="Hello!" object="left" />
        <MessageBox message="Hi!" object="right" />
        <MessageBox message="How are you?" object="right" /> */}
        {Object.values(data.chat).map((payload) => (
          <MessageBox
            key={payload.id}
            payload={payload}
            clearErrors={clearErrors}
            handleError={handleError}
          />
        ))}
      </div>
      <div className="flex flex-row gap-4 items-center justify-center w-full">
        <MessageInput object="left" />
        <Divider orientation="vertical" />
        <MessageInput object="right" />
      </div>
      <CipherError errors={errors} errorMessage={errorMessage} />
    </>
  );
}
