import { Logger } from './logger';

/**
 * Validate that all required environment values are found.
 *
 * If a value is not found, it will exit the application.
 */
export const validate = (): void => {
  Logger.debug('Loading environment...');
  if (!process.env.FIREBASE_DATABASE_URL) _shutdown('FIREBASE_DATABASE_URL');
  Logger.debug('-> FIREBASE_DATABASE_URL:', process.env.FIREBASE_DATABASE_URL);
  if (!process.env.FANART_TV_API_KEY) _shutdown('FANART_TV_API_KEY');
  Logger.debug('-> FANART_TV_API_KEY:', process.env.FANART_TV_API_KEY);
  if (!process.env.THEMOVIEDB_API_KEY) _shutdown('THEMOVIEDB_API_KEY');
  Logger.debug('-> THEMOVIEDB_API_KEY:', process.env.THEMOVIEDB_API_KEY);
  Logger.debug('Loaded environment.');
};

/**
 * @private
 */
const _shutdown = (variable: string): void => {
  Logger.fatal(`Unable to find ${variable} environment value. Exiting...`);
  process.exit(1);
};
