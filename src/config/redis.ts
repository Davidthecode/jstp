import "dotenv/config";
import { createClient } from "redis";

let redisClient: ReturnType<typeof createClient> | null = null;

export const getRedisClient = async () => {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL
    });

    redisClient.on("error", (err) => console.error("Redis Client Error", err));
    await redisClient.connect().then(() => console.log("connected to Redis"));
  }
  return redisClient;
};