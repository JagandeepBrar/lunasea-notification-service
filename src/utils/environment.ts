import { Logger } from './logger';

interface _Options {
  fallback?: string;
  secret?: boolean;
}

class _Var {
  constructor(private name: string, private options?: _Options) {
    if (process.env[this.name] || this.options?.fallback !== undefined) {
      Logger.debug(`${this.name}: ${this.options?.secret ? '******' : this.read()}`);
    } else {
      Logger.fatal(`Unable to find ${this.name} environment value. Exiting...`);
      process.exit(1);
    }
  }

  public read = (): string => process.env[this.name] ?? this.options!.fallback!;
}

export default {
  // Firebase
  FIREBASE_CLIENT_EMAIL: new _Var('FIREBASE_CLIENT_EMAIL', { secret: true }),
  FIREBASE_DATABASE_URL: new _Var('FIREBASE_DATABASE_URL'),
  FIREBASE_PRIVATE_KEY: new _Var('FIREBASE_PRIVATE_KEY', { secret: true }),
  FIREBASE_PROJECT_ID: new _Var('FIREBASE_PROJECT_ID'),
  // API Keys
  FANART_TV_API_KEY: new _Var('FANART_TV_API_KEY', { secret: true }),
  THEMOVIEDB_API_KEY: new _Var('THEMOVIEDB_API_KEY', { secret: true }),
  // Redis
  REDIS_HOST: new _Var('REDIS_HOST'),
  REDIS_PORT: new _Var('REDIS_PORT'),
  REDIS_USE_TLS: new _Var('REDIS_USE_TLS', { fallback: 'false' }),
  REDIS_USER: new _Var('REDIS_USER', { fallback: '' }),
  REDIS_PASS: new _Var('REDIS_PASS', { fallback: '', secret: true }),
  // Other
  PORT: new _Var('PORT', { fallback: '9000' }),
};
