let redisClient = null;
const memoryStore = new Map();

try {
  const Redis = require('ioredis');
  redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > 3) return null;
      return Math.min(times * 200, 1500);
    }
  });

  redisClient.on('connect', () => {
    console.log('✅ Redis connected successfully (Rider presence & location cache).');
  });

  redisClient.on('error', (err) => {
    console.warn('⚠️ Redis error (falling back to memory cache):', err.message);
  });
} catch (e) {
  console.warn('⚠️ Redis client init fallback:', e.message);
}

const cache = {
  async get(key) {
    if (redisClient && redisClient.status === 'ready') {
      try {
        return await redisClient.get(key);
      } catch (err) {
        return memoryStore.get(key) || null;
      }
    }
    return memoryStore.get(key) || null;
  },

  async set(key, value, expirySeconds = 3600) {
    const strVal = typeof value === 'object' ? JSON.stringify(value) : String(value);
    if (redisClient && redisClient.status === 'ready') {
      try {
        if (expirySeconds) {
          return await redisClient.set(key, strVal, 'EX', expirySeconds);
        }
        return await redisClient.set(key, strVal);
      } catch (err) {
        memoryStore.set(key, strVal);
      }
    } else {
      memoryStore.set(key, strVal);
    }
    return 'OK';
  },

  async del(key) {
    if (redisClient && redisClient.status === 'ready') {
      try {
        return await redisClient.del(key);
      } catch (err) {}
    }
    memoryStore.delete(key);
    return 1;
  }
};

module.exports = { redisClient, cache };
