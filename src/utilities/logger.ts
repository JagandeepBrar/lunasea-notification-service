import { appendFileSync } from 'fs';
import { Logger as TSLog, ILogObject, TLogLevelName } from 'tslog';

export const Logger = new TSLog({
  displayInstanceName: false,
  minLevel: 'silly',
  displayFunctionName: false,
  displayFilePath: 'hidden',
});

const filesystemLogPath = (): string => {
  switch ((process.env.NODE_ENV ?? '').toLowerCase()) {
    case 'docker':
      return '../config/server.log';
    case 'production':
    case 'development':
    default:
      return 'server.log';
  }
};

const environmentLogLevel = (): TLogLevelName => {
  switch ((process.env.LOG_LEVEL ?? '').toLowerCase()) {
    case 'silly':
    case 'trace':
    case 'debug':
    case 'info':
    case 'warn':
    case 'error':
    case 'fatal':
      return (process.env.LOG_LEVEL ?? '').toLowerCase() as TLogLevelName;
    default:
      return 'warn';
  }
};

const transportLogToFilesystem = (logObject: ILogObject): void => {
  const message = [
    logObject.date.toISOString(),
    logObject.logLevel?.toUpperCase()?.padEnd(5),
    `${logObject.filePath}:${logObject.lineNumber}`.padEnd(35),
    logObject.argumentsArray.join(' '),
  ].join(' ');
  appendFileSync(filesystemLogPath(), message + '\n');
};

Logger.attachTransport(
  {
    silly: transportLogToFilesystem,
    debug: transportLogToFilesystem,
    trace: transportLogToFilesystem,
    info: transportLogToFilesystem,
    warn: transportLogToFilesystem,
    error: transportLogToFilesystem,
    fatal: transportLogToFilesystem,
  },
  environmentLogLevel(),
);
