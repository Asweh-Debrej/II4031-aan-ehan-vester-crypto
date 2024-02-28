import { useContext, useRef } from "react";

import { Button } from "@nextui-org/react";

import { CipherInputContext } from "@/lib/store/cipher-input-context";
import { base64StringToBlob, binaryStringToBlob } from "blob-util";
import { extension } from "mime-types";

const handleUpload = (fileHandler) => (e) => fileHandler(e.target.files[0]);

export default function FileForm({ setCurrentSuccess, raw = false }) {
  const {
    data,
    setPlainText,
    setCipherText,
    setPlainFile,
    setCipherFile,
  } = useContext(CipherInputContext);

  const handlePlainFile = (file) => {
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileContent = e.target.result;
        setPlainText(fileContent);
      };

      if (raw) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }

      setPlainFile(file);
      setCurrentSuccess("plainFile");
    }
  };

  const handleCipherFIle = (file) => {
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileContent = e.target.result;
        setCipherText(fileContent);
      };

      reader.readAsText(file);
      setCipherFile(file);
      setCurrentSuccess("cipherFile");
    }
  };

  const handleSavePlaintext = () => {
    const brokenFile = data.plainText; // e.g. data:application/octet-stream;base64,content

    const extensionType = extension(brokenFile.split(";")[0].split(":")[1]);
    const content = brokenFile.split(",")[1];

    let blob = null;

    if (raw && extensionType && content) {
      blob = base64StringToBlob(content, extensionType);
      savePlaintextFile.current.download = `plaintext.${extensionType}`;
    } else {
      blob = new Blob([brokenFile], { type: "text/plain" });
      savePlaintextFile.current.download = "plaintext.txt";
    }

    savePlaintextFile.current.href = URL.createObjectURL(blob);
    savePlaintextFile.current.href = savePlaintextFile.current.click();
  };

  const handleSaveCiphertext = () => {
    const brokenFile = data.cipherText;

    const extensionType = raw ? "application/octet-stream" : "text/plain";

    const blob = new Blob([brokenFile], { type: extensionType });

    saveCiphertextFile.current.href = URL.createObjectURL(blob);
    saveCiphertextFile.current.download = raw ? "encrypted.AAN" : "ciphertext.txt";
    saveCiphertextFile.current.click();
  };

  const inputPlaintextFile = useRef(null);
  const savePlaintextFile = useRef(null);
  const inputCiphertextFile = useRef(null);
  const saveCiphertextFile = useRef(null);
  return (
    <>
      <div className="flex flex-row gap-4 items-center justify-center w-full">
        <Button
          auto
          onClick={() => {
            inputPlaintextFile.current.click();
          }}
          className="w-full rounded-md">
          Upload Plaintext
        </Button>
        <Button
          auto
          onClick={handleSavePlaintext}
          className="w-full rounded-md"
          isDisabled={!data.plainText}>
          Save Plaintext
        </Button>
        <Button
          auto
          onClick={() => {
            inputCiphertextFile.current.click();
          }}
          className="w-full rounded-md">
          Upload Ciphertext
        </Button>
        <Button
          auto
          onClick={handleSaveCiphertext}
          className="w-full rounded-md"
          isDisabled={!data.cipherText}>
          Save Ciphertext
        </Button>
      </div>
      <div className="flex flex-row gap-4 items-center justify-center w-full">
        <Button
          color="success"
          className={`w-full rounded-md ${
            data.plainFile ? "visible" : "invisible"
          }`}
          onClick={() => {
            handlePlainFile(data.plainFile);
          }}>
          Open &quot;{data.plainFile?.name || "No file selected"}&quot; as
          plaintext
        </Button>
        <Button
          color="success"
          className={`w-full rounded-md ${
            data.cipherFile ? "visible" : "invisible"
          }`}
          onClick={() => {
            handleCipherFIle(data.cipherFile);
          }}>
          Open &quot;{data.cipherFile?.name || "No file selected"}&quot; as
          ciphertext
        </Button>
      </div>
      <input
        type="file"
        ref={inputPlaintextFile}
        className="hidden"
        onChange={handleUpload(handlePlainFile)}
      />
      <input
        type="file"
        ref={inputCiphertextFile}
        className="hidden"
        onChange={handleUpload(handleCipherFIle)}
      />
      <a ref={savePlaintextFile} className="hidden" download />
      <a ref={saveCiphertextFile} className="hidden" download />
    </>
  );
}
