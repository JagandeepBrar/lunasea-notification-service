import * as Models from '../models/tautulli';
import * as Payloads from '../payloads/tautulli';

import { Firebase } from '../utilities/firebase';
import { Logger } from '../utilities/logger';
import { NotificationPayload } from '../payloads';

/**
 * Given the request data body, execute the correct webhook handler for Tautulli.
 *
 * @param data Webhook notification payload
 * @param devices List of devices to send the notification to
 * @param profile The profile name to attach to the title
 */
export const handleWebhook = async (
  data: any,
  devices: string[],
  profile: string,
): Promise<void> => {
  Logger.debug('-> Preparing payload...');
  let payload: NotificationPayload | undefined;
  switch (data.action) {
    case Models.ActionType.BufferWarning:
      Logger.info(`-> Handling as ${Models.ActionType.BufferWarning} action type...`);
      payload = await Payloads.bufferWarningPayload(data, profile);
      break;
    case Models.ActionType.PlaybackError:
      Logger.info(`-> Handling as ${Models.ActionType.PlaybackError} action type...`);
      payload = await Payloads.playbackErrorPayload(data, profile);
      break;
    case Models.ActionType.PlaybackPause:
      Logger.info(`-> Handling as ${Models.ActionType.PlaybackPause} action type...`);
      payload = await Payloads.playbackPausePayload(data, profile);
      break;
    case Models.ActionType.PlaybackResume:
      Logger.info(`-> Handling as ${Models.ActionType.PlaybackResume} action type...`);
      payload = await Payloads.playbackResumePayload(data, profile);
      break;
    case Models.ActionType.PlaybackStart:
      Logger.info(`-> Handling as ${Models.ActionType.PlaybackStart} action type...`);
      payload = await Payloads.playbackStartPayload(data, profile);
      break;
    case Models.ActionType.PlaybackStop:
      Logger.info(`-> Handling as ${Models.ActionType.PlaybackStop} action type...`);
      payload = await Payloads.playbackStopPayload(data, profile);
      break;
    case Models.ActionType.PlexRemoteAccessBackUp:
      Logger.info(`-> Handling as ${Models.ActionType.PlexRemoteAccessBackUp} action type...`);
      payload = await Payloads.plexRemoteAccessBackUpPayload(data, profile);
      break;
    case Models.ActionType.PlexRemoteAccessDown:
      Logger.info(`-> Handling as ${Models.ActionType.PlexRemoteAccessDown} action type...`);
      payload = await Payloads.plexRemoteAccessDownPayload(data, profile);
      break;
    case Models.ActionType.PlexServerBackUp:
      Logger.info(`-> Handling as ${Models.ActionType.PlexServerBackUp} action type...`);
      payload = await Payloads.plexServerBackUpPayload(data, profile);
      break;
    case Models.ActionType.PlexServerDown:
      Logger.info(`-> Handling as ${Models.ActionType.PlexServerDown} action type...`);
      payload = await Payloads.plexServerDownPayload(data, profile);
      break;
    case Models.ActionType.PlexUpdateAvailable:
      Logger.info(`-> Handling as ${Models.ActionType.PlexUpdateAvailable} action type...`);
      payload = await Payloads.plexUpdateAvailablePayload(data, profile);
      break;
    case Models.ActionType.RecentlyAdded:
      Logger.info(`-> Handling as ${Models.ActionType.RecentlyAdded} action type...`);
      payload = await Payloads.recentlyAddedPayload(data, profile);
      break;
    case Models.ActionType.TautulliDatabaseCorruption:
      Logger.info(`-> Handling as ${Models.ActionType.TautulliDatabaseCorruption} action type...`);
      payload = await Payloads.tautulliDatabaseCorruptionPayload(data, profile);
      break;
    case Models.ActionType.TautulliUpdateAvailable:
      Logger.info(`-> Handling as ${Models.ActionType.TautulliUpdateAvailable} action type...`);
      payload = await Payloads.tautulliUpdateAvailablePayload(data, profile);
      break;
    case Models.ActionType.TranscodeDecisionChange:
      Logger.info(`-> Handling as ${Models.ActionType.TranscodeDecisionChange} action type...`);
      payload = await Payloads.transcodeDecisionChangePayload(data, profile);
      break;
    case Models.ActionType.UserConcurrentStreams:
      Logger.info(`-> Handling as ${Models.ActionType.UserConcurrentStreams} action type...`);
      payload = await Payloads.userConcurrentStreamsPayload(data, profile);
      break;
    case Models.ActionType.UserNewDevice:
      Logger.info(`-> Handling as ${Models.ActionType.UserNewDevice} action type...`);
      payload = await Payloads.userNewDevicePayload(data, profile);
      break;
    case Models.ActionType.Watched:
      Logger.info(`-> Handling as ${Models.ActionType.Watched} action type...`);
      payload = await Payloads.watchedPayload(data, profile);
      break;
    case Models.ActionType.Test:
      Logger.info(`-> Handling as ${Models.ActionType.BufferWarning} action type...`);
      payload = await Payloads.testPayload(data, profile);
      break;
  }
  if (!payload)
    switch (data.event_type) {
      case Models.EventTypeDeprecated.BufferWarning:
        Logger.info('-> Handling as "BufferWarning" event type...');
        payload = await Payloads.bufferWarningPayloadDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.PlaybackError:
        1;
        Logger.info('-> Handling as "PlaybackError" event type...');
        payload = await Payloads.playbackErrorPayloadDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.PlaybackPause:
        Logger.info('-> Handling as "PlaybackPause" event type...');
        payload = await Payloads.playbackPausePayloadDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.PlaybackResume:
        Logger.info('-> Handling as "PlaybackResume" or "resume" event type...');
        payload = await Payloads.playbackResumePayloadDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.PlaybackStart:
        Logger.info('-> Handling as "PlaybackStart" event type...');
        payload = await Payloads.playbackStartPayloadDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.PlaybackStop:
        Logger.info('-> Handling as "PlaybackStop" event type...');
        payload = await Payloads.playbackStopPayloadDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.PlexRemoteAccessBackUp:
        Logger.info('-> Handling as "PlexRemoteAccessBackUp" event type...');
        payload = await Payloads.plexRemoteAccessBackUpPayloadDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.PlexRemoteAccessDown:
        Logger.info('-> Handling as "PlexRemoteAccessDown" event type...');
        payload = await Payloads.plexRemoteAccessDownPayloadDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.PlexServerBackUp:
        Logger.info('-> Handling as "PlexServerBackUp" event type...');
        payload = await Payloads.plexServerBackUpPayloadDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.PlexServerDown:
        Logger.info('-> Handling as "PlexServerDown" event type...');
        payload = await Payloads.plexServerDownPayloadDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.PlexUpdateAvailable:
        Logger.info('-> Handling as "PlexUpdateAvailable" event type...');
        payload = await Payloads.plexUpdateAvailablePayloadDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.RecentlyAdded:
        Logger.info('-> Handling as "RecentlyAdded" event type...');
        payload = await Payloads.recentlyAddedPayloadDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.TautulliDatabaseCorruption:
        Logger.info('-> Handling as "TautulliDatabaseCorruption" event type...');
        payload = await Payloads.tautulliDatabaseCorruptionPayloadDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.TautulliUpdateAvailable:
        Logger.info('-> Handling as "TautulliUpdateAvailable" event type...');
        payload = await Payloads.tautulliUpdateAvailablePayloadDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.TranscodeDecisionChange:
        Logger.info('-> Handling as "TranscodeDecisionChange" event type...');
        payload = await Payloads.transcodeDecisionChangePayloadDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.UserConcurrentStreams:
        Logger.info('-> Handling as "UserConcurrentStreams" event type...');
        payload = await Payloads.userConcurrentStreamsPayloadDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.UserNewDevice:
        Logger.info('-> Handling as "UserNewDevice" event type...');
        payload = await Payloads.userNewDevicePayloadDeprecated(data, profile);
        break;
      case Models.EventTypeDeprecated.Watched:
        Logger.info('-> Handling as "Watched" event type...');
        payload = await Payloads.watchedPayloadDeprecated(data, profile);
        break;
    }
  if (!payload) {
    Logger.warn('-> An unknown ActionType or EventType was received:', JSON.stringify(data));
    Logger.warn('-> Failed to send to device(s).');
    return;
  }
  await Firebase.sendNotification(devices, payload);
};
