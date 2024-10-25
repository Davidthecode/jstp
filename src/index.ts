import { getRedisClient } from "./config/redis";
import { generateToken } from "./utils/token-generator";
import { OTPConfig } from "./types/index";

const getKey = (prefix: string, identifier: string): string => {
  return `${prefix}${identifier}`;
};

export const generateOTP = async (
  config: OTPConfig,
  identifier: string
): Promise<string> => {
  const redis = await getRedisClient();
  const prefix = config.prefix || "OTP_";

  const token = generateToken(config.format, config.length);
  const key = getKey(prefix, identifier);

  await redis.set(key, token, {
    EX: config.expiresIn
  });

  return token;
};

export const verifyOTP = async (
  config: OTPConfig,
  identifier: string,
  token: string
): Promise<boolean> => {
  const redis = await getRedisClient();
  const prefix = config.prefix || "OTP_";
  const key = getKey(prefix, identifier);

  const storedToken = await redis.get(key);

  if (!storedToken || storedToken !== token) {
    return false;
  }

  await redis.del(key);
  return true;
};

export const deleteOTP = async (
  config: OTPConfig,
  identifier: string
): Promise<void> => {
  const redis = await getRedisClient();
  const prefix = config.prefix || "OTP_";
  const key = getKey(prefix, identifier);

  await redis.del(key);
};