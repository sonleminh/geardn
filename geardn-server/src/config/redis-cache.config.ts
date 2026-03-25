// src/config/redis-cache.config.ts
import { CacheModuleOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

export const redisCacheConfig = async (): Promise<CacheModuleOptions> => ({
  store: await redisStore({
    socket: {
      host: process.env.REDIS_HOST ?? 'localhost',
      port: parseInt(process.env.REDIS_PORT ?? '6379'),
    },
    password: process.env.REDIS_PASSWORD || undefined,
    ttl: 60 * 5 * 1000, // 5 minutes default TTL (in ms for redis-yet)
  }),
});
