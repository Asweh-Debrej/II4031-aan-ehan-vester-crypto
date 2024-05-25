// manual SHA3-256 implementation

// Keccak constants
const b = 1600;
const w = b / 25;
const nr = 24;
const ir = 1152;
const orc = 0x1f;

// SHA3-256 constants
const c = 512;
const d = 256;
const r = 1088;

// SHA3-256 round constants
const rc = [
  0x0000000000000001n, 0x0000000000008082n, 0x800000000000808an, 0x8000000080008000n,
  0x000000000000808bn, 0x0000000080000001n, 0x8000000080008081n, 0x8000000000008009n,
  0x000000000000008an, 0x0000000000000088n, 0x0000000080008009n, 0x000000008000000an,
  0x000000008000808bn, 0x800000000000008bn, 0x8000000000008089n, 0x8000000000008003n,
  0x8000000000008002n, 0x8000000000000080n, 0x000000000000800an, 0x800000008000000an,
  0x8000000080008081n, 0x8000000000008080n, 0x0000000080000001n, 0x8000000080008008n
];

// SHA3-256 round function
function keccak_f(state) {
    console.log("state: ", state);
  let round = 0;
  while (round < nr) {
    // theta
    let C = new Array(w).fill(0n);
    let D = new Array(w).fill(0n);
    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < w; y++) {
        // console.log("typeof state[x * 5 + y]: ", typeof state[x * 5 + y]);
        // console.log("state[x * 5 + y]: ", state[x * 5 + y]);
        // console.log("typeof C[y]: ", typeof C[y]);
        // console.log("C[y]: ", C[y]);
        C[y] ^= state[x * 5 + y];
      }
    }
    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < w; y++) {
        D[y] = C[(y + 4) % w] ^ ((C[(y + 1) % w] << 1n) | (C[(y + 1) % w] >> (w - 1n)));
      }
      for (let y = 0; y < w; y++) {
        for (let x = 0; x < 5; x++) {
          state[x * 5 + y] ^= D[y];
        }
      }
    }

    // rho and pi
    let x = 1;
    let y = 0;
    let current = state[x * 5 + y];
    for (let t = 0; t < 24; t++) {
      let next = state[y * 5 + ((2 * x + 3 * y) % 5)];
      state[y * 5 + ((2 * x + 3 * y) % 5)] = ((current << ((t + 1n) * (t + 2n) / 2n)) | (current >> (64n - (t + 1n) * (t + 2n) / 2n))) ^ rc[t];
      current = next;
      [x, y] = [y, (2 * x + 3 * y) % 5];
    }

    // chi
    for (let y = 0; y < 5; y++) {
      let T = new Array(5);
      for (let x = 0; x < 5; x++) {
        T[x] = state[x * 5 + y];
      }
      for (let x = 0; x < 5; x++) {
        state[x * 5 + y] = T[x] ^ ((~T[(x + 1) % 5]) & T[(x + 2) % 5]);
      }
    }

    // iota
    state[0] ^= rc[round];
    round++;
    }

    return state;
}

// SHA3-256 permutation
function sha3_256(message) {
  // pad message
  message = message.concat([0x06]);
  while (message.length % r) {
    message.push(0x00);
  }

  // initialize state
  let state = new Array(b / w).fill(0n);

  // absorb
  for (let i = 0; i < message.length; i += r) {
    for (let j = 0; j < r / w; j++) {
        console.log("state[j]: ", state[j]);
        console.log("w: ", w);
        console.log("typeof w: ", typeof w);
        console.log("message[i + j]: ", BigInt(message[i + j]));
      state[j] ^= BigInt.asUintN(w, BigInt(message[i + j]));
    }
    state = keccak_f(state);
  }

  // squeeze
  let hash = [];
  for (let i = 0; i < d / w; i++) {
    hash.push(Number(state[i]));
  }

  return hash;
}

// test
let message = "The quick brown fox jumps over the lazy dog";
let hash = sha3_256([...message].map(c => c.charCodeAt(0)));
console.log(hash.map(n => n.toString(16).padStart(16, "0")).join(""));
