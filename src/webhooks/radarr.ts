import { Models } from '../models/radarr';
import { Firebase } from '../utilities/firebase';
import { Logger } from '../utilities/logger';

/**
 * Webhooks namespace to actually manage sending notifications based on the webhooks from Radarr.
 */
export namespace Webhooks {
    /**
     * Given the request data body, execute the correct webhook handler.
     *
     * @param data Webhook notification payload
     * @param devices List of devices to send the notification to
     * @param module The module name to be used in the title of the notification
     */
    export const execute = async (data: any, devices: string[], title: string): Promise<void> => {
        switch (data.eventType) {
            case Models.EventType.Download:
                await handleDownloadEventType(data as Models.DownloadEventType, devices, title);
                break;
            case Models.EventType.Grab:
                await handleGrabEventType(data as Models.GrabEventType, devices, title);
                break;
            case Models.EventType.Health:
                await handleHealthEventType(data as Models.HealthEventType, devices, title);
                break;
            case Models.EventType.Rename:
                await handleRenameEventType(data as Models.RenameEventType, devices, title);
                break;
            case Models.EventType.Test:
                await handleTestEventType(data as Models.TestEventType, devices, title);
                break;
            default:
                Logger.warn('An unknown eventType was received:', data);
                return;
        }
    };
    /**
     * Handle a "Download" event type
     *
     * @param data Request body as DownloadEventType
     * @param devices List of Firebase device tokens
     * @param title Module name to be shown before the colon in the title
     */
    const handleDownloadEventType = async (data: Models.DownloadEventType, devices: string[], title: string): Promise<void> => {
        Logger.debug('-> Handling as "Download" event type...');
        Logger.debug('-> Sending to devices...');
        const bodyLine1 = data.isUpgrade ? `Upgraded (${data.movieFile?.quality ?? 'Unknown Quality'})` : `Downloaded (${data.movieFile?.quality ?? 'Unknown Quality'})`;
        const result = await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${title}: ${data.movie?.title ?? 'Unknown Movie'}`,
            body: `${bodyLine1}`,
        });
        if (result) {
            Logger.debug('-> Sent to all devices.');
        } else {
            Logger.warn('-> Failed to send to devices.');
        }
    };

    /**
     * Handle a "Grab" event type
     *
     * @param data Request body as GrabEventType
     * @param devices List of Firebase device tokens
     * @param title Module name to be shown before the colon in the title
     */
    const handleGrabEventType = async (data: Models.GrabEventType, devices: string[], title: string): Promise<void> => {
        Logger.debug('-> Handling as "Grab" event type...');
        Logger.debug('-> Sending to devices...');
        const bodyLine1 = `Grabbed (${data.release?.quality ?? 'Unknown Quality'})`;
        const bodyLine2 = data?.release?.releaseTitle ?? 'Unknown Release';
        const result = await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${title}: ${data.movie?.title ?? 'Unknown Movie'}`,
            body: `${bodyLine1}\n${bodyLine2}`,
        });
        if (result) {
            Logger.debug('-> Sent to all devices.');
        } else {
            Logger.warn('-> Failed to send to devices.');
        }
    };

    /**
     * Handle a "Health" event type
     *
     * @param data Request body as HealthEventType
     * @param devices List of Firebase device tokens
     * @param title Module name to be shown before the colon in the title
     */
    const handleHealthEventType = async (data: Models.HealthEventType, devices: string[], title: string): Promise<void> => {
        Logger.debug('-> Handling as "Health" event type...');
        Logger.debug('-> Sending to devices...');
        const result = await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${title}: Health Check`,
            body: data.message,
        });
        if (result) {
            Logger.debug('-> Sent to all devices.');
        } else {
            Logger.warn('-> Failed to send to devices.');
        }
    };

    /**
     * Handle a "Rename" event type
     *
     * @param data Request body as RenameEventType
     * @param devices List of Firebase device tokens
     * @param title Module name to be shown before the colon in the title
     */
    const handleRenameEventType = async (data: Models.RenameEventType, devices: string[], title: string): Promise<void> => {
        Logger.debug('-> Handling as "Rename" event type...');
        Logger.debug('-> Sending to devices...');
        const result = await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${title}: ${data.movie?.title ?? 'Unknown Movie'}`,
            body: 'Files Renamed',
        });
        if (result) {
            Logger.debug('-> Sent to all devices.');
        } else {
            Logger.warn('-> Failed to send to devices.');
        }
    };

    /**
     * Handle a "Test" event type
     *
     * @param data Request body as TestEventType
     * @param devices List of Firebase device tokens
     * @param title Module name to be shown before the colon in the title
     */
    const handleTestEventType = async (data: Models.TestEventType, devices: string[], title: string): Promise<void> => {
        Logger.debug('-> Handling as "Test" event type...');
        Logger.debug('-> Sending to devices...');
        const result = await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${title}: Connection Test`,
            body: 'LunaSea is ready for Radarr notifications!',
        });
        if (result) {
            Logger.debug('-> Sent to all devices.');
        } else {
            Logger.warn('-> Failed to send to devices.');
        }
    };
}
