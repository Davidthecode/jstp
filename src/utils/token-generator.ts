import { TokenFormat } from "../types/index";

class TokenGenerator {
  private NUMERIC_CHARS = "0123456789";
  private ALPHA_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  private ALPHANUMERIC_CHARS = this.NUMERIC_CHARS + this.ALPHA_CHARS;

  public generateToken(format: TokenFormat, length: number): string {
    if (length < 4 || length > 12) {
      throw new Error("Length must be between 4 and 12");
    }

    switch (format) {
    case "numeric":
      return this.generateNumericToken(length);
    case "alphabetic":
      return this.generateAlphabeticToken(length);
    case "alphanumeric":
      return this.generateAlphanumericToken(length);
    default:
      throw new Error("Invalid token format");
    }
  }

  private generateNumericToken(length: number): string {
    return Array.from(
      { length },
      () => this.NUMERIC_CHARS.charAt(Math.floor(Math.random() * this.NUMERIC_CHARS.length))
    ).join("");
  }

  private generateAlphabeticToken(length: number): string {
    return Array.from(
      { length },
      () => this.ALPHA_CHARS.charAt(Math.floor(Math.random() * this.ALPHA_CHARS.length))
    ).join("");
  }

  private generateAlphanumericToken(length: number): string {
    const minNumbers = Math.floor(length / 3);
    const minLetters = Math.floor(length / 3);
    const remainingLength = length - (minNumbers + minLetters);

    const numbers = Array.from(
      { length: minNumbers },
      () => this.NUMERIC_CHARS.charAt(Math.floor(Math.random() * this.NUMERIC_CHARS.length))
    );

    const letters = Array.from(
      { length: minLetters },
      () => this.ALPHA_CHARS.charAt(Math.floor(Math.random() * this.ALPHA_CHARS.length))
    );

    const remaining = Array.from(
      { length: remainingLength },
      () => this.ALPHANUMERIC_CHARS.charAt(Math.floor(Math.random() * this.ALPHANUMERIC_CHARS.length))
    );

    const token = [...numbers, ...letters, ...remaining]
      .sort(() => Math.random() - 0.5)
      .join("");

    return token;
  };
};

export default TokenGenerator;