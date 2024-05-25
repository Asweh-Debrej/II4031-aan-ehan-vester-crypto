"use client";

import { useState, useEffect } from "react";

import { Button, Input } from "@nextui-org/react";
import TranscriptTable from "./transcript-table";

const fieldsToEncrypt = ["name", "course", "gpa", "signature"];

const decryptRC4 = (message, key) => {
  return message;
}

const decryptData = (data, key) => {
  let decryptedData = {};
  for (let key in data) {
    if (!fieldsToEncrypt.includes(key) && fieldsToEncrypt.length) {
      decryptedData[key] = data[key];
      continue;
    }

    if (typeof data[key] === "string") {
      decryptedData[key] = decryptRC4(data[key], key);
    } else if (typeof data[key] === "object") {
      decryptedData[key] = decryptData(data[key], key);
    } else if (typeof data[key] === "array") {
      decryptedData[key] = data[key].map((item) => decryptData(item, key));
    } else {
      decryptedData[key] = decryptRC4(data[key], key);
    }
  }

  return decryptedData;
}

export default function DecryptField({ studentData = null, onDecrypt = (data) => {}}) {
  const [key, setKey] = useState("");
  const [decrypted, setDecrypted] = useState(null);

  const onSubmitHandler = () => {
    if (!key) {
      alert("Key is required");
      return;
    }

    if (!studentData) {
      alert("Student data is required");
      return;
    }

    const decryptedData = decryptData(studentData, key);

    setDecrypted(decryptedData);
    onDecrypt(decryptedData);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-fit max-w-full">
      <p>
        {`Using RC4 decryption, you can decrypt each field of the student data
        with a key you've used before.`}
      </p>
      <div className="flex flex-row gap-4 items-center mx-auto">
        <Input
          label="Key"
          className="w-[200px]"
          onValueChange={(val) => setKey(val)}
        />
        <Button
          color="primary"
          className="w-[160px]"
          onClick={onSubmitHandler}
        >
          Decrypt
        </Button>
      </div>
      <p>
        {`Decrypted data will be shown in the table below`}
      </p>
      <TranscriptTable data={decrypted ? [decrypted] : []} includeHash />
    </div>
  );
}
