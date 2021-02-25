import {
    DownloadEventType,
    EpisodeFileDeleteEventType,
    EventType,
    GrabEventType,
    HealthEventType,
    RenameEventType,
    SeriesDeleteEventType,
    TestEventType,
} from '../models/sonarr';
import { NotificationPayload } from '../payloads';
import {
    deleteEpisodeFilePayload,
    deleteSeriesPayload,
    downloadPayload,
    grabPayload,
    healthPayload,
    renamePayload,
    testPayload,
} from '../payloads/sonarr';
import { Firebase } from '../utilities/firebase';
import { Logger } from '../utilities/logger';

/**
 * Given the request data body, execute the correct webhook handler.
 *
 * @param data Webhook notification payload
 * @param devices List of devices to send the notification to
 * @param profile The profile name to attach to the title
 */
export const handleWebhook = async (data: any, devices: string[], profile: string): Promise<void> => {
    Logger.debug('-> Preparing payload...');
    let payload: NotificationPayload;
    switch (data.eventType) {
        case EventType.Download:
            Logger.debug('-> Handling as "Download" event type...');
            payload = await downloadPayload(data as DownloadEventType, profile);
            break;
        case EventType.EpisodeFileDelete:
            Logger.debug('-> Handling as "EpisodeFileDelete" event type...');
            payload = await deleteEpisodeFilePayload(data as EpisodeFileDeleteEventType, profile);
            break;
        case EventType.Grab:
            Logger.debug('-> Handling as "Grab" event type...');
            payload = await grabPayload(data as GrabEventType, profile);
            break;
        case EventType.Health:
            Logger.debug('-> Handling as "Health" event type...');
            payload = await healthPayload(data as HealthEventType, profile);
            break;
        case EventType.Rename:
            Logger.debug('-> Handling as "Rename" event type...');
            payload = await renamePayload(data as RenameEventType, profile);
            break;
        case EventType.SeriesDelete:
            Logger.debug('-> Handling as "SeriesDelete" event type...');
            payload = await deleteSeriesPayload(data as SeriesDeleteEventType, profile);
            break;
        case EventType.Test:
            Logger.debug('-> Handling as "Test" event type...');
            payload = await testPayload(data as TestEventType, profile);
            break;
        default:
            Logger.warn('-> An unknown eventType was received:', data);
            Logger.warn('-> Failed to send to device(s).');
            return;
    }
    await Firebase.sendNotification(devices, payload);
};
