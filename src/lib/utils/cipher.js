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
  for (let i = 2; i < num; i++) if (num % i === 0) return false;
  return num > 1;
}
