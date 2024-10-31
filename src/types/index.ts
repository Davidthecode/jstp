import { type RedisClientType } from "redis";

export type TokenFormat = "numeric" | "alphabetic" | "alphanumeric";

export interface OTPConfig {
  length: number;
  format: TokenFormat;
  expiresIn: number;
  prefix?: string;
  identifier: string,
  redisClient: RedisClientType
};