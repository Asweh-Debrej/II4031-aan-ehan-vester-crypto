"use client";

import { useRef, useState } from "react";

import { Input, Button, Tooltip } from "@nextui-org/react";
import { mod, modInverse, phi, gcd, isPrime, modPow } from "@/lib/utils/cipher";
import InputError from "@/lib/error/input-error";

import { generateKeys as rsaGenKeys, encrypt } from "@/lib/cipher/rsa";
import { set } from "lodash";

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
  if (!p) {
    throw new Error("p is required");
  } else if (!isPrime(p)) {
    throw new Error("p must be a prime number");
  }

  if (!q) {
    throw new Error("q is required");
  } else if (!isPrime(q)) {
    throw new Error("q must be a prime number");
  }

  const n = p * q;
  const phiN = phi(p, q);
  let e = 2;
  while (e < phiN) {
    if (gcd(e, phiN) === 1) {
      break;
    }
    e++;
  }
  const d = modInverse(e, phiN);
  return { publicKey: { e, n }, privateKey: { d, n } };
};

const signHash = (hash, privateKey) => {
  const signedHash = encrypt(hash, privateKey);
  return btoa(signedHash);
};

export default function TranscriptSign({
  hash = "null",
  onSign = (hash, publicKey) => {},
}) {
  const [rsaData, setRsaData] = useState(defaultRSAData); // { p, q, privateKey, publicKey }
  const [signedHash, setSignedHash] = useState("null");

  return (
    <div className="flex flex-col items-center gap-4 w-fit">
      <div className="flex flex-row gap-4 mb-8 items-center mx-auto">
        <Input
          label="P"
          type="number"
          className="w-[200px]"
          onValueChange={(val) => {
            setRsaData({ ...rsaData, p: Number(val) });
          }}
        />
        <Input
          label="Q"
          type="number"
          className="w-[200px]"
          onValueChange={(val) => {
            setRsaData({ ...rsaData, q: Number(val) });
          }}
        />
        <Button
          className="w-[160px]"
          color="primary"
          size="lg"
          onClick={() => {
            if (rsaData.p === 1 || rsaData.q === 1) {
              alert("Please input p and q values");
              return;
            }

            console.log("rsaData aan", rsaData);

            try {
              const keys = generateKeys(rsaData.p, rsaData.q);
              setRsaData({ ...rsaData, ...keys });

            } catch (err) {
              alert(err.message);
              return;
            }

            try {
              const signed = signHash(hash, rsaData.privateKey);
              setSignedHash(signed);
              onSign(signed, rsaData.publicKey);
            } catch (err) {
              console.error(err);
              if (err instanceof InputError) {
                const messages = err.errors.map((e) => e.message).join("\n");
                alert(messages);

                return;
              } else {
                alert(err.message);
                return;
              }
            }

          }}
          isDisabled={
            rsaData.p === 1 || rsaData.q === 1 || rsaData.p === undefined || rsaData.q === undefined || hash === "null" || hash === undefined || hash === ""
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
        <p className="font-bold break-all break-words">{signedHash}</p>
      </div>
    </div>
  );
}
