"use client";

import { useState, useEffect } from "react";

import { Button, Input } from "@nextui-org/react";
import TranscriptTable from "./transcript-table";

import { decrypt } from "@/lib/cipher/rc4";
import { fromBase64 } from "js-base64";

const fieldsToDecrypt = ["name", "courses", "gpa", "hash"];

const decryptRC4 = (message, key) => {
  const stringified = fromBase64(message);
  const decrypted = decrypt(stringified, key);
  return decrypted;
};

const decryptData = (data, rc4Key, fields = []) => {
  let decryptedData = {};
  for (let key in data) {
    if (!fields.includes(key) && fields.length) {
      decryptedData[key] = data[key];
      continue;
    }

    if (data[key] instanceof Array) {
      decryptedData[key] = data[key].map((item) => decryptData(item, rc4Key, []));
    } else if (data[key] instanceof Object) {
      decryptedData[key] = decryptData(data[key], rc4Key, fields);
    } else {
      decryptedData[key] = decryptRC4(data[key], rc4Key);
    }
  }

  return decryptedData;
};

export default function DecryptField({
  studentData = null,
  onDecrypt = (data) => {},
}) {
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

    const decryptedData = decryptData(studentData, key, fieldsToDecrypt);

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
        <Button color="primary" className="w-[160px]" onClick={onSubmitHandler}>
          Decrypt
        </Button>
      </div>
      <p>{`Decrypted data will be shown in the table below`}</p>
      <TranscriptTable data={decrypted ? [decrypted] : []} includeHash />
    </div>
  );
}
