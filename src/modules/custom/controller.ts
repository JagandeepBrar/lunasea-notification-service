import express from 'express';
import { Middleware, Models as ServerModels } from '../../server';
import { Firebase } from '../../services';
import { Constants, Logger, Notifications } from '../../utils';

export const enable = (api: express.Router) => api.use(route, router);

const router = express.Router();
const route = '/custom';

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
    response.status(200).json(<ServerModels.Response>{ message: Constants.MESSAGE.OK });
    Logger.debug('-> HTTP response sent (200 OK)');
    await _handleWebhook(
      request.body,
      response.locals.tokens,
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
  Logger.info('Finished Custom webhook.');
}

/**
 * Given the request data body, execute the correct webhook handler for a custom notification.
 *
 * @private
 * @param data Webhook notification payload
 * @param devices List of devices to send the notification to
 * @param settings Notification settings
 */
const _handleWebhook = async (
  data: any,
  devices: string[],
  settings: Notifications.Settings,
): Promise<void> => {
  Logger.debug('-> Preparing payload...');
  const payload = <Notifications.Payload>{
    title: data?.title ?? 'Unknown Title',
    body: data?.body ?? 'Unknown Content',
    image: data?.image,
  };
  await Firebase.sendNotification(devices, payload, settings);
};
