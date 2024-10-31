import "dotenv/config";
import { generateOTP, verifyOTP } from "../../index";
import { OTPConfig } from "../../types/index";
import { type RedisClientType } from "redis";
import { createClient } from "redis";

describe("Redis OTP Integration", () => {
  let redis: RedisClientType;

  const config: OTPConfig = {
    length: 6,
    format: "alphanumeric",
    expiresIn: 300,
    prefix: "JSTP_TEST_OTP_",
    identifier: "jstpTestUser",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    redisClient: undefined as any
  };

  beforeAll(async () => {
    const redisUrl = process.env.REDIS_URL as string;
    redis = createClient({ url: redisUrl });
    await redis.connect();
    config.redisClient = redis;
  });

  afterAll(async () => {
    const allKeys = await redis.keys(`${config.prefix}*`);
    if (allKeys.length > 0) {
      await redis.del(...allKeys as [string]);
    }
    await redis.disconnect();
  });

  beforeEach(async () => {
    const keys = await redis.keys(`${config.prefix}*`);
    if (keys.length > 0) {
      await redis.del(...keys as [string]);
    }
  });

  test("it should generate and store OTP", async () => {
    const token = await generateOTP(config);

    const key = `${config.prefix}${config.identifier}`;
    const storedToken = await redis.get(key);

    expect(storedToken).toBe(token);
  });

  test("it should verify correct OTP", async () => {
    const token = await generateOTP(config);

    const isValid = await verifyOTP(config, token);
    expect(isValid).toBe(true);
  });

  test("it should reject incorrect OTP", async () => {
    await generateOTP(config);

    const isValid = await verifyOTP(config, "wrongtoken");
    expect(isValid).toBe(false);
  });

  test("it should expire OTP after verification", async () => {
    const token = await generateOTP(config);

    await verifyOTP(config, token);

    const key = `${config.prefix}${config.identifier}`;
    const storedToken = await redis.get(key);
    expect(storedToken).toBeNull();
  });

  test("it should set correct TTL", async () => {
    await generateOTP(config);

    const key = `${config.prefix}${config.identifier}`;
    const ttl = await redis.ttl(key);

    expect(ttl).toBeGreaterThan(0);
    expect(ttl).toBeLessThanOrEqual(config.expiresIn);
  });
});