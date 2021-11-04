import { appendFileSync } from 'fs';
import { ILogObject, TLogLevelName, Logger as TSLog } from 'tslog';

export const Logger = new TSLog({
  displayInstanceName: false,
  minLevel: 'silly',
  displayFunctionName: false,
  displayFilePath: 'hidden',
});

/**
 * @private
 */
const _filesystemLogPath = (): string => {
  switch ((process.env.NODE_ENV ?? '').toLowerCase()) {
    case 'docker':
      return '../config/server.log';
    case 'production':
    case 'development':
    default:
      return 'server.log';
  }
};

/**
 * @private
 */
const _environmentLogLevel = (): TLogLevelName => {
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

/**
 * @private
 */
const _transportLogToFilesystem = (logObject: ILogObject): void => {
  const message = [
    logObject.date.toISOString(),
    logObject.logLevel?.toUpperCase()?.padEnd(5),
    `${logObject.filePath}:${logObject.lineNumber}`.padEnd(35),
    logObject.argumentsArray.join(' '),
  ].join(' ');
  appendFileSync(_filesystemLogPath(), message + '\n');
};

Logger.attachTransport(
  {
    silly: _transportLogToFilesystem,
    debug: _transportLogToFilesystem,
    trace: _transportLogToFilesystem,
    info: _transportLogToFilesystem,
    warn: _transportLogToFilesystem,
    error: _transportLogToFilesystem,
    fatal: _transportLogToFilesystem,
  },
  _environmentLogLevel(),
);
