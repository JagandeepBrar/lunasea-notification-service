import express from 'express';
import { Models, Payloads } from './';
import { Middleware, Models as ServerModels } from '../../server';
import { Firebase } from '../../services';
import { Constants, Logger, Payloads as GenericPayloads } from '../../utils';

export const enable = (api: express.Router) => api.use(route, router);

const router = express.Router();
const route = '/lidarr';

router.post(
  '/user/:id',
  Middleware.validateUser,
  Middleware.checkNotificationPassword,
  Middleware.extractProfile,
  Middleware.pullUserTokens,
  handler,
);
router.post('/device/:id', Middleware.extractProfile, Middleware.extractDeviceToken, handler);

/**
 * Lidarr Webhook Handler: Handles a webhook from Lidarr, and sends a notification to all devices that are in `response.locals.tokens`.
 *
 * @param request Express request object
 * @param response Express response object
 */
async function handler(request: express.Request, response: express.Response): Promise<void> {
  Logger.info('Running Lidarr webhook...');
  try {
    Logger.debug('-> Sending HTTP response to complete webhook...');
    response.status(200).json(<ServerModels.Response>{ message: Constants.MSG_OK });
    Logger.debug('-> HTTP response sent (200 OK)');
    await _handleWebhook(request.body, response.locals.tokens, response.locals.profile);
  } catch (error: any) {
    Logger.error(error.message);
    Logger.debug('-> Sending HTTP response to complete webhook...');
    response
      .status(500)
      .json(<ServerModels.Response>{ message: Constants.MSG_INTERNAL_SERVER_ERROR });
    Logger.debug('HTTP response sent (500 Internal Server Error)');
  }
  Logger.info('Finished Lidarr webhook.');
}

/**
 * Given the request data body, execute the correct webhook handler for Lidarr.
 *
 * @private
 * @param data Webhook notification payload
 * @param devices List of devices to send the notification to
 * @param profile The profile name to attach to the title
 */
const _handleWebhook = async (data: any, devices: string[], profile: string): Promise<void> => {
  Logger.debug('-> Preparing payload...');
  let payload: GenericPayloads.Notification;
  switch (data.eventType) {
    case Models.EventType.Download:
      Logger.info('-> Handling as "Download" event type...');
      payload = await Payloads.download(data, profile);
      break;
    case Models.EventType.Grab:
      Logger.info('-> Handling as "Grab" event type...');
      payload = await Payloads.grab(data, profile);
      break;
    case Models.EventType.Rename:
      Logger.info('-> Handling as "Rename" event type...');
      payload = await Payloads.rename(data, profile);
      break;
    case Models.EventType.Retag:
      Logger.info('-> Handling as "Retag" event type...');
      payload = await Payloads.retag(data, profile);
      break;
    case Models.EventType.Test:
      Logger.info('-> Handling as "Test" event type...');
      payload = await Payloads.test(data, profile);
      break;
    default:
      Logger.warn('-> An unknown eventType was received:', JSON.stringify(data));
      Logger.warn('-> Failed to send to device(s).');
      return;
  }
  await Firebase.sendNotification(devices, payload);
};
