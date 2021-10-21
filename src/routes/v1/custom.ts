import { Server } from '../../server';
import { Middleware } from '../../server/middleware';
import { Constants } from '../../utilities/constants';
import { Logger } from '../../utilities/logger';
import { handleWebhook } from '../../webhooks/custom';
import express from 'express';

export const router = express.Router();
router.post(
  '/user/:id',
  Middleware.validateUser,
  Middleware.checkNotificationPassword,
  Middleware.pullUserTokens,
  handler,
);
router.post('/device/:id', Middleware.extractDeviceToken, handler);

/**
 * Custom Webhook Handler: Handles a webhook from any source, and sends a notification to all devices that are in `response.locals.tokens`.
 *
 * @param request Express request object
 * @param response Express response object
 */
async function handler(request: express.Request, response: express.Response): Promise<void> {
  Logger.info('Running Custom webhook...');
  try {
    Logger.debug('-> Sending HTTP response to complete webhook...');
    response.status(200).json(<Server.Response>{ message: Constants.MSG_OK });
    Logger.debug('-> HTTP response sent (200 OK)');
    await handleWebhook(request.body, response.locals.tokens);
  } catch (error) {
    Logger.error(error.message);
    Logger.debug('-> Sending HTTP response to complete webhook...');
    response.status(500).json(<Server.Response>{ message: Constants.MSG_INTERNAL_SERVER_ERROR });
    Logger.debug('HTTP response sent (500 Internal Server Error)');
  }
  Logger.info('Finished Custom webhook.');
}
