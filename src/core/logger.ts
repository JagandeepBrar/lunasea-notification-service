import { Logger as TSLog } from 'tslog';

const BaseLogger = new TSLog({
    displayInstanceName: false,
    minLevel: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
});

/**
 * Error (E) logger, which keeps the function name and displays the file path.
 */
export const ELogger = BaseLogger.getChildLogger({
    instanceName: 'ELogger',
});

/**
 * Normal logger, for use for logging info or trace logs
 */
export const Logger = BaseLogger.getChildLogger({
    instanceName: 'Logger',
    displayFunctionName: false,
    displayFilePath: 'hidden',
});
