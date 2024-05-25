"use client";

import { useState } from "react";

import { Input, Button, Tooltip } from "@nextui-org/react";

const defaultRSAData = {
  p: 1,
  q: 1,
  privateKey: {
    d: undefined,
    n: undefined,
  },
  publicKey: {
    e: undefined,
    n: undefined,
  },
};

const generateKeys = (p, q) => {
  return {
    publicKey: {
      e: 1,
      n: 1,
    },
    privateKey: {
      d: 1,
      n: 1,
    },
  };
};

const signHash = (hash, privateKey) => {
  return hash;
};

export default function TranscriptSign({
  hash = "null",
  onSign = (hash, publicKey) => {},
}) {
  const [rsaData, setRSAData] = useState(defaultRSAData);

  return (
    <div className="flex flex-col items-center gap-4 w-fit">
      <div className="flex flex-row gap-4 mb-8 items-center mx-auto">
        <Input
          label="P"
          type="number"
          className="w-[200px]"
          onValueChange={(val) => setRSAData({ ...rsaData, p: val })}
        />
        <Input
          label="Q"
          type="number"
          className="w-[200px]"
          onValueChange={(val) => setRSAData({ ...rsaData, q: val })}
        />
        <Button
          className="w-[160px]"
          color="primary"
          size="lg"
          onClick={() => {
            const keys = generateKeys(rsaData.p, rsaData.q);
            setRSAData({
              ...rsaData,
              ...keys,
            });

            onSign(
              signHash(hash, keys.privateKey), keys.publicKey
            );
          }}
          isDisabled={
            rsaData.p === 1 ||
            rsaData.q === 1 ||
            hash === "null" ||
            hash === ""
          }>
          Generate Keys
        </Button>
      </div>
      <p className="text-xl font-bold">Your generated keys:</p>
      <div className="flex flex-row gap-4 items-center w-full">
        <p className="mr-8 w-[280px]">Public Key:</p>
        <Input
          label="E"
          type="number"
          className="w-[200px]"
          size="sm"
          value={rsaData.publicKey.e}
          isReadOnly
        />
        <Input
          label="N"
          type="number"
          className="w-[200px]"
          size="sm"
          value={rsaData.publicKey.n}
          isReadOnly
        />
      </div>
      <div className="flex flex-row gap-4 items-center w-full">
        <p className="mr-8 w-[280px]">Private Key:</p>
        <Input
          label="D"
          type="number"
          className="w-[200px]"
          size="sm"
          value={rsaData.privateKey.d}
          isReadOnly
        />
        <Input
          label="N"
          type="number"
          className="w-[200px]"
          size="sm"
          value={rsaData.privateKey.n}
          isReadOnly
        />
      </div>
      <div className="flex flex-row gap-4 items-center w-full">
        <p className="mr-8 w-[280px]">{`Signed Hash (using RSA): `}</p>
        <p className="font-bold">
          {hash === "null" ? "null" : signHash(hash, rsaData.privateKey)}
        </p>
      </div>
    </div>
  );
}
