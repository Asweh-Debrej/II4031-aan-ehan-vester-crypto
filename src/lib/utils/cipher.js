"use client";

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

export const bigSQRT = (value) => {
  if (value < 0n) {
    throw "square root of negative numbers is not supported";
  }

  if (value < 2n) {
    return value;
  }

  let x = value;
  let y = (x + 1n) / 2n;
  while (y < x) {
    x = y;
    y = (x + value / x) / 2n;
  }
  return x;
};

export const isPrime = (num) => {
  if (num <= 1) {
    return false;
  }

  const bigNum = BigInt(num);

  const s = bigSQRT(bigNum);
  let y = BigInt(0);
  for (let i = BigInt(2); i <= s; i++) {
    if (bigNum % i === BigInt(0)) {
      return false;
    }
    y++;
  }

  return true;
};

export const modPow = (base, exp, mod) => {
  if (exp < 0) {
    return modPow(modInverse(base, mod), -exp, mod);
  }
  if (exp == 0) {
    return 1;
  }
  if (exp % 2 == 0) {
    return modPow((base * base) % mod, exp / 2, mod);
  }
  return (base * modPow(base, exp - 1, mod)) % mod;
};

export const nilaiToIp = (nilai) => {
  if (nilai == "A") {
    return 4;
  } else if (nilai == "AB") {
    return 3.5;
  } else if (nilai == "B") {
    return 3;
  } else if (nilai == "BC") {
    return 2.5;
  } else if (nilai == "C") {
    return 2;
  } else if (nilai == "D") {
    return 1;
  } else {
    return 0;
  }
};

export const studentToGPA = (student) => {
  const gradeToPoint = {
    A: 4.0,
    AB: 3.5,
    B: 3.0,
    BC: 2.5,
    C: 2.0,
    D: 1.0,
    "-": 0,
  };

  let totalGradePoints = 0;
  let totalCredits = 0;

  student.courses.forEach((course) => {
    let gradePoint = gradeToPoint[course.grade];
    totalGradePoints += gradePoint * Number(course.credit);
    totalCredits += course.credit;
  });

  let gpa = totalGradePoints / totalCredits;
  return gpa.toFixed(2);
};

export const totalCredit = (student) => {
  let totalCredits = 0;

  student.courses.forEach((course) => {
    totalCredits += course.credit;
  });
  return totalCredits;
};
