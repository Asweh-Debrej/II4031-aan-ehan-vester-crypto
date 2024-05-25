"use client";

import { useState } from "react";

import { Input, Button } from "@nextui-org/react";

import TranscriptTable from "./transcript-table";

const fieldsToEncrypt = ["name", "course", "gpa", "signature"];

const encryptRC4 = (message, key) => {
  return message;
};

const encryptData = (data, RC4key, fields = []) => {
  let encryptedData = {};
  for (let key in data) {
    if (!fields.includes(key) && fields.length) {
      encryptedData[key] = data[key];
      continue;
    }

    if (typeof data[key] === "string") {
      encryptedData[key] = encryptRC4(data[key], RC4key);
    } else if (typeof data[key] === "object") {
      encryptedData[key] = encryptData(data[key], key, []);
    } else if (typeof data[key] === "array") {
      encryptedData[key] = data[key].map((item) => encryptData(item, key));
    } else {
      encryptedData[key] = encryptRC4(data[key], RC4key);
    }
  }

  return encryptedData;
};

export default function EncryptField({ studentData = null }) {
  const [key, setKey] = useState("");
  const [encryptedData, setEncryptedData] = useState(null);

  const onSubmitHandler = () => {
    if (!key) {
      alert("Key is required");
      return;
    }

    if (!studentData) {
      alert("Student data is required");
      return;
    }

    const encryptedData = encryptData(studentData, key, fieldsToEncrypt);

    setEncryptedData(encryptedData);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-fit max-w-full">
      <p>
        Using RC4 encryption, you can encrypt each field of the student data
        with a key of your choice.
      </p>
      <div className="flex flex-row gap-4 items-center mx-auto">
        <Input
          label="Key"
          className="w-[200px]"
          onValueChange={(val) => setKey(val)}
        />
        <Button className="w-[160px]" color="primary" onClick={onSubmitHandler}>
          Encrypt
        </Button>
      </div>
      <p className="text-danger font-bold">
        IMPORTANT: The key you provide will not be stored. If you lose it, you
        will not be able to retrieve the original data.
      </p>
      <p className="text-xl font-bold mt-8">
        {`Below is the encrypted data (using RC4) using the key you provided:`}
      </p>
      <TranscriptTable
        data={encryptedData ? [encryptedData] : []}
        includeRSA
        includeHash
      />
      <p className="text-warning font-bold">
        The RSA public keys and student ID, however, are not encrypted in this
        step.
      </p>
    </div>
  );
}
