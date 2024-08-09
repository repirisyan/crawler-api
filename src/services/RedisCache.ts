// redisCache.ts
import Redis from "ioredis";

const redisClient = new Redis();

redisClient.on("error", (err: any) => {
  console.error("Redis error:", err);
});

export async function getFromCache(key: string) {
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.error("Error getting from cache:", err);
    return null;
  }
}

export async function setInCache(key: string, value: any, expiration = 3600) {
  try {
    await redisClient.setex(key, expiration, JSON.stringify(value));
  } catch (err) {
    console.error("Error setting cache:", err);
  }
}
