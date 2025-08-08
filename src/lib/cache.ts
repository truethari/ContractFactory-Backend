import Redis from "ioredis";
import config from "../config";

const cacheDisabled = config.redis.disable;
const redisClient = new Redis(config.redis.uri);

const cache = {
  set: async (key: string, value: string): Promise<void> => {
    if (cacheDisabled) return;
    try {
      await redisClient.set(key, value);
    } catch (error) {
      console.error(error);
    }
  },

  get: async (key: string): Promise<string | null> => {
    if (cacheDisabled) return null;
    try {
      return await redisClient.get(key);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  del: async (key: string): Promise<void> => {
    if (cacheDisabled) return;
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error(error);
    }
  },

  delPattern: async (pattern: string): Promise<void> => {
    if (cacheDisabled) return;
    try {
      const keys = await redisClient.keys(pattern);
      await redisClient.del(keys);
    } catch (error) {
      console.error(error);
    }
  },

  flush: async (): Promise<void> => {
    if (cacheDisabled) return;
    try {
      await redisClient.flushall();
    } catch (error) {
      console.error(error);
    }
  },
};

export default cache;
