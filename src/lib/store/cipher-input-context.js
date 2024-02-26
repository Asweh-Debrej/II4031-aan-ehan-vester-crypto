"use client";

import { createContext, useState } from "react";

const defaultData = {
  plainText: "",
  cipherText: "",
  key: "",
  multiplier: 1,
  shift: 1,
};

let context = {
  data: defaultData,
  setPlainText: () => {},
  setCipherText: () => {},
  setKey: () => {},
  setMultiplier: () => {},
  setShift: () => {},
};

export const CipherInputContext = createContext(context);

export const CipherInputProvider = ({ children }) => {
  const [plainText, setPlainText] = useState("");
  const [cipherText, setCipherText] = useState("");
  const [key, setKey] = useState("");
  const [multiplier, setMultiplier] = useState(1);
  const [shift, setShift] = useState(1);

  context = {
    data: { plainText, cipherText, key, multiplier, shift },
    setPlainText,
    setCipherText,
    setKey,
    setMultiplier,
    setShift,
  };

  return (
    <CipherInputContext.Provider value={context}>
      {children}
    </CipherInputContext.Provider>
  );
};
