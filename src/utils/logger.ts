import pino from 'pino';

export const Logger = pino({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
});

process.on('uncaughtException', (e) => Logger.error(e));
process.on('unhandledRejection', (e) => Logger.error(e));
