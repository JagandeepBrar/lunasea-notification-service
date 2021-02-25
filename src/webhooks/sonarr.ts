import { Models } from '../models/sonarr';
import { LunaNotificationPayload } from '../payloads';
import { Payloads } from '../payloads/sonarr';
import { Firebase } from '../utilities/firebase';
import { Logger } from '../utilities/logger';
/**
 * Webhooks namespace to actually manage sending notifications based on the webhooks from Sonarr.
 */
export namespace Webhooks {
    /**
     * Given the request data body, execute the correct webhook handler.
     *
     * @param data Webhook notification payload
     * @param devices List of devices to send the notification to
     * @param profile The profile name to attach to the title
     */
    export const execute = async (data: any, devices: string[], profile: string): Promise<void> => {
        Logger.debug('-> Preparing payload...');
        let payload: LunaNotificationPayload;
        switch (data.eventType) {
            case Models.EventType.Download:
                Logger.debug('-> Handling as "Download" event type...');
                payload = await Payloads.downloadEventType(data as Models.DownloadEventType, profile);
                break;
            case Models.EventType.EpisodeFileDelete:
                Logger.debug('-> Handling as "EpisodeFileDelete" event type...');
                payload = await Payloads.deleteEpisodeFileEventType(data as Models.EpisodeFileDeleteEventType, profile);
                break;
            case Models.EventType.Grab:
                Logger.debug('-> Handling as "Grab" event type...');
                payload = await Payloads.grabEventType(data as Models.GrabEventType, profile);
                break;
            case Models.EventType.Health:
                Logger.debug('-> Handling as "Health" event type...');
                payload = await Payloads.healthEventType(data as Models.HealthEventType, profile);
                break;
            case Models.EventType.Rename:
                Logger.debug('-> Handling as "Rename" event type...');
                payload = await Payloads.renameEventType(data as Models.RenameEventType, profile);
                break;
            case Models.EventType.SeriesDelete:
                Logger.debug('-> Handling as "SeriesDelete" event type...');
                payload = await Payloads.deleteSeriesEventType(data as Models.SeriesDeleteEventType, profile);
                break;
            case Models.EventType.Test:
                Logger.debug('-> Handling as "Test" event type...');
                payload = await Payloads.testEventType(data as Models.TestEventType, profile);
                break;
            default:
                Logger.warn('-> An unknown eventType was received:', data);
                Logger.warn('-> Failed to send to device(s).');
                return;
        }
        await Firebase.sendNotification(devices, payload);
    };
}
