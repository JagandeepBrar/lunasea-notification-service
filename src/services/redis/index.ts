import Redis from 'ioredis';
import { Logger, Constants } from '../../utils';

let redis: Redis.Redis | undefined;

/**
 * Initialize the connection to Redis.
 */
export const initialize = (): void => {
  Logger.debug('Initializing Redis...');
  redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    username: process.env.REDIS_USER ? process.env.REDIS_USER : undefined,
    password: process.env.REDIS_PASS ? process.env.REDIS_PASS : undefined,
    tls:
      process.env.REDIS_USE_TLS !== 'true'
        ? undefined
        : {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
          },
  });
  redis.on('error', (error) => {
    Logger.fatal(error);
    process.exit(1);
  });
  redis.once('connect', async () => Logger.debug('Redis: Connected.'));
  Logger.debug('Initialized Redis.');
};

/**
 * Set the given key to the given value in the Redis instance.
 *
 * @param key Redis key
 * @param value Value to set to
 * @returns True if successful, False on any error or if Redis is disconnected.
 */
export const set = async (key: string, value: string): Promise<boolean> => {
  const _isSetSuccess = (res: 'OK' | null): boolean => {
    return res === 'OK';
  };

  Logger.debug(`Redis: Setting "${key}"...`);
  let res = false;
  try {
    if (redis) {
      const set = await redis.set(
        key,
        value,
        Constants.REDIS.EXPIRE.MODE,
        Constants.REDIS.EXPIRE.TTL,
      );
      res = _isSetSuccess(set);
    }
  } catch (error) {
    Logger.error(error);
  }
  Logger.debug(`Redis: Set "${key}" - ${res}`);
  return res;
};

/**
 * Get the given key from the Redis instance.
 *
 * @param key Redis key
 * @returns The string value if the key was found, else null
 */
export const get = async (key: string): Promise<string | null> => {
  Logger.debug(`Redis: Getting "${key}"...`);
  let res: string | null = null;
  try {
    if (redis) res = await redis.get(key);
  } catch (error) {
    Logger.error(error);
  }
  Logger.debug(`Redis: Get "${key}" - ${res}`);
  return res;
};
