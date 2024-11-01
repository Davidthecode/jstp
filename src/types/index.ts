export type TokenFormat = "numeric" | "alphabetic" | "alphanumeric";

export interface GenerateType {
  length: number;
  format: TokenFormat;
  expiresIn: number;
  identifier: string,
};

export interface VerifyType {
  identifier: string,
  token: string
}