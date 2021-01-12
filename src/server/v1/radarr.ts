import { Constants } from '@lunasea-notification-relay/core/constants';
import { Firebase } from '@lunasea-notification-relay/core/firebase';
import { ELogger, Logger } from '@lunasea-notification-relay/core/logger';
import { Server } from '@lunasea-notification-relay/server';
import { Middleware } from '@lunasea-notification-relay/server/v1/middleware';
import express from 'express';

/**
 * Radarr namespace to contain all Radarr-related interfaces, enums, and handlers
 */
export namespace Radarr {
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
     * Radarr User Handler: Handles a webhook from Radarr, and sends a notification to all devices that are attached to the calling account.
     *
     * @param request Express request object
     * @param response Express response object
     */
    async function userHandler(request: express.Request, response: express.Response): Promise<void> {
        Logger.info('Running Radarr [user] webhook...');
        try {
            Logger.debug('-> Sending HTTP response to complete webhook...');
            response.status(200).json(<Server.Response>{ message: Constants.MSG_OK });
            Logger.debug('-> HTTP response sent (200 OK)');
            const devices: string[] = await Firebase.getDeviceTokenList(request.params.id);
            const module = request.params.profile && request.params.profile !== 'default' ? `Radarr (${request.params.profile})` : 'Radarr';
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
        Logger.info('Finished Radarr [user] webhook.');
    }

    /**
     * Radarr Device Handler: Handles a webhook from Radarr [device ID], and sends a notification to the single device.
     *
     * @param request Express request object
     * @param response Express response object
     */
    async function deviceHandler(request: express.Request, response: express.Response): Promise<void> {
        Logger.info('Running Radarr [device] webhook...');
        try {
            Logger.debug('-> Sending HTTP response to complete webhook...');
            response.status(200).json(<Server.Response>{ message: Constants.MSG_OK });
            Logger.debug('-> HTTP response sent (200 OK)');
            const devices: string[] = [request.params.id];
            const module = request.params.profile && request.params.profile !== 'default' ? `Radarr (${request.params.profile})` : 'Radarr';
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
        Logger.info('Finished Radarr [device] webhook.');
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
        const bodyLine1 = data.isUpgrade ? `Movie Upgraded (${data.movieFile.quality})` : `Movie Downloaded (${data.movieFile.quality})`;
        (await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${module}: ${data.movie?.title ?? 'Unknown Movie'}`,
            body: `${bodyLine1}`,
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
        const bodyLine1 = `Movie Grabbed (${data.release.quality})`;
        const bodyLine2 = data?.release?.releaseTitle ?? 'Unknown Release';
        (await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${module}: ${data.movie?.title ?? 'Unknown Movie'}`,
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
            title: `${module}: ${data.movie?.title ?? 'Unknown Movie'}`,
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
            body: 'LunaSea is ready for Radarr notifications!',
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
     * Movie object containing movie details for a request
     */
    interface MovieProperties {
        id: number;
        title: string;
        releaseDate: string;
        folderPath: string;
        tmdbId: number;
        imdbId?: string;
    }

    /**
     * Remote movie object containing remote details for a movie for a request
     */
    interface RemoteMovieProperties {
        tmdbId: number;
        imdbId?: string;
        title: string;
        year: number;
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
     * Movie file object, containing details on the downloaded movie file for a request
     */
    interface MovieFileProperties {
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
     * Interface for a "Download" event type
     */
    interface DownloadEventType {
        eventType: EventType;
        movie: MovieProperties;
        remoteMovie: RemoteMovieProperties;
        movieFile: MovieFileProperties;
        isUpgrade: boolean;
        downloadId: string;
    }

    /**
     * Interface for a "Grab" event type
     */
    interface GrabEventType {
        eventType: EventType;
        movie: MovieProperties;
        remoteMovie: RemoteMovieProperties;
        release: ReleaseProperties;
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
        movie: MovieProperties;
    }

    /**
     * Interface for a "Test" event type
     */
    interface TestEventType {
        eventType: EventType;
        movie: MovieProperties;
        remoteMovie: RemoteMovieProperties;
        release: ReleaseProperties;
    }
}
