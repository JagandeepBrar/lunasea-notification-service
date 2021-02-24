import { Models } from '../models/sonarr';
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
     * @param module The module name to be used in the title of the notification
     */
    export const execute = async (data: any, devices: string[], title: string): Promise<void> => {
        switch (data.eventType) {
            case Models.EventType.Download:
                await handleDownloadEventType(data as Models.DownloadEventType, devices, title);
                break;
            case Models.EventType.EpisodeFileDelete:
                await handleDeleteEpisodeFileEventType(data as Models.EpisodeFileDeleteEventType, devices, title);
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
            case Models.EventType.SeriesDelete:
                await handleDeleteSeriesEventType(data as Models.SeriesDeleteEventType, devices, title);
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
     * Handle a "EpisodeFileDelete" event type
     *
     * @param data Request body as RenameEventType
     * @param devices List of Firebase device tokens
     * @param module Module name to be shown before the colon in the title
     */
    const handleDeleteEpisodeFileEventType = async (data: Models.EpisodeFileDeleteEventType, devices: string[], module: string): Promise<void> => {
        Logger.debug('-> Handling as "EpisodeFileDelete" event type...');
        Logger.debug('-> Sending to devices...');
        const bodyLine1 = data.episodes?.length == 1 ? `Season ${data.episodes[0].seasonNumber} – Episode ${data.episodes[0].episodeNumber}` : `${data.episodes.length} Episodes`;
        const bodyLine2 = 'Episode File Deleted';
        const result = await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${module}: ${data.series.title}`,
            body: `${bodyLine1}\n${bodyLine2}`,
        });
        if (result) {
            Logger.debug('-> Sent to all devices.');
        } else {
            Logger.warn('-> Failed to send to devices.');
        }
    };

    /**
     * Handle a "SeriesDelete" event type
     *
     * @param data Request body as RenameEventType
     * @param devices List of Firebase device tokens
     * @param module Module name to be shown before the colon in the title
     */
    const handleDeleteSeriesEventType = async (data: Models.SeriesDeleteEventType, devices: string[], module: string): Promise<void> => {
        Logger.debug('-> Handling as "SeriesDelete" event type...');
        Logger.debug('-> Sending to devices...');
        let body = 'Series Deleted';
        if (data.deletedFiles) body += '(With Files)';
        const result = await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${module}: ${data.series.title}`,
            body: body,
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
        const bodyLine1 = data.episodes?.length == 1 ? `Season ${data.episodes[0].seasonNumber} – Episode ${data.episodes[0].episodeNumber}` : `${data.episodes.length} Episodes`;
        const bodyLine2 = data.isUpgrade ? `Episode Upgraded (${data.episodeFile.quality})` : `Episode Downloaded (${data.episodeFile.quality})`;
        const result = await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${module}: ${data.series?.title ?? 'Unknown Series'}`,
            body: `${bodyLine1}\n${bodyLine2}`,
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
     * @param module Module name to be shown before the colon in the title
     */
    const handleGrabEventType = async (data: Models.GrabEventType, devices: string[], module: string): Promise<void> => {
        Logger.debug('-> Handling as "Grab" event type...');
        Logger.debug('-> Sending to devices...');
        const bodyLine1 = data.episodes?.length == 1 ? `Season ${data.episodes[0].seasonNumber} – Episode ${data.episodes[0].episodeNumber}` : `${data.episodes.length} Episodes`;
        const bodyLine2 = `Episode Grabbed (${data.release.quality})`;
        const bodyLine3 = data.release?.releaseTitle ?? 'Unknown Release';
        const result = await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${module}: ${data.series?.title ?? 'Unknown Series'}`,
            body: `${bodyLine1}\n${bodyLine2}\n${bodyLine3}`,
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
     * @param module Module name to be shown before the colon in the title
     */
    const handleHealthEventType = async (data: Models.HealthEventType, devices: string[], module: string): Promise<void> => {
        Logger.debug('-> Handling as "Health" event type...');
        Logger.debug('-> Sending to devices...');
        const result = await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${module}: Health Check`,
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
     * @param module Module name to be shown before the colon in the title
     */
    const handleRenameEventType = async (data: Models.RenameEventType, devices: string[], module: string): Promise<void> => {
        Logger.debug('-> Handling as "Rename" event type...');
        Logger.debug('-> Sending to devices...');
        const result = await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${module}: ${data.series.title}`,
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
     * @param module Module name to be shown before the colon in the title
     */
    const handleTestEventType = async (data: Models.TestEventType, devices: string[], module: string): Promise<void> => {
        Logger.debug('-> Handling as "Test" event type...');
        Logger.debug('-> Sending to devices...');
        const result = await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${module}: Connection Test`,
            body: 'LunaSea is ready for Sonarr notifications!',
        });
        if (result) {
            Logger.debug('-> Sent to all devices.');
        } else {
            Logger.warn('-> Failed to send to devices.');
        }
    };
}
