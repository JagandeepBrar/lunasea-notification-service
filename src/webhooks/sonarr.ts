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
    deleteEpisodeFileEventType,
    deleteSeriesEventType,
    downloadEventType,
    grabEventType,
    healthEventType,
    renameEventType,
    testEventType,
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
            payload = await downloadEventType(data as DownloadEventType, profile);
            break;
        case EventType.EpisodeFileDelete:
            Logger.debug('-> Handling as "EpisodeFileDelete" event type...');
            payload = await deleteEpisodeFileEventType(data as EpisodeFileDeleteEventType, profile);
            break;
        case EventType.Grab:
            Logger.debug('-> Handling as "Grab" event type...');
            payload = await grabEventType(data as GrabEventType, profile);
            break;
        case EventType.Health:
            Logger.debug('-> Handling as "Health" event type...');
            payload = await healthEventType(data as HealthEventType, profile);
            break;
        case EventType.Rename:
            Logger.debug('-> Handling as "Rename" event type...');
            payload = await renameEventType(data as RenameEventType, profile);
            break;
        case EventType.SeriesDelete:
            Logger.debug('-> Handling as "SeriesDelete" event type...');
            payload = await deleteSeriesEventType(data as SeriesDeleteEventType, profile);
            break;
        case EventType.Test:
            Logger.debug('-> Handling as "Test" event type...');
            payload = await testEventType(data as TestEventType, profile);
            break;
        default:
            Logger.warn('-> An unknown eventType was received:', data);
            Logger.warn('-> Failed to send to device(s).');
            return;
    }
    await Firebase.sendNotification(devices, payload);
};
