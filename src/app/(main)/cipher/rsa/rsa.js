"use client";

import { useContext, useEffect, useState, useRef } from "react";

import { Input, Divider, Button } from "@nextui-org/react";

import { generateKeys, encrypt, decrypt } from "@/lib/cipher/rsa";
import { CipherInputContext } from "@/lib/store/cipher-input-context";
import InputError from "@/lib/error/input-error";
import CipherError from "../cipher-error";
import ErrorTooltip from "../error-tooltip";
import { explode } from "@/lib/utils/cipher";
import PlainCipherTextarea from "../plain-cipher-textarea";
import CipherButton from "../cipher-button";
import FileForm from "../file-form";
import { set } from "lodash";
import { encode, decode } from "js-base64";
import { FaRegFileLines } from "react-icons/fa6";
import { RiSendPlaneFill } from "react-icons/ri";
import { BiSolidFileImport } from "react-icons/bi";

import { base64StringToBlob } from "blob-util";
import { extension } from "mime-types";

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

  const saveKeyRef = useRef();

  const handleSaveKey = (key, type) => {
    const blob = new Blob([JSON.stringify(key)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    saveKeyRef.current.href = url;
    saveKeyRef.current.download =
      type === "private" ? "private-key.pri" : "public-key.pub";
    saveKeyRef.current.click();
  };

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
          isInvalid={
            errors.find((error) => error.field === `${object}.p`) !== undefined
          }
          errorMessage={
            (errors.find((error) => error.field === `${object}.p`)?.message ??
              "") +
            (!Number.isSafeInteger(data.rsa[object].p * data.rsa[object].q)
              ? ". Defining too large p and q may cause problem"
              : "")
          }
        />
        <Input
          label="q"
          value={data.rsa[object].q}
          onValueChange={(val) => setRSAQ(object, val)}
          placeholder="q"
          required
          type="number"
          isInvalid={
            errors.find((error) => error.field === `${object}.q`) !== undefined
          }
          errorMessage={
            (errors.find((error) => error.field === `${object}.q`)?.message ??
              "") ||
            (!Number.isSafeInteger(data.rsa[object].p * data.rsa[object].q)
              ? ". Defining too large p and q may cause problem"
              : "")
          }
        />
      </div>
      <Button
        auto
        onClick={() => {
          handleGenerateKey(object);
        }}
        className="w-full"
        color="warning">
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
          <a ref={saveKeyRef} className="hidden" download />
        </div>
      </div>
      <div className="flex flex-row gap-4 items-center justify-center w-full">
        <ErrorTooltip
          warningTypes={["missing-rsa-public-key"]}
          className="w-full"
          data={data.rsa[object].generatedPublicKey}>
          <Button
            auto
            onClick={() => {
              handleSaveKey(data.rsa[object].generatedPrivateKey, "private");
            }}
            className="w-full"
            isDisabled={data.rsa[object].generatedPublicKey.e === undefined}
            color="success">
            Save Private Key
          </Button>
        </ErrorTooltip>
        <ErrorTooltip
          warningTypes={["missing-rsa-public-key"]}
          className="w-full"
          data={data.rsa[object].generatedPublicKey}>
          <Button
            auto
            onClick={() => {
              handleSaveKey(data.rsa[object].generatedPublicKey, "public");
            }}
            className="w-full"
            isDisabled={data.rsa[object].generatedPublicKey.e === undefined}
            color="success">
            Save Public Key
          </Button>
        </ErrorTooltip>
      </div>
      <ErrorTooltip
        warningTypes={["missing-rsa-public-key"]}
        className="w-full"
        data={data.rsa[object].generatedPublicKey}>
        <Button
          auto
          onClick={() => {
            sendPublicKeyHandler(object);
          }}
          className="w-full"
          isDisabled={data.rsa[object].generatedPublicKey.e === undefined}
          color="warning">
          Send Public Key
        </Button>
      </ErrorTooltip>
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

const MessageInput = ({ object, clearErrors, handleError }) => {
  const { data, pushMessage } = useContext(CipherInputContext);
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    try {
      const encryptedMessage = encode(
        encrypt(message, data.rsa[object].recievedPublicKey)
      );

      pushMessage(
        object,
        object === "left" ? "right" : "left",
        encryptedMessage,
        "text"
      );
      setMessage("");
      clearErrors();
    } catch (error) {
      handleError(error);
    }
  };

  const handleUpload = (handler) => (event) => {
    const files = event.target.files;
    handler(files);
    event.target.value = null;
  };

  const handleFile = (files) => {
    const onLoadHandler = (fileName) => (event) => {
      try {
        const fileContent = event.target.result;
        const encryptedMessage = encode(
          encrypt(fileContent, data.rsa[object].recievedPublicKey)
        );

        pushMessage(
          object,
          object === "left" ? "right" : "left",
          encryptedMessage,
          "file",
          fileName
        );
        clearErrors();
      } catch (error) {
        handleError(error);
      }
    };

    for (const file of files) {
      const reader = new FileReader();
      reader.onload = onLoadHandler(file.name);

      reader.readAsDataURL(file);
    }
  };

  const inputFileRef = useRef();

  return (
    <div className="flex flex-row gap-1 md:gap-2 items-center justify-center w-full">
      <Input
        value={message}
        onValueChange={setMessage}
        placeholder="Message"
        className="min-w-[100px]"
      />
      <div className="flex flex-col md:flex-row gap-1 md:gap-2 items-center justify-center w-fit">
        <ErrorTooltip
          warningTypes={["missing-received-public-key"]}
          className="w-full"
          data={data.rsa[object].recievedPublicKey}>
          <Button
            auto
            onClick={() => {
              inputFileRef.current.click();
            }}
            className="w-full"
            isDisabled={data.rsa[object].recievedPublicKey.e === undefined}
            isIconOnly>
            <BiSolidFileImport />
          </Button>
        </ErrorTooltip>
        <ErrorTooltip
          warningTypes={["missing-received-public-key", "empty-message"]}
          className="w-full"
          data={{ ...data.rsa[object].recievedPublicKey, message }}>
          <Button
            auto
            onClick={handleSendMessage}
            className="w-full"
            isDisabled={
              message === "" ||
              data.rsa[object].recievedPublicKey.e === undefined
            }
            color="warning"
            isIconOnly>
            <RiSendPlaneFill />
          </Button>
        </ErrorTooltip>
      </div>
      <input
        type="file"
        ref={inputFileRef}
        className="hidden"
        onChange={handleUpload(handleFile)}
      />
    </div>
  );
};

const MessageBox = ({ payload, clearErrors, handleError }) => {
  const { data, setChatDecrypted, revertChat, toggleBase64 } =
    useContext(CipherInputContext);
  const {
    id,
    sender,
    receiver,
    original,
    decrypted,
    status,
    type,
    fileName,
    useBase64,
  } = payload;
  const avatar = (
    <div className="size-[36px] w-min-[36px] aspect-square rounded-full bg-slate-900 mb-5" />
  );

  const decryptHandler = () => {
    try {
      setChatDecrypted(
        id,
        decrypt(decode(original), data.rsa[receiver].generatedPrivateKey)
      );
      clearErrors();
    } catch (error) {
      handleError(error);
    }
  };

  const thisRef = useRef();
  const saveFileRef = useRef();

  const handleSaveOriginal = () => {
    if (type === "file") {
      const blob = new Blob([original], {
        type: "application/octet-stream",
      });
      const url = URL.createObjectURL(blob);
      saveFileRef.current.href = url;
      saveFileRef.current.download = "ciphertext.AAN";
      saveFileRef.current.click();
    } else if (type === "text") {
      const blob = new Blob([original], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      saveFileRef.current.href = url;
      saveFileRef.current.download = "ciphertext.txt";
      saveFileRef.current.click();
    }
  };

  const handleSaveDecrypted = () => {
    if (type === "file") {
      const fileNames = fileName.split(".");
      const fileExtension = fileNames[fileNames.length - 1];
      const content = decrypted.split(",")[1];

      let blob = null;

      if (fileNames.length > 1 && content) {
        blob = base64StringToBlob(content, fileExtension);
        saveFileRef.current.download = `plaintext.${fileExtension}`;
      } else {
        blob = new Blob([decrypted], { type: "text/plain" });
        saveFileRef.current.download = "plaintext.txt";
      }

      saveFileRef.current.href = URL.createObjectURL(blob);
      saveFileRef.current.click();
    } else if (type === "text") {
      const blob = new Blob([decrypted], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      saveFileRef.current.href = url;
      saveFileRef.current.download = "plaintext.txt";
      saveFileRef.current.click();
    }
  };

  useEffect(() => {
    thisRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  return (
    <div
      className={`flex flex-row gap-2 ${
        sender === "left" ? "mr-auto pr-12" : "ml-auto pl-12"
      } first:mt-auto max-w-full`}
      ref={thisRef}>
      {sender === "left" ? avatar : ""}
      <div
        className={`flex flex-col gap-1 ${
          sender === "left" ? "mr-auto" : "ml-auto"
        } w-fit`}>
        <div
          className={`flex flex-row gap-2 ${
            sender === "left" ? "mr-auto" : "ml-auto"
          } bg-zinc-950 w-fit rounded-xl px-2 py-1`}>
          {type === "file" ? (
            <>
              <FaRegFileLines className="text-xl size-4 self-center" />
              <p className="text-sm break-all break-normal w-fit">
                {status === "decrypted" ? "plaintext" : "ciphertext"}{" "}
                {`( ${fileName} )`}
              </p>
            </>
          ) : (
            <p className="text-sm break-all break-normal w-fit">
              {status === "decrypted"
                ? decrypted
                : useBase64
                ? original
                : decode(original)}
            </p>
          )}
        </div>
        <div
          className={`flex flex-row gap-3 items-center ${
            sender === "left" ? "mr-auto pl-2" : "ml-auto pr-2"
          }`}>
          {status === "original" ? (
            <>
              {type === "text" ? (
                <button
                  className="text-xs text-gray-400 hover:text-gray-300 hover:underline"
                  onClick={() => toggleBase64(id)}>
                  {useBase64 ? "show UTF-8" : "show base64"}
                </button>
              ) : (
                ""
              )}
              <button
                className="text-xs text-gray-400 hover:text-gray-300 hover:underline"
                onClick={decryptHandler}>
                decrypt
              </button>
              <button
                className="text-xs text-gray-400 hover:text-gray-300 hover:underline"
                onClick={handleSaveOriginal}>
                save encrypted
              </button>
            </>
          ) : (
            <>
              <button
                className="text-xs text-gray-400 hover:text-gray-300 hover:underline"
                onClick={() => revertChat(id)}>
                revert to original
              </button>
              <button
                className="text-xs text-gray-400 hover:text-gray-300 hover:underline"
                onClick={handleSaveDecrypted}>
                save decrypted
              </button>
            </>
          )}
        </div>
      </div>
      {sender === "right" ? avatar : ""}
      <a ref={saveFileRef} className="hidden" download />
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

      setRSAGeneratedKeys(object, generatedKeys);

      setCurrentSuccess("generateKey");
      clearErrors();
    } catch (error) {
      if (error instanceof InputError) {
        error.errors = error.errors.map((err) => {
          return { ...err, field: `${object}.${err.field}` };
        });
      }
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
      <div className="flex flex-col gap-2 items-end w-full bg-neutral-800 h-[400px] max-w-[600px] rounded-md p-4 overflow-y-auto">
        {Object.values(data.chat).map((payload) => (
          <MessageBox
            key={payload.id}
            payload={payload}
            clearErrors={clearErrors}
            handleError={handleError}
          />
        ))}
      </div>
      <div className="flex flex-row gap-2 md:gap-4 items-center justify-center w-full">
        <MessageInput
          object="left"
          clearErrors={clearErrors}
          handleError={handleError}
        />
        <Divider orientation="vertical" />
        <MessageInput
          object="right"
          clearErrors={clearErrors}
          handleError={handleError}
        />
      </div>
      <CipherError errors={errors} errorMessage={errorMessage} />
    </>
  );
}
