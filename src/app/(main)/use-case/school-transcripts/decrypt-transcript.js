"use client";

import { useState, useEffect } from "react";

import { Button, Input } from "@nextui-org/react";
import { saveAs } from "file-saver";
import aesjs from "aes-js";

export default function DecryptTranscript() {
  const [key, setKey] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  function blobToArrayBuffer(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  }

  function arrayBufferToBlob(arrayBuffer, type) {
    return new Blob([arrayBuffer], { type });
  }

  const padKey = (key) => {
    const paddingChar = "x"; // You can use any character you prefer
    const keyLength = key.length;
    const padLength = 16 - (keyLength % 16);
    const paddedKey = key + paddingChar.repeat(padLength);
    return paddedKey;
  };

  async function decryptPDFBlob(encryptedBlob, key) {
    try {
      const arrayBuffer = await blobToArrayBuffer(encryptedBlob);
      const bytes = new Uint8Array(arrayBuffer);
      if (key.length !== 16 && key.length !== 24 && key.length !== 32) {
        throw new Error("Invalid key length. Key must be 16, 24, or 32 bytes long.");
      }
      const aesEcb = new aesjs.ModeOfOperation.ecb(key);
      const decryptedBytes = aesEcb.decrypt(bytes);
      const unpaddedBytes = aesjs.padding.pkcs7.strip(decryptedBytes);
      const decryptedArrayBuffer = unpaddedBytes.buffer;
      const decryptedBlob = arrayBufferToBlob(decryptedArrayBuffer, encryptedBlob.type);
      return decryptedBlob;
    } catch (error) {
      console.error("PDF decryption failed:", error);
      throw error;
    }
  }

  const onSubmitHandler = async () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const encryptedBlob = new Blob([reader.result], { type: file.type });
        const paddedKey = aesjs.utils.utf8.toBytes(padKey(key));
        decryptPDFBlob(encryptedBlob, paddedKey)
          .then((decryptedBlob) => {
            console.log("Decrypted Blob:", decryptedBlob);
            saveAs(decryptedBlob, `Decrypted_${file.name}.pdf`);
          })
          .catch((error) => {
            console.error("PDF decryption failed:", error);
            alert("Your key is wrong.");
          });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-fit max-w-full">
      <p>{`Upload yout encrypted transcript and decrypt using AES.`}</p>
      <div className="flex flex-row gap-4 items-center mx-auto">
        <Input type="file" onChange={handleFileChange} />
        <Input label="Key" className="w-[200px]" onValueChange={(val) => setKey(val)} />
        <Button color="primary" className="w-[160px]" onClick={onSubmitHandler}>
          Decrypt
        </Button>
      </div>
      <p>{`The decrypted PDF file will be downloaded automaticaly`}</p>
    </div>
  );
}
