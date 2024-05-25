"use client";

import { useState, useEffect } from "react";

import { Input, Button } from "@nextui-org/react";
import TranscriptTable from "./transcript-table";

const SHA3 = (message) => {
  return message;
};

export default function TranscriptHash({
  currentStudentData = null,
  onHash = (hash) => {},
}) {
  const hashSHA3 = currentStudentData ? SHA3(JSON.stringify(currentStudentData)) : null;

  useEffect(() => {
    onHash(hashSHA3);
  }, [hashSHA3, onHash]);

  return (
    <div className="flex flex-col items-center gap-4 max-w-full">
      <p>{`review the data you've created below`}</p>
      <TranscriptTable data={currentStudentData ? [currentStudentData] : []} />
      <p className="mr-auto">
        {`Your hash (using SHA-3) is: `}
        <span className="font-bold">
          {currentStudentData ? hashSHA3 : "null"}
        </span>
      </p>
    </div>
  );
}
