"use client";

import { useContext } from "react";

import { Tooltip } from "@nextui-org/react";

import { CipherInputContext } from "@/lib/store/cipher-input-context";

export default function ErrorTooltip({
  children,
  warningTypes = [],
  className = "",
  data,
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
    "missing-rsa-public-key": {
      predicate: (data) => !data.e || !data.n,
      message: "Please generate keys first.",
    },
    "missing-received-public-key": {
      predicate: (data) => !data.e || !data.n,
      message: "This side has not received the public key yet.",
    },
    "empty-message": {
      predicate: (data) => data.message === "",
      message: "Please enter a message.",
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
    "missing-transpose-key": {
      predicate: () => !dataTypes.transposeKey,
      message: "Please enter the transpose key.",
    },
  };

  const content = (
    <div>
      {warningTypes
        .filter((type) => warnings[type].predicate(data))
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
