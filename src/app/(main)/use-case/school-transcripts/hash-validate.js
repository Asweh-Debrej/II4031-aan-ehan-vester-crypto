"use client";

import { useMemo, useRef, useState } from "react";

import { Input, Button } from "@nextui-org/react";

import { hash } from "@/lib/cipher/sha3";
import { decrypt as rsaDecrypt } from "@/lib/cipher/rsa";

import { fromBase64 } from "js-base64";

const fieldsToHash = ["nim", "name", "courses"];
const courseFieldsToHash = ["code", "name", "grade", "credit"];

const SHA3 = (message) => {
  const hashedMessage = hash(message);
  return hashedMessage;
};

const unsignHash = (hash, publicKey) => {
  const unsignedHash = rsaDecrypt(fromBase64(hash), publicKey);
  return unsignedHash;
};

export default function HashValidate({ currentStudentData = null }) {
  const [useCustomKeys, setUseCustomKeys] = useState(false);
  const ERef = useRef(null);
  const NRef = useRef(null);
  const [customKeys, setCustomKeys] = useState({ e: null, n: null });
  const setKeys = useMemo(() => {
    return useCustomKeys ? customKeys : currentStudentData ? { e: currentStudentData.rsaPublicE, n: currentStudentData.rsaPublicN } : { e: null, n: null };
  }, [useCustomKeys, currentStudentData, customKeys]);

  const hashDatabase = currentStudentData
    ? unsignHash(currentStudentData.hash, setKeys)
    : null;

  let dataToHash = {};
  for (let key in currentStudentData) {
    if (fieldsToHash.includes(key)) {
      dataToHash[key] = currentStudentData[key];
    }

    if (key === "courses") {
      dataToHash[key] = currentStudentData[key].map((course) => {
        let courseData = {};
        for (let courseKey in course) {
          if (courseFieldsToHash.includes(courseKey)) {
            courseData[courseKey] = course[courseKey];
          }
        }
        return courseData;
      });
    }
  }

  const hashSHA3 = currentStudentData ? SHA3(JSON.stringify(dataToHash)) : null;

  const matchResult =
    hashDatabase !== null && hashSHA3 !== null && hashDatabase === hashSHA3;

  return (
    <div className="flex flex-col items-center gap-4 max-w-full">
      <div className="flex flex-row items-center gap-4 w-full">
        <p className="w-[480px] ">
          {`The hash in its column (decrypted using rsa public keys) is: `}
        </p>
        <p className="flex-1 font-bold text-secondary break-all break-words">
          {currentStudentData ? hashDatabase : "null"}
        </p>
      </div>
      <div className="flex flex-row items-center gap-4 w-full">
        <p className="w-[480px]">
          {`Your hash (step 4 fields hashed using SHA-3) is: `}
        </p>
        <p className="flex-1 font-bold text-secondary break-all break-words">
          {currentStudentData ? hashSHA3 : "null"}
        </p>
      </div>
      <div className="flex flex-row items-center gap-4 w-full">
        <p className="w-[480px]">{`The result of the comparison is: `}</p>
        <p
          className={`flex-1 font-bold break-all break-words ${
            matchResult ? "text-success" : "text-danger"
          }`}>
          {currentStudentData ? (matchResult ? "Match" : "No match") : "null"}
        </p>
      </div>
      <div className="flex flex-row items-center gap-4 w-full">
        <p className="w-[480px]">{`You may use custom public keys to see the result when using invalid keys.`}</p>
        <Input
          label="Public Key E"
          type="number"
          className="w-[200px]"
          size="sm"
          ref={ERef}
        />
        <Input
          label="Public Key N"
          type="number"
          className="w-[200px]"
          size="sm"
          ref={NRef}
        />
        <Button
          color="primary"
          className="w-[160px]"
          onClick={() => {
            if (!ERef.current.value || !NRef.current.value) {
              alert("Public keys are required");
              return;
            }

            setCustomKeys({
              e: ERef.current.value,
              n: NRef.current.value,
            });
            setUseCustomKeys(true);
          }}>
          Try
        </Button>
        <Button
          color="primary"
          className="w-[160px]"
          isDisabled={!useCustomKeys}
          onClick={() => {
            setUseCustomKeys(false);
          }}>
          Reset
        </Button>
      </div>
    </div>
  );
}
