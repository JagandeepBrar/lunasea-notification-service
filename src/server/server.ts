import { Environment, Logger } from '../utils';
import express from 'express';
import { router } from '../modules';

const server = express();

const docs = async (request: express.Request, response: express.Response): Promise<void> => {
  response.redirect(301, 'https://docs.lunasea.app/lunasea/notifications');
};

const health = async (request: express.Request, response: express.Response): Promise<void> => {
  response.status(200).json({
    status: 'OK',
    version: process.env.npm_package_version,
  });
};

export const initialize = (): void => {
  server.use(express.json());
  server.get('/', docs);
  server.get('/health', health);
  server.use('/v1', router);
};

export const start = (): void => {
  initialize();

  const PORT = Environment.default.PORT.read();
  server.listen(PORT).on('error', (error: Error) => {
    Logger.error(error);
    process.exit(1);
  });
  Logger.info('Server Running / Port', PORT);
};
