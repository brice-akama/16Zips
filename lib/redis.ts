// lib/redis.ts
// lib/redis.ts
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config(); // Load .env file

// Helper to enforce required env vars
function getEnvVar(name: string): string {
  const value = process.env[name];
  if (value === undefined) {
    console.error(`❌ Missing environment variable: ${name}`);
    return ""; // return empty string so app won't crash immediately
  }
  return value;
}

// Create client safely
const redisClient = createClient({
  password: getEnvVar('REDIS_PASSWORD'),
  socket: {
    host: getEnvVar('REDIS_HOST'),
    port: parseInt(getEnvVar('REDIS_PORT') || "6379", 10),
  },
  database: parseInt(process.env.REDIS_DB || "0", 10),
});

// Flag to track connection
let isConnected = false;

redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
  isConnected = false;
});

(async () => {
  try {
    await redisClient.connect();
    isConnected = true;
    console.log('✅ Connected to Redis!');
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    isConnected = false;
  }
})();

// --- Safe helper functions ---
// These ensure your app continues even if Redis is down

export async function safeGet(key: string): Promise<string | null> {
  if (!isConnected) return null;
  try {
    return await redisClient.get(key);
  } catch (error) {
    console.error(`❌ Redis GET failed for key "${key}"`, error);
    return null;
  }
}

export async function safeDelPattern(pattern: string): Promise<void> {
  if (!isConnected) return;

  try {
    let deletedCount = 0;

    // scanIterator returns an async iterable of matching keys
    for await (const key of redisClient.scanIterator({
      MATCH: pattern,
      COUNT: 100, // batch size
    })) {
      await redisClient.del(key);
      deletedCount++;
    }

    if (deletedCount > 0) {
      console.log(`🧹 Deleted ${deletedCount} cache keys matching: ${pattern}`);
    } else {
      console.log(`🧹 No cache keys found for pattern: ${pattern}`);
    }

  } catch (error) {
    console.error(`❌ Redis DEL pattern failed for "${pattern}"`, error);
  }
}



export async function safeSet(key: string, value: string, ttlSeconds?: number): Promise<void> {
  if (!isConnected) return;
  try {
    if (ttlSeconds) {
      await redisClient.setEx(key, ttlSeconds, value);
    } else {
      await redisClient.set(key, value);
    }
  } catch (error) {
    console.error(`❌ Redis SET failed for key "${key}"`, error);
  }
}

export default redisClient;
