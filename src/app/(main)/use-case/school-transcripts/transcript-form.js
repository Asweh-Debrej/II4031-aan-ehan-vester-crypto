"use client";

import { example } from "./mock";

import { Divider, Spacer, spacer } from "@nextui-org/react";

import { useState } from "react";

import TranscriptInput from "./transcript-input";
import TranscriptHash from "./transcript-hash";
import EncryptSignature from "./transcript-sign";
import EncryptField from "./encrypt-field";
import SubmitDatabase from "./submit-database";
import RetrieveDatabase from "./retrieve-database";
import DecryptField from "./decrypt-field";
import HashValidate from "./hash-validate";
import DownloadTranscript from "./download-transcript";
import DecryptTranscript from "./decrypt-transcript";

export default function TranscriptsForm() {
  const [studentData, setStudentData] = useState(null);
  const [hash, setHash] = useState(null);
  const [signedHash, setSignedHash] = useState(null);
  const [rsaPublicKeys, setRsaPublicKeys] = useState(null);
  const [signedStudentData, setSignedStudentData] = useState(null);
  const [encryptedData, setEncryptedData] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [decryptedData, setDecryptedData] = useState(null);

  const onHashSign = (hash, rsaPublicKeys) => {
    setSignedHash(hash);
    setRsaPublicKeys(rsaPublicKeys);
    setSignedStudentData({
      hash,
      rsaPublicE: rsaPublicKeys.e,
      rsaPublicN: rsaPublicKeys.n,
      ...studentData,
    });
  };

  const onInputData = (data) => {
    setStudentData(data);
  };

  return (
    <>
      <p className="text-2xl font-bold">Step 1.1: Create Transcript Data</p>
      <TranscriptInput onSubmit={onInputData} />
      <Spacer y={16} />
      <Divider orientation="horizontal" className="w-full" />
      <p className="text-2xl font-bold">Step 1.2: Create Hash (Automated)</p>
      <TranscriptHash currentStudentData={studentData} onHash={setHash} />
      <Spacer y={16} />
      <Divider orientation="horizontal" className="w-full" />
      <p className="text-2xl font-bold">Step 1.3: Sign Your Hash</p>
      <EncryptSignature hash={hash} onSign={onHashSign} />
      <Spacer y={16} />
      <Divider orientation="horizontal" className="w-full" />
      <p className="text-2xl font-bold">Step 1.4: Encrypt Each Transcript Field</p>
      <EncryptField studentData={signedStudentData} onEncrypt={setEncryptedData} />
      <Spacer y={16} />
      <Divider orientation="horizontal" className="w-full" />
      <p className="text-2xl font-bold">Step 2: Submit Your Data To Our Database</p>
      <SubmitDatabase encryptedData={encryptedData} />
      <Spacer y={16} />
      <Divider orientation="horizontal" className="w-full" />
      <p className="text-2xl font-bold">Step 3: Retrieve Your Student Data</p>
      <RetrieveDatabase defaultData={encryptedData} onRetrieve={setSelectedData} />
      <Spacer y={16} />
      <Divider orientation="horizontal" className="w-full" />
      <p className="text-2xl font-bold">Step 4: Decrypt Your Data</p>
      <DecryptField studentData={selectedData} onDecrypt={setDecryptedData} />
      <Spacer y={16} />
      <Divider orientation="horizontal" className="w-full" />
      <p className="text-2xl font-bold">Step 5: Validate Hash</p>
      <HashValidate currentStudentData={decryptedData} />
      <Spacer y={16} />
      <Divider orientation="horizontal" className="w-full" />
      <p className="text-2xl font-bold">Step 6: Download Your Transcript</p>
      <DownloadTranscript studentData={decryptedData} />
      <Spacer y={16} />
      <Divider orientation="horizontal" className="w-full" />
      <p className="text-2xl font-bold">Step 7: Decrypt Your Transcript</p>
      <DecryptTranscript />
      <Spacer y={16} />
      <Divider orientation="horizontal" className="w-full" />
    </>
  );
}
