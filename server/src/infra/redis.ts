import { createClient } from 'redis';
import logger from '../utils/logger.js';

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL is not defined');
}

export const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on('error', (err: Error) => {
  logger.error('Redis client error', { message: err.message, stack: err.stack });
});

await redis.connect();
