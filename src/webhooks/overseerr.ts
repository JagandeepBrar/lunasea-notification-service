import { Models } from '../models/overseerr';
import { LunaNotificationPayload } from '../payloads';
import { Payloads } from '../payloads/overseerr';
import { Firebase } from '../utilities/firebase';
import { Logger } from '../utilities/logger';

/**
 * Webhooks namespace to actually manage sending notifications based on the webhooks from Overseerr.
 */
export namespace Webhooks {
    /**
     * Given the request data body, execute the correct webhook handler.
     *
     * @param data Webhook notification payload
     * @param devices List of devices to send the notification to
     * @param profile The profile name to attach to the title
     */
    export const execute = async (data: Models.RequestProperties, devices: string[], profile: string): Promise<void> => {
        Logger.debug('-> Preparing payload...');
        let payload: LunaNotificationPayload;
        switch (data.notification_type) {
            case Models.NotificationType.MEDIA_APPROVED:
                Logger.debug('-> Handling as "MEDIA_APPROVED" event type...');
                payload = await Payloads.mediaApprovedNotificationType(data, profile);
                break;
            case Models.NotificationType.MEDIA_AVAILABLE:
                Logger.debug('-> Handling as "MEDIA_AVAILABLE" event type...');
                payload = await Payloads.mediaAvailableNotificationType(data, profile);
                break;
            case Models.NotificationType.MEDIA_DECLINED:
                Logger.debug('-> Handling as "MEDIA_DECLINED" event type...');
                payload = await Payloads.mediaDeclinedNotificationType(data, profile);
                break;
            case Models.NotificationType.MEDIA_FAILED:
                Logger.debug('-> Handling as "MEDIA_FAILED" event type...');
                payload = await Payloads.mediaFailedNotificationType(data, profile);
                break;
            case Models.NotificationType.MEDIA_PENDING:
                Logger.debug('-> Handling as "MEDIA_PENDING" event type...');
                payload = await Payloads.mediaPendingNotificationType(data, profile);
                break;
            case Models.NotificationType.TEST_NOTIFICATION:
                Logger.debug('-> Handling as "TEST_NOTIFICATION" event type...');
                payload = await Payloads.testNotificationType(data, profile);
                break;
            default:
                Logger.warn('-> An unknown notification_type was received:', data);
                Logger.warn('-> Failed to send to device(s).');
                return;
        }
        await Firebase.sendNotification(devices, payload);
    };
}
