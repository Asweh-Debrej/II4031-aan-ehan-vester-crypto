"use client";

import { createContext, useState } from "react";

const defaultData = {
  plainText: "",
  cipherText: "",
  key: "",
};

let context = {
  data: defaultData,
  setPlainText: () => {},
  setCipherText: () => {},
  setKey: () => {},
};

export const CipherInputContext = createContext(context);

export const CipherInputProvider = ({ children }) => {
  const [plainText, setPlainText] = useState("");
  const [cipherText, setCipherText] = useState("");
  const [key, setKey] = useState("");

  context = {
    data: { plainText, cipherText, key },
    setPlainText,
    setCipherText,
    setKey,
  };

  return (
    <CipherInputContext.Provider value={context}>
      {children}
    </CipherInputContext.Provider>
  );
};
