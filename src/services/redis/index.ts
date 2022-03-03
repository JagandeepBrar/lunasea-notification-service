import Redis from 'ioredis';
import { Logger, Constants, Environment } from '../../utils';

let redis: Redis.Redis | undefined;

/**
 * Initialize the connection to Redis.
 */
export const initialize = (): void => {
  Logger.debug('Initializing Redis...');

  const host = Environment.default.REDIS_HOST.read();
  const port = Number(Environment.default.REDIS_PORT.read());
  const username = Environment.default.REDIS_USER.read();
  const password = Environment.default.REDIS_PASS.read();
  const useTLS = Environment.default.REDIS_USE_TLS.read() === 'true';

  redis = new Redis({
    host,
    port,
    username: username ? username : undefined,
    password: password ? password : undefined,
    tls: useTLS ? { host, port } : undefined,
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
  } catch (error: any) {
    Logger.error(error.message);
  }
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
  } catch (error: any) {
    Logger.error(error.message);
  }
  if (!res) Logger.debug(`Redis: Cache Miss`);
  return res;
};
