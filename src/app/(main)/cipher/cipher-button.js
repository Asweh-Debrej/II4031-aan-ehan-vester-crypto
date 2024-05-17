"use client";

import { useContext } from "react";

import { Button } from "@nextui-org/react";
import { CipherInputContext } from "@/lib/store/cipher-input-context";
import ErrorTooltip from "./error-tooltip";
import { reduce } from "lodash";

export default function CipherButton({
  onEncrypt = () => {},
  onDecrypt = () => {},
  encryptWarningTypes = [],
  decryptWarningTypes = [],
  additionalRequiredFields = ["key"],
}) {
  const { data } = useContext(CipherInputContext);

  return (
    <div className="flex flex-row gap-4 items-center justify-center w-full">
      <ErrorTooltip
        warningTypes={encryptWarningTypes}
        className="w-full">
        <Button
          auto
          onClick={onEncrypt}
          className="w-full rounded-md bg-amber-600"
          isDisabled={data.plainText === "" || reduce(
            additionalRequiredFields,
            (acc, field) => acc || data[field] === "",
            false
          )}>
          Encrypt ==&gt;
        </Button>
      </ErrorTooltip>
      <ErrorTooltip
        warningTypes={decryptWarningTypes}
        className="w-full">
        <Button
          auto
          onClick={onDecrypt}
          className="w-full rounded-md bg-amber-600"
          isDisabled={data.cipherText === "" || reduce(
            additionalRequiredFields,
            (acc, field) => acc || data[field] === "",
            false
          )}>
          &lt;== Decrypt
        </Button>
      </ErrorTooltip>
    </div>
  );
}
