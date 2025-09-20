// lib/redis.ts
// lib/redis.ts
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// Helper to enforce required env vars
function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`❌ Missing environment variable: ${name}`);
    return "";
  }
  return value;
}

// Create Redis client
const redisClient = createClient({
  password: getEnvVar('REDIS_PASSWORD'),
  socket: {
    host: getEnvVar('REDIS_HOST'),
    port: parseInt(getEnvVar('REDIS_PORT') || '6379', 10),
    connectTimeout: 5000, // 5 seconds
  },
  database: parseInt(process.env.REDIS_DB || '0', 10),
});

let isConnected = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

// Redis event listeners
redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
  isConnected = false;
});

redisClient.on('connect', () => {
  console.log('🔄 Redis connecting...');
});

redisClient.on('ready', () => {
  console.log('✅ Redis ready!');
  isConnected = true;
  reconnectAttempts = 0;
});

redisClient.on('end', () => {
  console.log('🔌 Redis connection ended');
  isConnected = false;
});

// Connect with retry logic
async function connectWithRetry() {
  while (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    try {
      await redisClient.connect();
      return;
    } catch (error) {
      reconnectAttempts++;
      console.error(`❌ Redis connection attempt ${reconnectAttempts} failed:`, error);
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 2000 * reconnectAttempts));
      }
    }
  }
  console.error('❌ Redis connection failed after maximum attempts');
}

// Start connection
connectWithRetry();

// ---------------- Safe helper functions ----------------

export async function safeGet(key: string): Promise<string | null> {
  if (!isConnected) return null;
  try {
    return await redisClient.get(key);
  } catch (error) {
    console.error(`❌ Redis GET failed for key "${key}"`, error);
    return null;
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
    console.log(`💾 Cached response for key: ${key}`);
  } catch (error) {
    console.error(`❌ Redis SET failed for key "${key}"`, error);
  }
}

export async function safeDelPattern(pattern: string): Promise<void> {
  if (!isConnected) return;
  try {
    let deletedCount = 0;
    for await (const key of redisClient.scanIterator({ MATCH: pattern, COUNT: 100 })) {
      await redisClient.del(key);
      deletedCount++;
    }
    if (deletedCount > 0) {
      console.log(`🧹 Deleted ${deletedCount} cache keys matching: ${pattern}`);
    }
  } catch (error) {
    console.error(`❌ Redis DEL pattern failed for "${pattern}"`, error);
  }
}

export default redisClient;
