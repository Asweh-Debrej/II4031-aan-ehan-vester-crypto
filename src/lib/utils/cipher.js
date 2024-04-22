export const explode = (str, length = 5) => {
  return str
    .match(new RegExp(`.{1,${length}}`, "g"))
    .join(" ")
    .toUpperCase();
};

export const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// This allows for negative numbers to be handled properly
export const mod = (m, n) => {
  return ((m % n) + n) % n;
};

export const modInverse = (a, m) => {
  a = a % m;
  for (let x = 1; x < m; x++) {
    if ((a * x) % m == 1) {
      return x;
    }
  }
  return 1;
};

export const phi = (p, q) => {
  return (p - 1) * (q - 1);
};

export const gcd = (a, b) => {
  if (b == 0) {
    return a;
  }
  return gcd(b, a % b);
};

export const isPrime = (num) => {
  if (num <= 1) {
    return false;
  }

  const bigNum = BigInt(num);
  const s = Math.sqrt(num);
  let y = 0;
  for (let i = 2; i <= s; i++) {
    if (bigNum % BigInt(i) === 0) {
      return false;
    }
    y++
  }

  console.log(y);
  console.log(s);

  return true;
}

export const modPow = (base, exp, mod) => {
  if (exp == 0) {
    return 1;
  }
  if (exp % 2 == 0) {
    return modPow((base * base) % mod, exp / 2, mod);
  }
  return (base * modPow(base, exp - 1, mod)) % mod;
}
