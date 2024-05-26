"use client";

import { useState } from "react";

import { Input, Button } from "@nextui-org/react";

const fieldsToHash = ["nim", "name", "courses"];
const courseFieldsToHash = ["code", "name", "grade", "credit"];

const SHA3 = (message) => {
  return message;
};

const unsignHash = (hash, publicKey) => {
  return hash;
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
      <p className="mr-auto">
        {`The hash stored in the database (decrypted using rsa public keys) is: `}
        <span className="font-bold text-secondary">
          {currentStudentData ? hashDatabase : "null"}
        </span>
      </p>
      <p className="mr-auto">
        {`Your hash (using SHA-3) is: `}
        <span className="font-bold text-secondary">
          {currentStudentData ? hashSHA3 : "null"}
        </span>
      </p>
      <p className="mr-auto">
        {`The result of the comparison is: `}
        <span
          className={`font-bold ${
            matchResult ? "text-success" : "text-danger"
          }`}>
          {currentStudentData ? (matchResult ? "Match" : "No match") : "null"}
        </span>
      </p>
    </div>
  );
}
