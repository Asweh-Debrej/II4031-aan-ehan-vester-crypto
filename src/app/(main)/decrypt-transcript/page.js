"use client";

import React, { useState } from "react";
import aesjs from "aes-js";
import { saveAs } from "file-saver";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [key, setKey] = useState("");

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

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const padKey = (key) => {
    const paddingChar = "x"; // You can use any character you prefer
    const keyLength = key.length;
    const padLength = 16 - (keyLength % 16);
    const paddedKey = key + paddingChar.repeat(padLength);
    return paddedKey;
  };

  const handleDecrypt = async () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const encryptedBlob = new Blob([reader.result], { type: file.type });
        const paddedKey = aesjs.utils.utf8.toBytes(padKey(key));
        //const hardcodedKey = aesjs.utils.utf8.toBytes("123456xxxxxxxxxx");
        decryptPDFBlob(encryptedBlob, paddedKey)
          .then((decryptedBlob) => {
            saveAs(decryptedBlob, `Decrypted_${file.name}.pdf`);
          })
          .catch((error) => {
            console.error("PDF decryption failed:", error);
            alert("Key salah");
          });
      };
      reader.readAsArrayBuffer(file);
    }
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

  return (
    <div className="space-y-2 container bg-black">
      <h1>Decrypt Your Transcript</h1>
      <input type="file" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="Enter key"
        value={key}
        onChange={(e) => setKey(e.target.value)} //
      />
      <div className="bg-blue-400 rounded w-fit py-2 px-4">
        <button onClick={handleDecrypt} className="bg-red rounded">
          Decrypt
        </button>
      </div>
    </div>
  );
};

export default UploadPage;
