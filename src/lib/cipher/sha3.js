import jsSHA3 from "js-sha3";

export const hashSHA3 = (message) => {
  const hash = jsSHA3.keccak_256(message);
  return hash;
};
