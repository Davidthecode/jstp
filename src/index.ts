import { generateToken } from "./utils/token-generator";
import { OTPConfig } from "./types/index";

const getKey = (prefix: string, identifier: string): string => {
  return `${prefix}${identifier}`;
};

export const generateOTP = async (config: OTPConfig): Promise<string> => {
  const redis = config.redisClient;
  const prefix = config.prefix || "OTP_";

  const token = generateToken(config.format, config.length);
  const key = getKey(prefix, config.identifier);

  await redis.set(key, token, {
    EX: config.expiresIn
  });

  return token;
};

export const verifyOTP = async (
  config: OTPConfig,
  token: string
): Promise<boolean> => {
  const redis = config.redisClient;
  const prefix = config.prefix || "OTP_";
  const key = getKey(prefix, config.identifier);

  const storedToken = await redis.get(key);

  if (!storedToken || storedToken !== token) {
    return false;
  }

  await redis.del(key);
  return true;
};

export const deleteOTP = async (config: OTPConfig): Promise<void> => {
  const redis = config.redisClient;
  const prefix = config.prefix || "OTP_";
  const key = getKey(prefix, config.identifier);

  await redis.del(key);
};