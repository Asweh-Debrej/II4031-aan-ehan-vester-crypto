"use client";

import { useContext } from "react";

import { Tooltip } from "@nextui-org/react";

import { CipherInputContext } from "@/lib/store/cipher-input-context";

export default function ErrorTooltip({
  children,
  warningTypes = [],
  className = "",
}) {
  const { data: dataTypes } = useContext(CipherInputContext);

  // For now, we only have one type of error, which is missing input
  const warnings = {
    "missing-input": {
      predicate: () => true,
      message: "Please fill in all the required fields.",
    },
    "missing-plaintext": {
      predicate: () => !dataTypes.plainText,
      message: "Please enter the plaintext.",
    },
    "missing-ciphertext": {
      predicate: () => !dataTypes.cipherText,
      message: "Please enter the ciphertext.",
    },
    "missing-key": {
      predicate: () => !dataTypes.key,
      message: "Please enter the key.",
    },
    "missing-multiplier": {
      predicate: () => !dataTypes.multiplier,
      message: "Please enter the multiplier.",
    },
    "missing-shift": {
      predicate: () => !dataTypes.shift,
      message: "Please enter the shift.",
    },
    "missing-plain-file": {
      predicate: () => !dataTypes.plainFile,
      message: "Please upload the plaintext file.",
    },
    "missing-cipher-file": {
      predicate: () => !dataTypes.cipherFile,
      message: "Please upload the ciphertext file.",
    },
  };

  const content = (
    <div>
      {warningTypes
        .filter((type) => warnings[type].predicate())
        .map((type) => (
          <div key={type}>{warnings[type].message}</div>
        ))}
    </div>
  );

  return (
    <Tooltip content={content} placement="top">
      <span className={className}>{children}</span>
    </Tooltip>
  );
}
