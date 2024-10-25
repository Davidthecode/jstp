import { getRedisClient } from "./config/redis";
import { generateOTP, verifyOTP } from "./index";
import { OTPConfig } from "./types/index";

async function testRedisOperations() {
  try {
    const redis = await getRedisClient();
    console.log("Successfully connected to Redis!");

    // Config
    const config: OTPConfig = {
      length: 6,
      format: "alphanumeric",
      expiresIn: 300,
      prefix: "JTP_TEST_OTP_" // Adding prefix to easily identify our tokens
    };
    const identifier = "jtpTestUser";

    // Generate OTP
    const token = await generateOTP(config, identifier);
    console.log("\n1. Token Generated:", token);

    // Check if token exists in Redis
    const key = `${config.prefix}${identifier}`;
    const storedToken = await redis.get(key);
    console.log("2. Token in Redis:", storedToken);

    // Get TTL (time to live) for the token
    const ttl = await redis.ttl(key);
    console.log("3. Token expires in:", ttl, "seconds");

    // List all keys matching our prefix
    const keys = await redis.keys(`${config.prefix}*`);
    console.log("4. All test OTP keys in Redis:", keys);

    // Try to verify with wrong token
    const isVerifiedWrong = await verifyOTP(config, identifier, "test");
    console.log("\n5. Verify with wrong token:", isVerifiedWrong);

    // Try to verify with correct token
    const isVerifiedCorrect = await verifyOTP(config, identifier, token);
    console.log("6. Verify with correct token:", isVerifiedCorrect);

    // Check if token still exists after verification
    const tokenAfterVerify = await redis.get(key);
    console.log("7. Token after verification:", tokenAfterVerify);

    // Generate multiple tokens to see them in Redis
    console.log("\n8. Generating multiple tokens:");
    for (let i = 1; i <= 3; i++) {
      const newIdentifier = `user${i}`;
      const newToken = await generateOTP(config, newIdentifier);
      console.log(`   User ${i}: ${newToken}`);
    }

    // List all keys again
    const allKeys = await redis.keys(`${config.prefix}*`);
    console.log("\n9. All keys in Redis:", allKeys);

    // Get all values
    const values = await Promise.all(
      allKeys.map(async (key) => {
        const value = await redis.get(key);
        return { key, value };
      })
    );
    console.log("10. All key-value pairs:");
    values.forEach(({ key, value }) => {
      console.log(`    ${key}: ${value}`);
    });

    // Clean up - delete all test tokens
    if (allKeys.length > 0) {
      await redis.del(...allKeys as [string]);
      console.log("\n11. Cleaned up all test tokens");
    }

    // Disconnect from Redis
    await redis.disconnect();
    console.log("12. Disconnected from Redis");

  } catch (error) {
    console.error("Error during Redis operations:", error);
  }
};

testRedisOperations();