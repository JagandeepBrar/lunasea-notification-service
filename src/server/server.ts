import { Logger } from '../utils';
import express from 'express';
import { router } from '../modules';

const PORT = process.env.PORT || '9000';
const server = express();

/**
 * Handle redirecting a request to the documentation.
 *
 * @param request Express request object
 * @param response Express response object
 */
const docs = async (request: express.Request, response: express.Response): Promise<void> => {
  response.redirect(301, 'https://docs.lunasea.app/lunasea/notifications');
};

/**
 * Handle sending a simple health-check response with basic server information
 *
 * @param request Express request object
 * @param response Express response object
 */
const health = async (request: express.Request, response: express.Response): Promise<void> => {
  response.status(200).json({
    status: 'OK',
    version: process.env.npm_package_version,
  });
};

/**
 * Initialize the Express server.
 *
 * Does things like set CORS, set JSON limits, adds global middleware, etc.
 */
export const initialize = (): void => {
  server.use(express.json());
  server.get('/', docs);
  server.get('/health', health);
  server.use('/v1', router);
};

/**
 * Start the express server on the the environment PORT value, or 9000.
 */
export const start = (): void => {
  initialize();
  server.listen(PORT).on('error', (error: Error) => {
    Logger.error(error.message);
    process.exit(1);
  });
  Logger.info('Server Running / Port', PORT);
};
