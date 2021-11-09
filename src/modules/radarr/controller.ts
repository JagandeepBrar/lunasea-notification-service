import express from 'express';
import { Models, Payloads } from './';
import { Middleware, Models as ServerModels } from '../../server';
import { Firebase } from '../../services';
import { Constants, Logger, Notifications } from '../../utils';

export const enable = (api: express.Router) => api.use(route, router);

const router = express.Router();
const route = '/radarr';

router.post(
  '/user/:id',
  Middleware.validateUser,
  Middleware.checkNotificationPassword,
  Middleware.pullUserTokens,
  handler,
);
router.post('/device/:id', Middleware.extractDeviceToken, handler);

/**
 * Radarr Webhook Handler: Handles a webhook from Radarr, and sends a notification to all devices that are in `response.locals.tokens`.
 *
 * @param request Express request object
 * @param response Express response object
 */
async function handler(request: express.Request, response: express.Response): Promise<void> {
  Logger.info('Running Radarr webhook...');
  try {
    Logger.debug('-> Sending HTTP response to complete webhook...');
    response.status(200).json(<ServerModels.Response>{ message: Constants.MESSAGE.OK });
    Logger.debug('-> HTTP response sent (200 OK)');
    await _handleWebhook(
      request.body,
      response.locals.tokens,
      response.locals.profile,
      response.locals.notificationSettings,
    );
  } catch (error: any) {
    Logger.error(error.message);
    Logger.debug('-> Sending HTTP response to complete webhook...');
    response
      .status(500)
      .json(<ServerModels.Response>{ message: Constants.MESSAGE.INTERNAL_SERVER_ERROR });
    Logger.debug('HTTP response sent (500 Internal Server Error)');
  }
  Logger.info('Finished Radarr webhook.');
}

/**
 * Given the request data body, execute the correct webhook handler.
 *
 * @private
 * @param data Webhook notification payload
 * @param devices List of devices to send the notification to
 * @param profile The profile name to attach to the title
 * @param settings Notification settings
 */
const _handleWebhook = async (
  data: any,
  devices: string[],
  profile: string,
  settings: Notifications.Settings,
): Promise<void> => {
  Logger.debug('-> Preparing payload...');
  let payload: Notifications.Payload;
  switch (data.eventType) {
    case Models.EventType.Download:
      Logger.info('-> Handling as "Download" event type...');
      payload = await Payloads.download(data, profile);
      break;
    case Models.EventType.Grab:
      Logger.info('-> Handling as "Grab" event type...');
      payload = await Payloads.grab(data, profile);
      break;
    case Models.EventType.Health:
      Logger.info('-> Handling as "Health" event type...');
      payload = await Payloads.health(data, profile);
      break;
    case Models.EventType.MovieDelete:
      Logger.info('-> Handling as "MovieDelete" event type...');
      payload = await Payloads.movieDelete(data, profile);
      break;
    case Models.EventType.MovieFileDelete:
      Logger.info('-> Handling as "MovieFileDelete" event type...');
      payload = await Payloads.movieFileDelete(data, profile);
      break;
    case Models.EventType.Rename:
      Logger.info('-> Handling as "Rename" event type...');
      payload = await Payloads.rename(data, profile);
      break;
    case Models.EventType.Test:
      Logger.info('-> Handling as "Test" event type...');
      payload = await Payloads.test(data, profile);
      break;
    default:
      Logger.warn('-> An unknown eventType was received:', JSON.stringify(data));
      return;
  }
  await Firebase.sendNotification(devices, payload, settings);
};
