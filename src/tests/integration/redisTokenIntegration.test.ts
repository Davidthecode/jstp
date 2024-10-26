import { getRedisClient } from "../../config/redis";
import { generateOTP, verifyOTP } from "../../index";
import { OTPConfig } from "../../types/index";
import { createClient } from "redis";

describe("Redis OTP Integration", () => {
  let redis: ReturnType<typeof createClient>;
  const config: OTPConfig = {
    length: 6,
    format: "alphanumeric",
    expiresIn: 300,
    prefix: "JSTP_TEST_OTP_"
  };

  beforeAll(async () => {
    redis = await getRedisClient();
  });

  afterAll(async () => {
    // Clean up all test keys
    const allKeys = await redis.keys(`${config.prefix}*`);
    if (allKeys.length > 0) {
      await redis.del(...allKeys as [string]);
    }
    await redis.disconnect();
  });

  afterEach(async () => {
    // Clean up after each test
    const keys = await redis.keys(`${config.prefix}*`);
    if (keys.length > 0) {
      await redis.del(...keys as [string]);
    }
  });

  test("it should generate and store OTP", async () => {
    const identifier = "jstpTestUser";
    const token = await generateOTP(config, identifier);
    
    const key = `${config.prefix}${identifier}`;
    const storedToken = await redis.get(key);
    
    expect(storedToken).toBe(token);
  });

  test("it should verify correct OTP", async () => {
    const identifier = "jstpTestUser";
    const token = await generateOTP(config, identifier);
    
    const isValid = await verifyOTP(config, identifier, token);
    expect(isValid).toBe(true);
  });

  test("it should reject incorrect OTP", async () => {
    const identifier = "jstpTestUser";
    await generateOTP(config, identifier);
    
    const isValid = await verifyOTP(config, identifier, "wrongtoken");
    expect(isValid).toBe(false);
  });

  test("it should expire OTP after verification", async () => {
    const identifier = "jstpTestUser";
    const token = await generateOTP(config, identifier);
    
    await verifyOTP(config, identifier, token);
    
    const key = `${config.prefix}${identifier}`;
    const storedToken = await redis.get(key);
    expect(storedToken).toBeNull();
  });

  test("it should set correct TTL", async () => {
    const identifier = "jstpTestUser";
    await generateOTP(config, identifier);
    
    const key = `${config.prefix}${identifier}`;
    const ttl = await redis.ttl(key);
    
    expect(ttl).toBeGreaterThan(0);
    expect(ttl).toBeLessThanOrEqual(config.expiresIn);
  });
});