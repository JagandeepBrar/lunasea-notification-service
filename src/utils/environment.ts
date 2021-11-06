import { Logger } from './logger';

/**
 * Validate that all required environment values are found.
 *
 * If a value is not found, it will exit the application.
 */
export const validate = (): void => {
  Logger.debug('Loading environment...');

  /// Mandatory Variables
  _validateRequiredVariables('FIREBASE_DATABASE_URL');
  _validateRequiredVariables('FANART_TV_API_KEY', true);
  _validateRequiredVariables('THEMOVIEDB_API_KEY', true);
  _validateRequiredVariables('REDIS_HOST');
  _validateRequiredVariables('REDIS_PORT');

  /// Optional Variables
  _validateOptionalVariables('REDIS_USE_TLS');
  _validateOptionalVariables('REDIS_USER');
  _validateOptionalVariables('REDIS_PASS', true);

  Logger.debug('Loaded environment.');
};

/**
 * @private
 */
const _validateRequiredVariables = (key: string, obfuscated = false) => {
  if (!process.env[key]) _shutdown(key);
  Logger.debug(`-> ${key}: ${obfuscated ? '******' : process.env[key]}`);
};

/**
 * @private
 */
const _validateOptionalVariables = (key: string, obfuscated = false) => {
  if (process.env[key]) {
    Logger.debug(`-> ${key}: ${obfuscated ? '******' : process.env[key]}`);
  }
};

/**
 * @private
 */
const _shutdown = (variable: string): void => {
  Logger.fatal(`Unable to find ${variable} environment value. Exiting...`);
  process.exit(1);
};
