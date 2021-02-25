import { DownloadEventType, EventType, GrabEventType, RenameEventType, RetagEventType, TestEventType } from '../models/lidarr';
import { NotificationPayload } from '../payloads';
import { downloadPayload, grabPayload, renamePayload, retagPayload, testPayload } from '../payloads/lidarr';
import { Firebase } from '../utilities/firebase';
import { Logger } from '../utilities/logger';

/**
 * Given the request data body, execute the correct webhook handler for Lidarr.
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
        case EventType.Grab:
            Logger.debug('-> Handling as "Grab" event type...');
            payload = await grabPayload(data as GrabEventType, profile);
            break;
        case EventType.Rename:
            Logger.debug('-> Handling as "Rename" event type...');
            payload = await renamePayload(data as RenameEventType, profile);
            break;
        case EventType.Retag:
            Logger.debug('-> Handling as "Retag" event type...');
            payload = await retagPayload(data as RetagEventType, profile);
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
