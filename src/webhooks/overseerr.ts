import * as Models from '../models/overseerr';
import { NotificationPayload } from '../payloads';
import * as Payloads from '../payloads/overseerr';
import { Firebase } from '../utilities/firebase';
import { Logger } from '../utilities/logger';

/**
 * Given the request data body, execute the correct webhook handler for Overseerr.
 *
 * @param data Webhook notification payload
 * @param devices List of devices to send the notification to
 * @param profile The profile name to attach to the title
 */
export const handleWebhook = async (data: Models.RequestProperties, devices: string[], profile: string): Promise<void> => {
    Logger.debug('-> Preparing payload...');
    let payload: NotificationPayload;
    switch (data.notification_type) {
        case Models.NotificationType.MEDIA_APPROVED:
            Logger.debug('-> Handling as "MEDIA_APPROVED" event type...');
            payload = await Payloads.mediaApprovedPayload(data, profile);
            break;
        case Models.NotificationType.MEDIA_AUTO_APPROVED:
            Logger.debug('-> Handling as "MEDIA_AUTO_APPROVED" event type...');
            payload = await Payloads.mediaAutoApprovedPayload(data, profile);
            break;
        case Models.NotificationType.MEDIA_AVAILABLE:
            Logger.debug('-> Handling as "MEDIA_AVAILABLE" event type...');
            payload = await Payloads.mediaAvailablePayload(data, profile);
            break;
        case Models.NotificationType.MEDIA_DECLINED:
            Logger.debug('-> Handling as "MEDIA_DECLINED" event type...');
            payload = await Payloads.mediaDeclinedPayload(data, profile);
            break;
        case Models.NotificationType.MEDIA_FAILED:
            Logger.debug('-> Handling as "MEDIA_FAILED" event type...');
            payload = await Payloads.mediaFailedPayload(data, profile);
            break;
        case Models.NotificationType.MEDIA_PENDING:
            Logger.debug('-> Handling as "MEDIA_PENDING" event type...');
            payload = await Payloads.mediaPendingPayload(data, profile);
            break;
        case Models.NotificationType.TEST_NOTIFICATION:
            Logger.debug('-> Handling as "TEST_NOTIFICATION" event type...');
            payload = await Payloads.testPayload(data, profile);
            break;
        default:
            Logger.warn('-> An unknown notification_type was received:', data);
            Logger.warn('-> Failed to send to device(s).');
            return;
    }
    await Firebase.sendNotification(devices, payload);
};
