import { Models } from '../models/overseerr';
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
     * @param title The module name to be used in the title of the notification
     */
    export const execute = async (data: Models.RequestProperties, devices: string[], title: string): Promise<void> => {
        switch (data.notification_type) {
            case Models.NotificationType.MEDIA_APPROVED:
                await handleMediaApprovedNotificationType(data, devices, title);
                break;
            case Models.NotificationType.MEDIA_AVAILABLE:
                await handleMediaAvailableNotificationType(data, devices, title);
                break;
            case Models.NotificationType.MEDIA_DECLINED:
                await handleMediaDeclinedNotificationType(data, devices, title);
                break;
            case Models.NotificationType.MEDIA_FAILED:
                await handleMediaFailedNotificationType(data, devices, title);
                break;
            case Models.NotificationType.MEDIA_PENDING:
                await handleMediaPendingNotificationType(data, devices, title);
                break;
            case Models.NotificationType.TEST_NOTIFICATION:
                await handleTestNotificationType(data, devices, title);
                break;
            default:
                Logger.warn('An unknown notification_type was received.', data);
                return;
        }
    };

    /**
     * Handle a "MEDIA_APPROVED" notification type
     *
     * @param data Request body as RequestProperties
     * @param devices List of Firebase device tokens
     * @param title Module name to be shown before the colon in the title
     */
    const handleMediaApprovedNotificationType = async (data: Models.RequestProperties, devices: string[], title: string): Promise<void> => {
        Logger.debug(`-> Handling as ${data.notification_type} event type...`);
        Logger.debug('-> Sending to devices...');
        const result = await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${title}: ${data.media?.media_type === Models.MediaType.MOVIE ? 'Movie' : 'Series'} Approved`,
            body: `${data.subject}\nOriginally Requested by ${data.username}`,
        });
        if (result) {
            Logger.debug('-> Sent to all devices.');
        } else {
            Logger.warn('-> Failed to send to devices.');
        }
    };

    /**
     * Handle a "MEDIA_AVAILABLE" notification type
     *
     * @param data Request body as RequestProperties
     * @param devices List of Firebase device tokens
     * @param title Module name to be shown before the colon in the title
     */
    const handleMediaAvailableNotificationType = async (data: Models.RequestProperties, devices: string[], title: string): Promise<void> => {
        Logger.debug(`-> Handling as ${data.notification_type} event type...`);
        Logger.debug('-> Sending to devices...');
        const result = await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${title}: ${data.media?.media_type === Models.MediaType.MOVIE ? 'Movie' : 'Series'} Available`,
            body: `${data.subject}\nOriginally Requested by ${data.username}`,
        });
        if (result) {
            Logger.debug('-> Sent to all devices.');
        } else {
            Logger.warn('-> Failed to send to devices.');
        }
    };

    /**
     * Handle a "MEDIA_DECLINED" notification type
     *
     * @param data Request body as RequestProperties
     * @param devices List of Firebase device tokens
     * @param title Module name to be shown before the colon in the title
     */
    const handleMediaDeclinedNotificationType = async (data: Models.RequestProperties, devices: string[], title: string): Promise<void> => {
        Logger.debug(`-> Handling as ${data.notification_type} event type...`);
        Logger.debug('-> Sending to devices...');
        const result = await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${title}: ${data.media?.media_type === Models.MediaType.MOVIE ? 'Movie' : 'Series'} Declined`,
            body: `${data.subject}\nOriginally Requested by ${data.username}`,
        });
        if (result) {
            Logger.debug('-> Sent to all devices.');
        } else {
            Logger.warn('-> Failed to send to devices.');
        }
    };

    /**
     * Handle a "MEDIA_FAILED" notification type
     *
     * @param data Request body as RequestProperties
     * @param devices List of Firebase device tokens
     * @param title Module name to be shown before the colon in the title
     */
    const handleMediaFailedNotificationType = async (data: Models.RequestProperties, devices: string[], title: string): Promise<void> => {
        Logger.debug(`-> Handling as ${data.notification_type} event type...`);
        Logger.debug('-> Sending to devices...');
        const result = await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${title}: ${data.media?.media_type === Models.MediaType.MOVIE ? 'Movie' : 'Series'} Failed`,
            body: `${data.subject}\n${data.message}`,
        });
        if (result) {
            Logger.debug('-> Sent to all devices.');
        } else {
            Logger.warn('-> Failed to send to devices.');
        }
    };

    /**
     * Handle a "MEDIA_PENDING" notification type
     *
     * @param data Request body as RequestProperties
     * @param devices List of Firebase device tokens
     * @param title Module name to be shown before the colon in the title
     */
    const handleMediaPendingNotificationType = async (data: Models.RequestProperties, devices: string[], title: string): Promise<void> => {
        Logger.debug(`-> Handling as ${data.notification_type} event type...`);
        Logger.debug('-> Sending to devices...');
        const result = await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${title}: ${data.media?.media_type === Models.MediaType.MOVIE ? 'Movie' : 'Series'} Requested`,
            body: `${data.subject}\nOriginally Requested by ${data.username}`,
        });
        if (result) {
            Logger.debug('-> Sent to all devices.');
        } else {
            Logger.warn('-> Failed to send to devices.');
        }
    };

    /**
     * Handle a "TEST_NOTIFICATION" notification type
     *
     * @param data Request body as RequestProperties
     * @param devices List of Firebase device tokens
     * @param title Module name to be shown before the colon in the title
     */
    const handleTestNotificationType = async (data: Models.RequestProperties, devices: string[], title: string): Promise<void> => {
        Logger.debug(`-> Handling as ${data.notification_type} event type...`);
        Logger.debug('-> Sending to devices...');
        const result = await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${title}: Connection Test`,
            body: 'LunaSea is ready for Overseerr notifications!',
        });
        if (result) {
            Logger.debug('-> Sent to all devices.');
        } else {
            Logger.warn('-> Failed to send to devices.');
        }
    };
}
