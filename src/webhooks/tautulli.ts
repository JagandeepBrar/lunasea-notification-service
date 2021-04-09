import * as Models from '../models/tautulli';
import { NotificationPayload } from '../payloads';
import * as Payloads from '../payloads/tautulli';
import { Firebase } from '../utilities/firebase';
import { Logger } from '../utilities/logger';

/**
 * Given the request data body, execute the correct webhook handler for Tautulli.
 *
 * @param data Webhook notification payload
 * @param devices List of devices to send the notification to
 * @param profile The profile name to attach to the title
 */
export const handleWebhook = async (data: any, devices: string[], profile: string): Promise<void> => {
    Logger.debug('-> Preparing payload...');
    let payload: NotificationPayload;
    switch (data.event_type) {
        case Models.EventType.BufferWarning:
            Logger.info('-> Handling as "BufferWarning" event type...');
            payload = await Payloads.bufferWarningPayload(data, profile);
            break;
        case Models.EventType.PlaybackError:
            Logger.info('-> Handling as "PlaybackStop" event type...');
            payload = await Payloads.playbackErrorPayload(data, profile);
            break;
        case Models.EventType.PlaybackPause:
            Logger.info('-> Handling as "PlaybackPause" event type...');
            payload = await Payloads.playbackPausePayload(data, profile);
            break;
        case Models.EventType.PlaybackResume:
            Logger.info('-> Handling as "PlaybackResume" event type...');
            payload = await Payloads.playbackResumePayload(data, profile);
            break;
        case Models.EventType.PlaybackStart:
            Logger.info('-> Handling as "PlaybackStart" event type...');
            payload = await Payloads.playbackStartPayload(data, profile);
            break;
        case Models.EventType.PlaybackStop:
            Logger.info('-> Handling as "PlaybackStop" event type...');
            payload = await Payloads.playbackStopPayload(data, profile);
            break;
        case Models.EventType.PlexRemoteAccessBackUp:
            Logger.info('-> Handling as "PlexRemoteAccessBackUp" event type...');
            payload = await Payloads.plexRemoteAccessBackUpPayload(data, profile);
            break;
        case Models.EventType.PlexRemoteAccessDown:
            Logger.info('-> Handling as "PlexRemoteAccessDown" event type...');
            payload = await Payloads.plexRemoteAccessDownPayload(data, profile);
            break;
        case Models.EventType.PlexServerBackUp:
            Logger.info('-> Handling as "PlexServerBackUp" event type...');
            payload = await Payloads.plexServerBackUpPayload(data, profile);
            break;
        case Models.EventType.PlexServerDown:
            Logger.info('-> Handling as "PlexServerDown" event type...');
            payload = await Payloads.plexServerDownPayload(data, profile);
            break;
        case Models.EventType.PlexUpdateAvailable:
            Logger.info('-> Handling as "PlexUpdateAvailable" event type...');
            payload = await Payloads.plexUpdateAvailablePayload(data, profile);
            break;
        case Models.EventType.RecentlyAdded:
            Logger.info('-> Handling as "RecentlyAdded" event type...');
            payload = await Payloads.recentlyAddedPayload(data, profile);
            break;
        case Models.EventType.TautulliDatabaseCorruption:
            Logger.info('-> Handling as "TautulliDatabaseCorruption" event type...');
            payload = await Payloads.tautulliDatabaseCorruptionPayload(data, profile);
            break;
        case Models.EventType.TautulliUpdateAvailable:
            Logger.info('-> Handling as "TautulliUpdateAvailable" event type...');
            payload = await Payloads.tautulliUpdateAvailablePayload(data, profile);
            break;
        case Models.EventType.TranscodeDecisionChange:
            Logger.info('-> Handling as "TranscodeDecisionChange" event type...');
            payload = await Payloads.transcodeDecisionChangePayload(data, profile);
            break;
        case Models.EventType.UserConcurrentStreams:
            Logger.info('-> Handling as "UserConcurrentStreams" event type...');
            payload = await Payloads.userConcurrentStreamsPayload(data, profile);
            break;
        case Models.EventType.UserNewDevice:
            Logger.info('-> Handling as "UserNewDevice" event type...');
            payload = await Payloads.userNewDevicePayload(data, profile);
            break;
        case Models.EventType.Watched:
            Logger.info('-> Handling as "Watched" event type...');
            payload = await Payloads.watchedPayload(data, profile);
            break;
        default:
            Logger.warn('-> An unknown eventType was received:', JSON.stringify(data));
            Logger.warn('-> Failed to send to device(s).');
            return;
    }
    await Firebase.sendNotification(devices, payload);
};
