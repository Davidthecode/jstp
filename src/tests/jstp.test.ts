import { generateToken } from "../utils/token-generator";
import { type TokenFormat } from "../types";

describe("Token generation", () => {
  // Test valid formats
  test.each([
    ["numeric", 6, /^[0-9]+$/],
    ["alphabetic", 6, /^[A-Z]+$/],
    ["alphanumeric", 6, /^[0-9A-Z]+$/],
  ])("it should generate a token based on the specified format and length", (format, length, pattern) => {
    const token = generateToken(format as TokenFormat, length);

    expect(token.length).toBe(length);
    expect(token).toMatch(pattern);
  });

  // Test different lengths
  test.each([4, 6, 8, 12])("it should generate token of specified length", (length) => {
    const token = generateToken("numeric", length);
    expect(token.length).toBe(length);
  });

  // Test uniqueness
  test("it should generate unique tokens", () => {
    const tokens = new Set();
    for (let i = 0; i < 100; i++) {
      tokens.add(generateToken("numeric", 6));
    }
    // If all tokens are unique, the set size should be 100
    expect(tokens.size).toBe(100);
  });

  // Test error cases
  describe("error cases", () => {
    test.each([
      [3, "Length must be between 4 and 12"],
      [13, "Length must be between 4 and 12"],
    ])("it should throw an error for invalid length", (length, expectedError) => {
      expect(() => generateToken("numeric", length)).toThrow(expectedError);
    });

    test("it should throw an error for invalid format", () => {
      expect(() =>
        generateToken("invalid" as TokenFormat, 6)
      ).toThrow("Invalid token format");
    });
  });


  // Test token composition
  describe("token composition", () => {
    test("numeric tokens should only contain numbers", () => {
      const token = generateToken("numeric", 6);
      expect(token).toMatch(/^[0-9]+$/);
    });

    test("alphabetic tokens should only contain uppercase letters", () => {
      const token = generateToken("alphabetic", 6);
      expect(token).toMatch(/^[A-Z]+$/);
    });

    test("alphanumeric tokens should contain both letters and numbers", () => {
      // Generate multiple tokens to ensure we get mixed characters
      let hasNumbers = false;
      let hasLetters = false;

      for (let i = 0; i < 100; i++) {
        const token = generateToken("alphanumeric", 6);
        if (/[0-9]/.test(token)) hasNumbers = true;
        if (/[A-Z]/.test(token)) hasLetters = true;
        if (hasNumbers && hasLetters) break;
      }

      expect(hasNumbers).toBe(true);
      expect(hasLetters).toBe(true);
    });
  });
});