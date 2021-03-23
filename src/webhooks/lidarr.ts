import * as Models from '../models/lidarr';
import { NotificationPayload } from '../payloads';
import * as Payloads from '../payloads/lidarr';
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
        case Models.EventType.Download:
            Logger.debug('-> Handling as "Download" event type...');
            payload = await Payloads.downloadPayload(data as Models.DownloadEventType, profile);
            break;
        case Models.EventType.Grab:
            Logger.debug('-> Handling as "Grab" event type...');
            payload = await Payloads.grabPayload(data as Models.GrabEventType, profile);
            break;
        case Models.EventType.Rename:
            Logger.debug('-> Handling as "Rename" event type...');
            payload = await Payloads.renamePayload(data as Models.RenameEventType, profile);
            break;
        case Models.EventType.Retag:
            Logger.debug('-> Handling as "Retag" event type...');
            payload = await Payloads.retagPayload(data as Models.RetagEventType, profile);
            break;
        case Models.EventType.Test:
            Logger.debug('-> Handling as "Test" event type...');
            payload = await Payloads.testPayload(data as Models.TestEventType, profile);
            break;
        default:
            Logger.warn('-> An unknown eventType was received:', data);
            Logger.warn('-> Failed to send to device(s).');
            return;
    }
    await Firebase.sendNotification(devices, payload);
};
