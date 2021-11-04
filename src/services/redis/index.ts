import Redis from 'ioredis';
import { Logger } from '../../utils';

let redis: Redis.Redis;

/**
 * Initialize the connection to Redis.
 */
export const initialize = (): void => {
  Logger.debug('Initializing Redis...');
  redis = new Redis(6379, '127.0.0.1');
  Logger.debug('Initialized Redis.');
};
