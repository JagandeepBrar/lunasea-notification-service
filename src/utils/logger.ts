import { Logger as TSLog } from 'tslog';

export const Logger = new TSLog({
  displayInstanceName: false,
  minLevel: 'silly',
  displayFunctionName: false,
  displayFilePath: 'hidden',
});
