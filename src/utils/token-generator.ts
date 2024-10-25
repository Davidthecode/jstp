import { type TokenFormat } from "../types/index";

const NUMERIC_CHARS = "0123456789";
const ALPHA_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ALPHANUMERIC_CHARS = NUMERIC_CHARS + ALPHA_CHARS;

export const generateToken = (format: TokenFormat, length: number): string => {
  if (length < 4 || length > 12) {
    throw new Error("Length must be between 4 and 12");
  }

  switch (format) {
  case "numeric":
    return generateNumericToken(length);
  case "alphabetic":
    return generateAlphabeticToken(length);
  case "alphanumeric":
    return generateAlphanumericToken(length);
  default:
    throw new Error("Invalid token format");
  }
};

const generateNumericToken = (length: number): string => {
  return Array.from(
    { length },
    () => NUMERIC_CHARS.charAt(Math.floor(Math.random() * NUMERIC_CHARS.length))
  ).join("");
};

const generateAlphabeticToken = (length: number): string => {
  return Array.from(
    { length },
    () => ALPHA_CHARS.charAt(Math.floor(Math.random() * ALPHA_CHARS.length))
  ).join("");
};

const generateAlphanumericToken = (length: number): string => {
  // Ensure at least 1/3 numbers and 1/3 letters
  const minNumbers = Math.floor(length / 3);
  const minLetters = Math.floor(length / 3);
  const remainingLength = length - (minNumbers + minLetters);

  // Generate required numbers
  const numbers = Array.from(
    { length: minNumbers },
    () => NUMERIC_CHARS.charAt(Math.floor(Math.random() * NUMERIC_CHARS.length))
  );

  // Generate required letters
  const letters = Array.from(
    { length: minLetters },
    () => ALPHA_CHARS.charAt(Math.floor(Math.random() * ALPHA_CHARS.length))
  );

  // Generate remaining characters from full alphanumeric set
  const remaining = Array.from(
    { length: remainingLength },
    () => ALPHANUMERIC_CHARS.charAt(Math.floor(Math.random() * ALPHANUMERIC_CHARS.length))
  );

  // Combine all characters and shuffle them
  const token = [...numbers, ...letters, ...remaining]
    .sort(() => Math.random() - 0.5)
    .join("");

  return token;
};