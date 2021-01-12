import { Constants } from '@lunasea-notification-relay/core/constants';
import { Firebase } from '@lunasea-notification-relay/core/firebase';
import { ELogger, Logger } from '@lunasea-notification-relay/core/logger';
import { Server } from '@lunasea-notification-relay/server';
import { Middleware } from '@lunasea-notification-relay/server/v1/middleware';
import express from 'express';

/**
 * Sonarr namespace to contain all Sonarr-related interfaces, enums, and handlers
 */
export namespace Sonarr {
    /**
     * ROUTING AND HANDLER
     **/

    // Create a router, and add the handler route
    export const router = express.Router();
    router.post(
        '/user/:id',
        Middleware.checkIdentifierExists,
        Middleware.validateUser,
        Middleware.checkNotificationPassword,
        Middleware.extractProfile,
        userHandler,
    );
    router.post('/device/:id', Middleware.checkIdentifierExists, Middleware.extractProfile, deviceHandler);

    /**
     * Sonarr User Handler: Handles a webhook from Sonarr, and sends a notification to all devices that are attached to the calling account.
     *
     * @param request Express request object
     * @param response Express response object
     */
    async function userHandler(request: express.Request, response: express.Response): Promise<void> {
        Logger.info('Running Sonarr [user] webhook...');
        try {
            Logger.debug('-> Sending HTTP response to complete webhook...');
            response.status(200).json(<Server.Response>{ message: Constants.MSG_OK });
            Logger.debug('-> HTTP response sent (200 OK)');
            const devices: string[] = await Firebase.getDeviceTokenList(request.params.id);
            const module = request.params.profile && request.params.profile !== 'default' ? `Sonarr (${request.params.profile})` : 'Sonarr';
            Logger.debug('->', devices?.length ?? 0, 'device(s) found');
            if ((devices?.length ?? 0) > 0) {
                switch (request.body['eventType']) {
                    case EventType.Download:
                        await handleDownloadEventType(request.body as DownloadEventType, devices, module);
                        break;
                    case EventType.Grab:
                        await handleGrabEventType(request.body as GrabEventType, devices, module);
                        break;
                    case EventType.Health:
                        await handleHealthEventType(request.body as HealthEventType, devices, module);
                        break;
                    case EventType.Rename:
                        await handleRenameEventType(request.body as RenameEventType, devices, module);
                        break;
                    case EventType.Test:
                        await handleTestEventType(request.body as TestEventType, devices, module);
                        break;
                    default:
                        Logger.warn('An unknown eventType was received:', request.body['eventType'], request.body);
                        return;
                }
            }
        } catch (error) {
            ELogger.error(error.message);
            Logger.debug('-> Sending HTTP response to complete webhook...');
            response.status(500).json(<Server.Response>{ message: Constants.MSG_INTERNAL_SERVER_ERROR });
            Logger.debug('HTTP response sent (500 Internal Server Error)');
        }
        Logger.info('Finished Sonarr [user] webhook.');
    }

    /**
     * Sonarr Device Handler: Handles a webhook from Sonarr [device ID], and sends a notification to the single device.
     *
     * @param request Express request object
     * @param response Express response object
     */
    async function deviceHandler(request: express.Request, response: express.Response): Promise<void> {
        Logger.info('Running Sonarr [device] webhook...');
        try {
            Logger.debug('-> Sending HTTP response to complete webhook...');
            response.status(200).json(<Server.Response>{ message: Constants.MSG_OK });
            Logger.debug('-> HTTP response sent (200 OK)');
            const devices: string[] = [request.params.id];
            const module = request.params.profile && request.params.profile !== 'default' ? `Sonarr (${request.params.profile})` : 'Sonarr';
            switch (request.body['eventType']) {
                case EventType.Download:
                    await handleDownloadEventType(request.body as DownloadEventType, devices, module);
                    break;
                case EventType.Grab:
                    await handleGrabEventType(request.body as GrabEventType, devices, module);
                    break;
                case EventType.Health:
                    await handleHealthEventType(request.body as HealthEventType, devices, module);
                    break;
                case EventType.Rename:
                    await handleRenameEventType(request.body as RenameEventType, devices, module);
                    break;
                case EventType.Test:
                    await handleTestEventType(request.body as TestEventType, devices, module);
                    break;
                default:
                    Logger.warn('An unknown eventType was received:', request.body['eventType'], request.body);
                    return;
            }
        } catch (error) {
            ELogger.error(error.message);
            Logger.debug('Sending HTTP response to complete webhook...');
            response.status(500).json(<Server.Response>{ message: Constants.MSG_INTERNAL_SERVER_ERROR });
            Logger.debug('HTTP response sent (500 Internal Server Error)');
        }
        Logger.info('Finished Sonarr [device] webhook.');
    }

    /**
     * Handle a "Download" event type
     *
     * @param data Request body as DownloadEventType
     * @param devices List of Firebase device tokens
     */
    const handleDownloadEventType = async (data: DownloadEventType, devices: string[], module: string): Promise<void> => {
        Logger.debug('-> Handling as "Download" event type...');
        Logger.debug('-> Sending to devices...');
        const bodyLine1 =
            data.episodes?.length == 1
                ? `Season ${data.episodes[0].seasonNumber} – Episode ${data.episodes[0].episodeNumber}`
                : `${data.episodes.length} Episodes`;
        const bodyLine2 = data.isUpgrade
            ? `Episode Upgraded (${data.episodeFile.quality})`
            : `Episode Downloaded (${data.episodeFile.quality})`;
        (await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${module}: ${data.series?.title ?? 'Unknown Series'}`,
            body: `${bodyLine1}\n${bodyLine2}`,
        }))
            ? Logger.debug('-> Sent to all devices.')
            : Logger.debug('-> Failed to send to devices.');
    };

    /**
     * Handle a "Grab" event type
     *
     * @param data Request body as GrabEventType
     * @param devices List of Firebase device tokens
     */
    const handleGrabEventType = async (data: GrabEventType, devices: string[], module: string): Promise<void> => {
        Logger.debug('-> Handling as "Grab" event type...');
        Logger.debug('-> Sending to devices...');
        const bodyLine1 =
            data.episodes?.length == 1
                ? `Season ${data.episodes[0].seasonNumber} – Episode ${data.episodes[0].episodeNumber}`
                : `${data.episodes.length} Episodes`;
        const bodyLine2 = `Episode Grabbed (${data.release.quality})`;
        const bodyLine3 = data.release?.releaseTitle ?? 'Unknown Release';
        (await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${module}: ${data.series?.title ?? 'Unknown Series'}`,
            body: `${bodyLine1}\n${bodyLine2}\n${bodyLine3}`,
        }))
            ? Logger.debug('-> Sent to all devices.')
            : Logger.debug('-> Failed to send to devices.');
    };

    /**
     * Handle a "Health" event type
     *
     * @param data Request body as HealthEventType
     * @param devices List of Firebase device tokens
     */
    const handleHealthEventType = async (data: HealthEventType, devices: string[], module: string): Promise<void> => {
        Logger.debug('-> Handling as "Health" event type...');
        Logger.debug('-> Sending to devices...');
        (await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${module}: Health Check`,
            body: data.message,
        }))
            ? Logger.debug('-> Sent to all devices.')
            : Logger.debug('-> Failed to send to devices.');
    };

    /**
     * Handle a "Rename" event type
     *
     * @param data Request body as RenameEventType
     * @param devices List of Firebase device tokens
     */
    const handleRenameEventType = async (data: RenameEventType, devices: string[], module: string): Promise<void> => {
        Logger.debug('-> Handling as "Rename" event type...');
        Logger.debug('-> Sending to devices...');
        (await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${module}: ${data.series.title}`,
            body: 'Files Renamed',
        }))
            ? Logger.debug('-> Sent to all devices.')
            : Logger.debug('-> Failed to send to devices.');
    };

    /**
     * Handle a "Test" event type
     *
     * @param data Request body as TestEventType
     * @param devices List of Firebase device tokens
     */
    const handleTestEventType = async (data: TestEventType, devices: string[], module: string): Promise<void> => {
        Logger.debug('-> Handling as "Test" event type...');
        Logger.debug('-> Sending to devices...');
        (await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${module}: Connection Test`,
            body: 'LunaSea is ready for Sonarr notifications!',
        }))
            ? Logger.debug('-> Sent to all devices.')
            : Logger.debug('-> Failed to send to devices.');
    };

    /**
     * DATA/MODEL STRUCTURES
     **/

    /**
     * All possible event types for the webhook
     */
    enum EventType {
        Download = 'Download',
        Grab = 'Grab',
        Health = 'Health',
        Rename = 'Rename',
        Test = 'Test',
    }

    /**
     * All possible series types
     */
    enum SeriesType {
        Standard = 'standard',
        Anime = 'anime',
        Daily = 'daily',
    }

    /**
     * Series object containing series details for a request
     */
    interface SeriesProperties {
        id: number;
        title: string;
        path: string;
        type: SeriesType;
        tvdbId?: number;
        tvMazeId?: number;
        imdbId?: string;
    }

    /**
     * Episode object containing episode details for a request
     */
    interface EpisodeProperties {
        id: number;
        episodeNumber: number;
        seasonNumber: number;
        title: string;
        airDate?: string;
        airDateUtc?: string;
    }

    /**
     * Release object containing release details for a request
     */
    interface ReleaseProperties {
        quality: string;
        qualityVersion: number;
        releaseGroup: string;
        releaseTitle: string;
        indexer: string;
        size: number;
    }

    /**
     * Episode file object containing episode file details for a request
     */
    interface EpisodeFileProperties {
        id: number;
        relativePath: string;
        path: string;
        quality: string;
        qualityVersion: number;
        releaseGroup: string;
        sceneName: string;
        size: number;
    }

    /**
     * Interface for a "Grab" event type
     */
    interface GrabEventType {
        eventType: EventType;
        series: SeriesProperties;
        episodes: EpisodeProperties[];
        release: ReleaseProperties;
        downloadClient: string;
        downloadId: string;
    }

    /**
     * Interface for a "Download" event type
     */
    interface DownloadEventType {
        eventType: EventType;
        series: SeriesProperties;
        episodes: EpisodeProperties[];
        episodeFile: EpisodeFileProperties;
        isUpgrade: boolean;
        downloadClient: string;
        downloadId: string;
    }

    /**
     * Interface for a "Health" event type
     */
    interface HealthEventType {
        eventType: EventType;
        level: string;
        message: string;
        type: string;
        wikiUrl: string;
    }

    /**
     * Interface for a "Rename" event type
     */
    interface RenameEventType {
        eventType: EventType;
        series: SeriesProperties;
    }

    /**
     * Interface for a "Test" event type
     */
    interface TestEventType {
        eventType: EventType;
        series: SeriesProperties;
        episodes: EpisodeProperties[];
    }
}
