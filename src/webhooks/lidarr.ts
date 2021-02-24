import { Models } from '../models/lidarr';
import { Firebase } from '../utilities/firebase';
import { Logger } from '../utilities/logger';

/**
 * Webhooks namespace to actually manage sending notifications based on the webhooks from Lidarr.
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
            case Models.EventType.Test:
                await handleTestEventType(data as Models.TestEventType, devices, title);
                break;
            case Models.EventType.Download:
                await handleDownloadEventType(data as Models.DownloadEventType, devices, title);
                break;
            case Models.EventType.Grab:
                await handleGrabEventType(data as Models.GrabEventType, devices, title);
                break;
            case Models.EventType.Rename:
                await handleRenameEventType(data as Models.RenameEventType, devices, title);
                break;
            case Models.EventType.Retag:
                await handleRetagEventType(data as Models.RetagEventType, devices, title);
                break;
            default:
                console.log(JSON.stringify(data));
                Logger.warn('An unknown eventType was received:', data);
                return;
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
            body: 'LunaSea is ready for Lidarr notifications!',
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
     * @param data Request body as TestEventType
     * @param devices List of Firebase device tokens
     * @param title Module name to be shown before the colon in the title
     */
    const handleGrabEventType = async (data: Models.GrabEventType, devices: string[], title: string): Promise<void> => {
        Logger.debug('-> Handling as "Grab" event type...');
        Logger.debug('-> Sending to devices...');
        const bodyLine1 = data.albums?.length == 1 ? data.albums[0].title ?? 'Unknown Album' : `${data.albums?.length ?? 0} Albums`;
        const bodyLine2 = `Grabbed (${data.release?.quality ?? 'Unknown Quality'})`;
        const bodyLine3 = data?.release?.releaseTitle ?? 'Unknown Release';
        const result = await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${title}: ${data.artist?.name ?? 'Unknown Artist'}`,
            body: `${bodyLine1}\n${bodyLine2}\n${bodyLine3}`,
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
     * @param module Module name to be shown before the colon in the title
     */
    const handleRenameEventType = async (data: Models.RenameEventType, devices: string[], module: string): Promise<void> => {
        Logger.debug('-> Handling as "Rename" event type...');
        Logger.debug('-> Sending to devices...');
        const result = await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${module}: ${data.artist?.name ?? 'Unknown Artist'}`,
            body: 'Files Renamed',
        });
        if (result) {
            Logger.debug('-> Sent to all devices.');
        } else {
            Logger.warn('-> Failed to send to devices.');
        }
    };

    /**
     * Handle a "Retag" event type
     *
     * @param data Request body as RetagEventType
     * @param devices List of Firebase device tokens
     * @param module Module name to be shown before the colon in the title
     */
    const handleRetagEventType = async (data: Models.RetagEventType, devices: string[], module: string): Promise<void> => {
        Logger.debug('-> Handling as "Retag" event type...');
        Logger.debug('-> Sending to devices...');
        const result = await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${module}: ${data.artist?.name ?? 'Unknown Artist'}`,
            body: 'Track Retagged',
        });
        if (result) {
            Logger.debug('-> Sent to all devices.');
        } else {
            Logger.warn('-> Failed to send to devices.');
        }
    };

    /**
     * Handle a "Download" event type
     *
     * @param data Request body as DownloadEventType
     * @param devices List of Firebase device tokens
     * @param module Module name to be shown before the colon in the title
     */
    const handleDownloadEventType = async (data: Models.DownloadEventType, devices: string[], module: string): Promise<void> => {
        Logger.debug('-> Handling as "Download" event type...');
        Logger.debug('-> Sending to devices...');
        const bodyLine1 = data.tracks?.length == 1 ? data.tracks[0].title ?? 'Unknown Track' : `${data.tracks?.length ?? 0} Tracks`;
        const quality = data.tracks && data.tracks.length > 0 ? data.tracks[0]?.quality ?? 'Unknown Quality' : 'Unknown Quality';
        const bodyLine2 = data.isUpgrade ? `Upgraded (${quality})` : `Downloaded (${quality})`;
        const result = await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${module}: ${data.artist?.name ?? 'Unknown Artist'}`,
            body: `${bodyLine1}\n${bodyLine2}`,
        });
        if (result) {
            Logger.debug('-> Sent to all devices.');
        } else {
            Logger.warn('-> Failed to send to devices.');
        }
    };
}
