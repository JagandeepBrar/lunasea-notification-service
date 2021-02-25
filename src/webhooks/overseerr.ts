import { NotificationType, RequestProperties } from '../models/overseerr';
import { NotificationPayload } from '../payloads';
import {
    mediaApprovedNotificationType,
    mediaAvailableNotificationType,
    mediaDeclinedNotificationType,
    mediaFailedNotificationType,
    mediaPendingNotificationType,
    testNotificationType,
} from '../payloads/overseerr';
import { Firebase } from '../utilities/firebase';
import { Logger } from '../utilities/logger';

/**
 * Given the request data body, execute the correct webhook handler for Overseerr.
 *
 * @param data Webhook notification payload
 * @param devices List of devices to send the notification to
 * @param profile The profile name to attach to the title
 */
export const handleWebhook = async (data: RequestProperties, devices: string[], profile: string): Promise<void> => {
    Logger.debug('-> Preparing payload...');
    let payload: NotificationPayload;
    switch (data.notification_type) {
        case NotificationType.MEDIA_APPROVED:
            Logger.debug('-> Handling as "MEDIA_APPROVED" event type...');
            payload = await mediaApprovedNotificationType(data, profile);
            break;
        case NotificationType.MEDIA_AVAILABLE:
            Logger.debug('-> Handling as "MEDIA_AVAILABLE" event type...');
            payload = await mediaAvailableNotificationType(data, profile);
            break;
        case NotificationType.MEDIA_DECLINED:
            Logger.debug('-> Handling as "MEDIA_DECLINED" event type...');
            payload = await mediaDeclinedNotificationType(data, profile);
            break;
        case NotificationType.MEDIA_FAILED:
            Logger.debug('-> Handling as "MEDIA_FAILED" event type...');
            payload = await mediaFailedNotificationType(data, profile);
            break;
        case NotificationType.MEDIA_PENDING:
            Logger.debug('-> Handling as "MEDIA_PENDING" event type...');
            payload = await mediaPendingNotificationType(data, profile);
            break;
        case NotificationType.TEST_NOTIFICATION:
            Logger.debug('-> Handling as "TEST_NOTIFICATION" event type...');
            payload = await testNotificationType(data, profile);
            break;
        default:
            Logger.warn('-> An unknown notification_type was received:', data);
            Logger.warn('-> Failed to send to device(s).');
            return;
    }
    await Firebase.sendNotification(devices, payload);
};
