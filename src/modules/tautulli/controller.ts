import express from 'express';
import { Models, Payloads } from './';
import { Middleware, Models as ServerModels } from '../../server';
import { Firebase } from '../../services';
import { Constants, Logger, Notifications } from '../../utils';

export const enable = (api: express.Router) => api.use(route, router);

const router = express.Router();
const route = '/tautulli';

router.post(
  '/user/:id',
  Middleware.validateUser,
  Middleware.checkNotificationPassword,
  Middleware.pullUserTokens,
  handler,
);
router.post('/device/:id', Middleware.extractDeviceToken, handler);

/**
 * Tautulli Webhook Handler: Handles a webhook from Tautulli, and sends a notification to all devices that are in `response.locals.tokens`.
 *
 * @param request Express request object
 * @param response Express response object
 */
async function handler(request: express.Request, response: express.Response): Promise<void> {
  Logger.info('Running Tautulli webhook...');
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
  Logger.info('Finished Tautulli webhook.');
}

/**
 * Given the request data body, execute the correct webhook handler for Tautulli.
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
  let payload: Notifications.Payload | undefined;
  switch (data.action) {
    case Models.ActionType.BufferWarning:
      Logger.info(`-> Handling as ${Models.ActionType.BufferWarning} action type...`);
      payload = await Payloads.bufferWarning(data, profile);
      break;
    case Models.ActionType.PlaybackError:
      Logger.info(`-> Handling as ${Models.ActionType.PlaybackError} action type...`);
      payload = await Payloads.playbackError(data, profile);
      break;
    case Models.ActionType.PlaybackPause:
      Logger.info(`-> Handling as ${Models.ActionType.PlaybackPause} action type...`);
      payload = await Payloads.playbackPause(data, profile);
      break;
    case Models.ActionType.PlaybackResume:
      Logger.info(`-> Handling as ${Models.ActionType.PlaybackResume} action type...`);
      payload = await Payloads.playbackResume(data, profile);
      break;
    case Models.ActionType.PlaybackStart:
      Logger.info(`-> Handling as ${Models.ActionType.PlaybackStart} action type...`);
      payload = await Payloads.playbackStart(data, profile);
      break;
    case Models.ActionType.PlaybackStop:
      Logger.info(`-> Handling as ${Models.ActionType.PlaybackStop} action type...`);
      payload = await Payloads.playbackStop(data, profile);
      break;
    case Models.ActionType.PlexRemoteAccessBackUp:
      Logger.info(`-> Handling as ${Models.ActionType.PlexRemoteAccessBackUp} action type...`);
      payload = await Payloads.plexRemoteAccessBackUp(data, profile);
      break;
    case Models.ActionType.PlexRemoteAccessDown:
      Logger.info(`-> Handling as ${Models.ActionType.PlexRemoteAccessDown} action type...`);
      payload = await Payloads.plexRemoteAccessDown(data, profile);
      break;
    case Models.ActionType.PlexServerBackUp:
      Logger.info(`-> Handling as ${Models.ActionType.PlexServerBackUp} action type...`);
      payload = await Payloads.plexServerBackUp(data, profile);
      break;
    case Models.ActionType.PlexServerDown:
      Logger.info(`-> Handling as ${Models.ActionType.PlexServerDown} action type...`);
      payload = await Payloads.plexServerDown(data, profile);
      break;
    case Models.ActionType.PlexUpdateAvailable:
      Logger.info(`-> Handling as ${Models.ActionType.PlexUpdateAvailable} action type...`);
      payload = await Payloads.plexUpdateAvailable(data, profile);
      break;
    case Models.ActionType.RecentlyAdded:
      Logger.info(`-> Handling as ${Models.ActionType.RecentlyAdded} action type...`);
      payload = await Payloads.recentlyAdded(data, profile);
      break;
    case Models.ActionType.TautulliDatabaseCorruption:
      Logger.info(`-> Handling as ${Models.ActionType.TautulliDatabaseCorruption} action type...`);
      payload = await Payloads.tautulliDatabaseCorruption(data, profile);
      break;
    case Models.ActionType.TautulliUpdateAvailable:
      Logger.info(`-> Handling as ${Models.ActionType.TautulliUpdateAvailable} action type...`);
      payload = await Payloads.tautulliUpdateAvailable(data, profile);
      break;
    case Models.ActionType.TranscodeDecisionChange:
      Logger.info(`-> Handling as ${Models.ActionType.TranscodeDecisionChange} action type...`);
      payload = await Payloads.transcodeDecisionChange(data, profile);
      break;
    case Models.ActionType.UserConcurrentStreams:
      Logger.info(`-> Handling as ${Models.ActionType.UserConcurrentStreams} action type...`);
      payload = await Payloads.userConcurrentStreams(data, profile);
      break;
    case Models.ActionType.UserNewDevice:
      Logger.info(`-> Handling as ${Models.ActionType.UserNewDevice} action type...`);
      payload = await Payloads.userNewDevice(data, profile);
      break;
    case Models.ActionType.Watched:
      Logger.info(`-> Handling as ${Models.ActionType.Watched} action type...`);
      payload = await Payloads.watched(data, profile);
      break;
    case Models.ActionType.Test:
      Logger.info(`-> Handling as ${Models.ActionType.BufferWarning} action type...`);
      payload = await Payloads.test(data, profile);
      break;
  }
  if (!payload)
    switch (data.event_type) {
      case Models.EventTypeDeprecated.BufferWarning:
        Logger.info('-> Handling as "BufferWarning" event type...');
        payload = await Payloads.bufferWarningDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.PlaybackError:
        1;
        Logger.info('-> Handling as "PlaybackError" event type...');
        payload = await Payloads.playbackErrorDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.PlaybackPause:
        Logger.info('-> Handling as "PlaybackPause" event type...');
        payload = await Payloads.playbackPauseDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.PlaybackResume:
        Logger.info('-> Handling as "PlaybackResume" or "resume" event type...');
        payload = await Payloads.playbackResumeDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.PlaybackStart:
        Logger.info('-> Handling as "PlaybackStart" event type...');
        payload = await Payloads.playbackStartDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.PlaybackStop:
        Logger.info('-> Handling as "PlaybackStop" event type...');
        payload = await Payloads.playbackStopDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.PlexRemoteAccessBackUp:
        Logger.info('-> Handling as "PlexRemoteAccessBackUp" event type...');
        payload = await Payloads.plexRemoteAccessBackUpDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.PlexRemoteAccessDown:
        Logger.info('-> Handling as "PlexRemoteAccessDown" event type...');
        payload = await Payloads.plexRemoteAccessDownDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.PlexServerBackUp:
        Logger.info('-> Handling as "PlexServerBackUp" event type...');
        payload = await Payloads.plexServerBackUpDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.PlexServerDown:
        Logger.info('-> Handling as "PlexServerDown" event type...');
        payload = await Payloads.plexServerDownDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.PlexUpdateAvailable:
        Logger.info('-> Handling as "PlexUpdateAvailable" event type...');
        payload = await Payloads.plexUpdateAvailableDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.RecentlyAdded:
        Logger.info('-> Handling as "RecentlyAdded" event type...');
        payload = await Payloads.recentlyAddedDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.TautulliDatabaseCorruption:
        Logger.info('-> Handling as "TautulliDatabaseCorruption" event type...');
        payload = await Payloads.tautulliDatabaseCorruptionDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.TautulliUpdateAvailable:
        Logger.info('-> Handling as "TautulliUpdateAvailable" event type...');
        payload = await Payloads.tautulliUpdateAvailableDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.TranscodeDecisionChange:
        Logger.info('-> Handling as "TranscodeDecisionChange" event type...');
        payload = await Payloads.transcodeDecisionChangeDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.UserConcurrentStreams:
        Logger.info('-> Handling as "UserConcurrentStreams" event type...');
        payload = await Payloads.userConcurrentStreamsDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.UserNewDevice:
        Logger.info('-> Handling as "UserNewDevice" event type...');
        payload = await Payloads.userNewDeviceDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.Watched:
        Logger.info('-> Handling as "Watched" event type...');
        payload = await Payloads.watchedDeprecated(data, profile);
        break;
    }
  if (!payload) {
    Logger.warn('-> An unknown ActionType or EventType was received:', JSON.stringify(data));
    return;
  }
  await Firebase.sendNotification(devices, payload, settings);
};
