"use client";

import { useState } from "react";

import { Input, Button } from "@nextui-org/react";

const fieldsToHash = ["nim", "name", "courses"];
const courseFieldsToHash = ["code", "name", "grade", "credit"];
import { keccak256 } from "js-sha3";
import { decrypt as rsaDecrypt } from "@/lib/cipher/rsa";
import { escape } from "lodash";

import { fromBase64 } from "js-base64";

const SHA3 = (message) => {
  const hashedMessage = keccak256(message);
  return hashedMessage;
};

const unsignHash = (hash, publicKey) => {
  const unsignedHash = rsaDecrypt(fromBase64(hash),
    publicKey);
  return unsignedHash;
};

export default function HashValidate({ currentStudentData = null }) {
  const hashDatabase = currentStudentData
    ? unsignHash(currentStudentData.hash, {
        e: currentStudentData.rsaPublicE,
        n: currentStudentData.rsaPublicN,
      })
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
        <p className="w-[480px]">
          {`The hash in its column (decrypted using rsa public keys) is: `}
          &nbsp;
        </p>
        <p className="font-bold text-secondary">
          {currentStudentData ? hashDatabase : "null"}
        </p>
      </div>
      <div className="flex flex-row items-center gap-4 w-full">
        <p className="w-[480px]">
          {`Your hash (step 4 fields hashed using SHA-3) is: `}
        </p>
        <p className="font-bold text-secondary">
          {currentStudentData ? hashSHA3 : "null"}
        </p>
      </div>
      <div className="flex flex-row items-center gap-4 w-full">
        <p className="w-[480px]">{`The result of the comparison is: `}</p>
        <p
          className={`font-bold ${
            matchResult ? "text-success" : "text-danger"
          }`}>
          {currentStudentData ? (matchResult ? "Match" : "No match") : "null"}
        </p>
      </div>
    </div>
  );
}
