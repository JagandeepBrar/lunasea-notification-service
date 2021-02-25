import { appendFileSync } from 'fs';
import { Logger as TSLog, ILogObject } from 'tslog';

function logToTransport(log: ILogObject) {
    const message = [log.date.toISOString(), log.logLevel?.toUpperCase()?.padEnd(5), `${log.filePath}:${log.lineNumber}`.padEnd(35), log.argumentsArray.join(' ')].join(' ');
    appendFileSync('server.log', message + '\n');
}

export const Logger = new TSLog({
    displayInstanceName: false,
    minLevel: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
    displayFunctionName: false,
    displayFilePath: 'hidden',
});

Logger.attachTransport(
    {
        silly: logToTransport,
        debug: logToTransport,
        trace: logToTransport,
        info: logToTransport,
        warn: logToTransport,
        error: logToTransport,
        fatal: logToTransport,
    },
    'silly',
);
