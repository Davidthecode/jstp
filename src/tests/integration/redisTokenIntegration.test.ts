import "dotenv/config";
import Jstp from "../..";
import { GenerateType, VerifyType } from "../../types/index";
import { type RedisClientType } from "redis";
import { createClient } from "redis";

describe("Redis OTP Integration", () => {
  let redis: RedisClientType;
  let jstp: Jstp;
  let generateConfig: GenerateType;
  let verifyConfig: VerifyType;
  let deleteIdentifier: string;

  beforeAll(async () => {
    const redisUrl = process.env.REDIS_URL as string;
    redis = createClient({ url: redisUrl });
    await redis.connect();
  });

  beforeEach(async () => {
    jstp = new Jstp(redis);

    //create a unique identifier for each test so we avoid unexpected behaviours
    const uniqueId = Date.now().toString();

    generateConfig = {
      length: 6,
      format: "alphanumeric",
      expiresIn: 300,
      identifier: uniqueId
    };

    verifyConfig = {
      identifier: uniqueId,
      token: "" // this would be set in individual tests
    };

    deleteIdentifier = uniqueId;
  });

  afterEach(async () => {
    await jstp.deleteOTP(deleteIdentifier);
  });

  afterAll(async () => {
    await redis.disconnect();
  });

  describe("generateOTP", () => {
    it("should generate and store OTP", async () => {
      const token = await jstp.generateOTP(generateConfig);

      const storedToken = await redis.get(`jstp_${generateConfig.identifier}`);
      expect(storedToken).toBe(token);
    });
  });

  describe("verifyOTP", () => {
    it("should verify correct OTP", async () => {
      const token = await jstp.generateOTP(generateConfig);
      verifyConfig.token = token;

      const isValid = await jstp.verifyOTP(verifyConfig);
      expect(isValid).toBe(true);
    });

    it("should reject incorrect OTP", async () => {
      await jstp.generateOTP(generateConfig);
      verifyConfig.token = "wrongtoken";

      const isValid = await jstp.verifyOTP(verifyConfig);
      expect(isValid).toBe(false);
    });

    it("should delete OTP after successful verification", async () => {
      const token = await jstp.generateOTP(generateConfig);
      verifyConfig.token = token;

      await jstp.verifyOTP(verifyConfig);

      const storedToken = await redis.get(`jstp_${generateConfig.identifier}`);
      expect(storedToken).toBeNull();
    });
  });

  describe("deleteOTP", () => {
    it("should successfully delete existing OTP", async () => {
      await jstp.generateOTP(generateConfig);
      await jstp.deleteOTP(deleteIdentifier);

      const storedToken = await redis.get(`jstp_${generateConfig.identifier}`);
      expect(storedToken).toBeNull();
    });
  });
});