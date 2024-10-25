export type TokenFormat = "numeric" | "alphabetic" | "alphanumeric";

export interface OTPConfig {
  length: number;
  format: TokenFormat;
  expiresIn: number;
  prefix?: string;
};