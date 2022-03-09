import Redis from 'ioredis';
import { Logger, Constants, Environment } from '../../utils';

const logger = Logger.child({ module: 'redis' });
let redis: Redis.Redis | undefined;

export const initialize = (): void => {
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
    logger.fatal(error);
    process.exit(1);
  });
  redis.once('connect', async () => logger.debug('Connected'));
};

export const set = async (
  key: string,
  value: string,
  expiration: Constants.RedisExpirationConfig,
): Promise<boolean> => {
  const _isSetSuccess = (res: 'OK' | null): boolean => {
    return res === 'OK';
  };

  let res = false;
  try {
    if (redis) {
      const set = await redis.set(key, value, expiration.mode, expiration.ttl);
      res = _isSetSuccess(set);
    }
  } catch (error) {
    logger.error(error);
  }
  return res;
};

export const get = async (key: string): Promise<string | null> => {
  let res: string | null = null;
  try {
    if (redis) res = await redis.get(key);
  } catch (error) {
    logger.error(error);
  }
  return res;
};
