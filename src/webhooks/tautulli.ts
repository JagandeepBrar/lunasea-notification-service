import { EventType, PlaybackPauseEventType } from '../models/tautulli';
import { NotificationPayload } from '../payloads';
import { playbackPausePayload, playbackResumePayload, playbackStartPayload, playbackStopPayload } from '../payloads/tautulli';
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
        case EventType.PlaybackPause:
            Logger.debug('-> Handling as "PlaybackPause" event type...');
            payload = await playbackPausePayload(data as PlaybackPauseEventType, profile);
            break;
        case EventType.PlaybackResume:
            Logger.debug('-> Handling as "PlaybackResume" event type...');
            payload = await playbackResumePayload(data as PlaybackPauseEventType, profile);
            break;
        case EventType.PlaybackStart:
            Logger.debug('-> Handling as "PlaybackStart" event type...');
            payload = await playbackStartPayload(data as PlaybackPauseEventType, profile);
            break;
        case EventType.PlaybackStop:
            Logger.debug('-> Handling as "PlaybackStop" event type...');
            payload = await playbackStopPayload(data as PlaybackPauseEventType, profile);
            break;
        default:
            Logger.warn('-> An unknown eventType was received:', data);
            Logger.warn('-> Failed to send to device(s).');
            return;
    }
    await Firebase.sendNotification(devices, payload);
};
