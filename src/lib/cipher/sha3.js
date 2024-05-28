const KECCAK_ROUNDS = 24;
const KECCAK_RC = [
  0x00000001, 0x00008082, 0x0000808a, 0x80008000, 0x0000808b, 0x80000001,
  0x80008081, 0x00008009, 0x0000008a, 0x00000088, 0x80008009, 0x8000000a,
  0x8000808b, 0x0000008b, 0x00008089, 0x00008003, 0x00008002, 0x00000080,
  0x0000800a, 0x8000000a, 0x80008081, 0x00008080, 0x80000001, 0x80008008,
];

const ROTL = (x, y) => {
  return (x << y) | (x >>> (32 - y));
};

const keccakPad = (M, r) => {
  const q = r - (M.length % r);
  if (q === 1) {
    return M.concat([0x81]);
  }
  return M.concat([0x01])
    .concat(new Array(q - 2).fill(0))
    .concat([0x80]);
};

const keccakTheta = (A) => {
  const C = new Array(5);
  const D = new Array(5);

  for (let x = 0; x < 5; x++) {
    C[x] = A[x] ^ A[x + 5] ^ A[x + 10] ^ A[x + 15] ^ A[x + 20];
  }

  for (let x = 0; x < 5; x++) {
    D[x] = C[(x + 4) % 5] ^ ROTL(C[(x + 1) % 5], 1);
  }

  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
      A[x + 5 * y] ^= D[x];
    }
  }
};

const keccakRho = (A) => {
  const RHO_OFFSETS = [
    0, 1, 62, 28, 27, 36, 44, 6, 55, 20, 3, 10, 43, 25, 39, 41, 45, 15, 21, 8,
    18, 2, 61, 56, 14,
  ];

  for (let i = 0; i < 25; i++) {
    A[i] = ROTL(A[i], RHO_OFFSETS[i]);
  }
};

const keccakPi = (A) => {
  const B = new Array(25);

  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
      B[y + 5 * ((2 * x + 3 * y) % 5)] = A[x + 5 * y];
    }
  }

  for (let i = 0; i < 25; i++) {
    A[i] = B[i];
  }
};

const keccakChi = (A) => {
  const B = new Array(25);

  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
      B[x + 5 * y] =
        A[x + 5 * y] ^ (~A[((x + 1) % 5) + 5 * y] & A[((x + 2) % 5) + 5 * y]);
    }
  }

  for (let i = 0; i < 25; i++) {
    A[i] = B[i];
  }
};

const keccakIota = (A, round) => {
  A[0] ^= KECCAK_RC[round];
};

const keccakF1600 = (A) => {
  for (let round = 0; round < KECCAK_ROUNDS; round++) {
    keccakTheta(A);
    keccakRho(A);
    keccakPi(A);
    keccakChi(A);
    keccakIota(A, round);
  }
};

export const hash = (message, outputLength = 256) => {
  const r = 1600 - 2 * outputLength;
  let M = message.split("").map((c) => c.charCodeAt(0));

  M = keccakPad(M, r);

  const state = new Array(25).fill(0);

  for (let i = 0; i < M.length; i += r) {
    for (let j = 0; j < r; j += 8) {
      state[j / 8] ^=
        M[i + j] |
        (M[i + j + 1] << 8) |
        (M[i + j + 2] << 16) |
        (M[i + j + 3] << 24) |
        (M[i + j + 4] << 32) |
        (M[i + j + 5] << 40) |
        (M[i + j + 6] << 48) |
        (M[i + j + 7] << 56);
    }

    keccakF1600(state);
  }

  const res = [];
  for (let i = 0; res.length < outputLength / 8; i++) {
    const t = state[i % 25];
    res.push(
      t & 0xff,
      (t >> 8) & 0xff,
      (t >> 16) & 0xff,
      (t >> 24) & 0xff,
      (t >> 32) & 0xff,
      (t >> 40) & 0xff,
      (t >> 48) & 0xff,
      (t >> 56) & 0xff
    );
  }

  return res
    .slice(0, outputLength / 8)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};
