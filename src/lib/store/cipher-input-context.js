"use client";

import { createContext, useState } from "react";

const defaultData = {
  plainText: "",
  cipherText: "",
  plainTextBase64: "",
  cipherTextBase64: "",
  key: "",
  transposeKey: "",
  multiplier: 1,
  shift: 1,
  plainFile: "",
  cipherFile: "",
};

const defaultKeyHandlerOptions = {
  onlyAlphabet: true,
};

let context = {
  data: defaultData,
  setPlainText: () => {},
  setCipherText: () => {},
  setPlainTextBase64: () => {},
  setCipherTextBase64: () => {},
  setKeyHandler: (options = defaultKeyHandlerOptions) => {},
  setTransposeKey: () => {},
  setMultiplier: () => {},
  setShift: () => {},
  setPlainFile: () => {},
  setCipherFile: () => {},
};

export const CipherInputContext = createContext(context);

export const CipherInputProvider = ({ children }) => {
  const [plainText, setPlainText] = useState("");
  const [cipherText, setCipherText] = useState("");
  const [plainTextBase64, setPlainTextBase64] = useState("");
  const [cipherTextBase64, setCipherTextBase64] = useState("");
  const [key, setKey] = useState("");
  const [transposeKey, setTransposeKey] = useState("");
  const [multiplier, setMultiplier] = useState(1);
  const [shift, setShift] = useState(1);
  const [plainFile, setPlainFile] = useState(null);
  const [cipherFile, setCipherFile] = useState(null);

  context = {
    data: {
      plainText,
      cipherText,
      plainTextBase64,
      cipherTextBase64,
      key,
      transposeKey,
      multiplier,
      shift,
      plainFile,
      cipherFile,
    },
    setPlainText: (text) => {
      setPlainText(text);
      setPlainTextBase64(btoa(text));
    },
    setCipherText: (text) => {
      setCipherText(text);
      setCipherTextBase64(btoa(text));
    },
    setPlainTextBase64: (text) => {
      try {
        const newText = atob(text);
        setPlainTextBase64(text);
        setPlainText(newText);
      } catch (error) {}
    },
    setCipherTextBase64: (text) => {
      try {
        const newText = atob(text);
        setCipherTextBase64(text);
        setCipherText(newText);
      } catch (error) {}
    },
    setKeyHandler:
      (options = defaultKeyHandlerOptions) =>
      (key) => {
        if (options.onlyAlphabet) {
          setKey(key.replace(/[^a-zA-Z]/g, "").toUpperCase());
        } else {
          setKey(key.toUpperCase());
        }
      },
    setTransposeKey,
    setMultiplier,
    setShift,
    setPlainFile,
    setCipherFile,
  };

  return (
    <CipherInputContext.Provider value={context}>
      {children}
    </CipherInputContext.Provider>
  );
};
