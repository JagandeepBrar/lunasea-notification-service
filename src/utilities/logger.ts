import { Logger as TSLog } from 'tslog';

export const Logger = new TSLog({
    displayInstanceName: false,
    minLevel: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
    displayFunctionName: false,
});
