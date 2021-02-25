import { appendFileSync } from 'fs';
import { Logger as TSLog, ILogObject } from 'tslog';

const transportLogToFilesystem = (logObject: ILogObject): void => {
    const message = [
        logObject.date.toISOString(),
        logObject.logLevel?.toUpperCase()?.padEnd(5),
        `${logObject.filePath}:${logObject.lineNumber}`.padEnd(35),
        logObject.argumentsArray.join(' '),
    ].join(' ');
    appendFileSync('server.log', message + '\n');
};

export const Logger = new TSLog({
    displayInstanceName: false,
    minLevel: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
    displayFunctionName: false,
    displayFilePath: 'hidden',
});

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
    'warn',
);
