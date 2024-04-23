"use client";

import { createContext, useState, useReducer } from "react";
import update from "immutability-helper";

const defaultRSAData = {
  p: 1,
  q: 1,
  generatedPrivateKey: {
    d: undefined,
    n: undefined,
  },
  generatedPublicKey: {
    e: undefined,
    n: undefined,
  },
  recievedPublicKey: {
    e: undefined,
    n: undefined,
  },
};

const defaultData = {
  plainText: "",
  cipherText: "",
  plainTextBase64: "",
  cipherTextBase64: "",
  key: "",
  transposeKey: "",
  multiplier: 1,
  shift: 1,
  plainFile: null,
  cipherFile: null,
  rsa: {
    left: defaultRSAData,
    right: defaultRSAData,
  },
  chat: {},
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
  setRSAP: (object, p) => {},
  setRSAQ: (object, q) => {},
  setRSAGeneratedKeys: (object, keys) => {},
  setRSARecievedPublicKey: (object, key) => {},
  pushMessage: (sender, receiver, message, type = "text", fileName = "") => {},
  setChatDecrypted: (id, decrypted) => {},
  revertChat: (id) => {},
  toggleBase64: (id) => {},
};

let chatLength = 0;

// chat = {
//   id: {
//     id: number,
//     sender: string,
//     receiver: string,
//     decrypted: string | file,
//     original: string | file,
//     status: "original" | "decrypted",
//     type: "file" | "text",
//     fileName: string,
//     useBase64: boolean,
//   },
// }

function chatReducer(state, action) {
  switch (action.type) {
    case "pushMessage":
      const id = ++chatLength;
      const newPayload = {
        id,
        sender: action.sender,
        receiver: action.receiver,
        decrypted: "",
        original: action.message,
        status: "original",
        type: action.contentType || "text",
        fileName: action.fileName || "",
        useBase64: true,
      };

      const newState = {
        ...state,
        [id]: newPayload,
      };
      return newState;

    case "setDecrypted":
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          decrypted: action.decrypted,
          status: "decrypted",
        },
      };

    case "revert":
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          status: "original",
        },
      };

    case "toggleBase64":
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          useBase64: !state[action.id].useBase64,
        },
      };

    default:
      return state;
  }
}

export const CipherInputContext = createContext(context);

export const CipherInputProvider = ({ children }) => {
  const [plainText, setPlainText] = useState(defaultData.plainText);
  const [cipherText, setCipherText] = useState(defaultData.cipherText);
  const [plainTextBase64, setPlainTextBase64] = useState(
    defaultData.plainTextBase64
  );
  const [cipherTextBase64, setCipherTextBase64] = useState(
    defaultData.cipherTextBase64
  );
  const [key, setKey] = useState(defaultData.key);
  const [transposeKey, setTransposeKey] = useState(defaultData.transposeKey);
  const [multiplier, setMultiplier] = useState(defaultData.multiplier);
  const [shift, setShift] = useState(defaultData.shift);
  const [plainFile, setPlainFile] = useState(defaultData.plainFile);
  const [cipherFile, setCipherFile] = useState(defaultData.cipherFile);
  const [rsa, setRSA] = useState(defaultData.rsa);

  const [chat, dispatchChat] = useReducer(chatReducer, defaultData.chat);

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
      rsa,
      chat,
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
    setRSAP: (object, p) => {
      // setRSA(update(rsa, { [object]: { p: { $set: p } } }));
      const newRSA = { ...rsa, [object]: { ...rsa[object], p: p } };
      setRSA(newRSA);
    },
    setRSAQ: (object, q) => {
      setRSA(update(rsa, { [object]: { q: { $set: q } } }));
    },
    setRSAGeneratedKeys: (object, keys) => {
      setRSA(
        update(rsa, {
          [object]: {
            generatedPrivateKey: { $set: keys.privateKey },
            generatedPublicKey: { $set: keys.publicKey },
          },
        })
      );
    },
    setRSARecievedPublicKey: (object, key) => {
      setRSA(update(rsa, { [object]: { recievedPublicKey: { $set: key } } }));
    },
    pushMessage: (sender, receiver, message, type = "text", fileName = "") => {
      dispatchChat({
        type: "pushMessage",
        sender,
        receiver,
        message,
        contentType: type,
        fileName,
      });
    },
    setChatDecrypted: (id, decrypted) => {
      dispatchChat({ type: "setDecrypted", id, decrypted });
    },
    revertChat: (id) => {
      dispatchChat({ type: "revert", id });
    },
    toggleBase64: (id) => {
      dispatchChat({ type: "toggleBase64", id });
    },
  };

  return (
    <CipherInputContext.Provider value={context}>
      {children}
    </CipherInputContext.Provider>
  );
};
