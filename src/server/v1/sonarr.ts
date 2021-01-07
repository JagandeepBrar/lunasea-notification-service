import { Constants } from '@lunasea-notification-relay/core/constants';
import { Firebase } from '@lunasea-notification-relay/core/firebase';
import { ELogger, Logger } from '@lunasea-notification-relay/core/logger';
import { Server } from '@lunasea-notification-relay/server';
import express from 'express';

/**
 * Sonarr namespace to contain all Sonarr-related interfaces, enums, and handlers
 */
export namespace Sonarr {
    /**
     * ROUTING AND HANDLER
     **/

    // Create a router, and add the handler route
    export const instance = express.Router();
    instance.post('/user/:id', userHandler);
    instance.post('/device/:id', deviceHandler);

    /**
     * Sonarr User Handler: Handles a webhook from Sonarr, and sends a notification to all devices that are attached to the calling account.
     *
     * @param request Express request object
     * @param response Express response object
     */
    async function userHandler(request: express.Request, response: express.Response): Promise<void> {
        Logger.info('Started handling Sonarr [user] webhook...');
        try {
            if (!request.params.id) {
                Logger.debug('-> A request with no UID was attempted.');
                Logger.debug('-> Sending HTTP response to complete webhook...');
                response.status(400).json(<Server.Response>{ message: Constants.MSG_NO_ID_SUPPLIED });
                Logger.debug('-> HTTP response sent (400 Bad Request)');
            } else {
                if (await Firebase.validateUserID(request.params.id)) {
                    Logger.debug('-> Validated user:', request.params.id);
                    Logger.debug('-> Sending HTTP response to complete webhook...');
                    // Send an OK response once the user is verified
                    response.status(200).json(<Server.Response>{ message: Constants.MSG_OK });
                    Logger.debug('-> HTTP response sent (200 OK)');
                    const devices: string[] = await Firebase.getDeviceTokenList(request.params.id);
                    Logger.debug('->', devices?.length ?? 0, 'device(s) found');
                    if ((devices?.length ?? 0) > 0) {
                        switch (request.body['eventType']) {
                            case EventType.Download:
                                await handleDownloadEventType(request.body as DownloadEventType, devices);
                                break;
                            case EventType.Grab:
                                await handleGrabEventType(request.body as GrabEventType, devices);
                                break;
                            case EventType.Health:
                                await handleHealthEventType(request.body as HealthEventType, devices);
                                break;
                            case EventType.Rename:
                                await handleRenameEventType(request.body as RenameEventType, devices);
                                break;
                            case EventType.Test:
                                await handleTestEventType(request.body as TestEventType, devices);
                                break;
                            default:
                                Logger.warn('An unknown eventType was received:', request.body['eventType'], request.body);
                                return;
                        }
                    }
                } else {
                    Logger.debug('-> Unable to validate user:', request.params.id);
                    Logger.debug('-> Sending HTTP response to complete webhook...');
                    // If the user can't be found, return a not found error (404)
                    response.status(404).json(<Server.Response>{ message: Constants.MSG_USER_NOT_FOUND });
                    Logger.debug('HTTP response sent (404 Not Found)');
                }
            }
        } catch (error) {
            // On any other thrown errors, capture, log, and return internal server error (500)
            ELogger.error(error.message);
            Logger.debug('-> Sending HTTP response to complete webhook...');
            response.status(500).json(<Server.Response>{ message: Constants.MSG_INTERNAL_SERVER_ERROR });
            Logger.debug('HTTP response sent (500 Internal Server Error)');
        }
        Logger.info('Finished handling Sonarr [user] webhook.');
    }

    /**
     * Sonarr Device Handler: Handles a webhook from Sonarr [device ID], and sends a notification to the single device.
     *
     * @param request Express request object
     * @param response Express response object
     */
    async function deviceHandler(request: express.Request, response: express.Response): Promise<void> {
        Logger.info('Started handling Sonarr [device] webhook...');
        try {
            if (!request.params.id) {
                Logger.debug('-> A request with no UID was attempted.');
                Logger.debug('-> Sending HTTP response to complete webhook...');
                response.status(400).json(<Server.Response>{ message: Constants.MSG_NO_ID_SUPPLIED });
                Logger.debug('-> HTTP response sent (400 Bad Request)');
            } else {
                Logger.debug('-> Sending HTTP response to complete webhook...');
                response.status(200).json(<Server.Response>{ message: Constants.MSG_OK });
                Logger.debug('-> HTTP response sent (200 OK)');
                // Construct a simple array with the device ID to re-use handlers
                const devices: string[] = [request.params.id];
                switch (request.body['eventType']) {
                    case EventType.Download:
                        await handleDownloadEventType(request.body as DownloadEventType, devices);
                        break;
                    case EventType.Grab:
                        await handleGrabEventType(request.body as GrabEventType, devices);
                        break;
                    case EventType.Health:
                        await handleHealthEventType(request.body as HealthEventType, devices);
                        break;
                    case EventType.Rename:
                        await handleRenameEventType(request.body as RenameEventType, devices);
                        break;
                    case EventType.Test:
                        await handleTestEventType(request.body as TestEventType, devices);
                        break;
                    default:
                        Logger.warn('An unknown eventType was received:', request.body['eventType'], request.body);
                        return;
                }
            }
        } catch (error) {
            // On any other thrown errors, capture, log, and return internal server error (500)
            ELogger.error(error.message);
            Logger.debug('Sending HTTP response to complete webhook...');
            response.status(500).json(<Server.Response>{ message: Constants.MSG_INTERNAL_SERVER_ERROR });
            Logger.debug('HTTP response sent (500 Internal Server Error)');
        }
        Logger.info('Finished handling Sonarr [device] webhook.');
    }

    /**
     * Handle a "Download" event type
     *
     * @param data Request body as DownloadEventType
     * @param devices List of Firebase device tokens
     */
    const handleDownloadEventType = async (data: DownloadEventType, devices: string[]): Promise<void> => {
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
            title: `Sonarr: ${data.series?.title ?? 'Unknown Series'}`,
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
    const handleGrabEventType = async (data: GrabEventType, devices: string[]): Promise<void> => {
        Logger.debug('-> Handling as "Grab" event type...');
        Logger.debug('-> Sending to devices...');
        const bodyLine1 =
            data.episodes?.length == 1
                ? `Season ${data.episodes[0].seasonNumber} – Episode ${data.episodes[0].episodeNumber}`
                : `${data.episodes.length} Episodes`;
        const bodyLine2 = `Episode Grabbed (${data.release.quality})`;
        (await Firebase.sendFirebaseCloudMessage(devices, {
            title: `Sonarr: ${data.series?.title ?? 'Unknown Series'}`,
            body: `${bodyLine1}\n${bodyLine2}`,
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
    const handleHealthEventType = async (data: HealthEventType, devices: string[]): Promise<void> => {
        Logger.debug('-> Handling as "Health" event type...');
        Logger.debug('-> Sending to devices...');
        (await Firebase.sendFirebaseCloudMessage(devices, {
            title: 'Sonarr: Health Check',
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
    const handleRenameEventType = async (data: RenameEventType, devices: string[]): Promise<void> => {
        Logger.debug('-> Handling as "Rename" event type...');
        Logger.debug('-> Sending to devices...');
        (await Firebase.sendFirebaseCloudMessage(devices, {
            title: `Sonarr: ${data.series.title}`,
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
    const handleTestEventType = async (data: TestEventType, devices: string[]): Promise<void> => {
        Logger.debug('-> Handling as "Test" event type...');
        Logger.debug('-> Sending to devices...');
        (await Firebase.sendFirebaseCloudMessage(devices, {
            title: 'Sonarr: Connection Test',
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
