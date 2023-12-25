const Redis = require("ioredis");
const { REDIS_HOST, REDIS_PORT } = require("../../config");

class RedisUtils {
  constructor() {
    this.redis = this.ConnectRedis();
  }

  ConnectRedis() {
    const redisClient = new Redis({
      host: REDIS_HOST,
      port: REDIS_PORT,
      showFriendlyErrorStack: true,
      retryStrategy: (times) => {
        if (times <= 3) {
          console.log("Retrying connection...");
          return 1000;
        }
        return null;
      },
    });
    // console.log("Redis connected".magenta);
    return redisClient;
  }

  RedisGET(key) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await this.redis.get(key);
        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  }

  RedisSET(key, value, time = 1000000000, nx = true) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = null;
        if (nx) {
          data = await this.redis.set(key, value, "EX", time);
        } else {
          data = await this.redis.set(key, value);
        }
        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  }

  RedisDEL(key) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await this.redis.del(key);
        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  }

  RedisTTL(key) {
    return new Promise(async (resolve, reject) => {
      try {
        const ttl = await this.redis.ttl(key);
        resolve(ttl);
      } catch (e) {
        reject(e);
      }
    });
  }
}

module.exports = { RedisUtils };
