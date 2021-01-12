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
    router.post('/user/:id', Middleware.validateUser, Middleware.checkNotificationPassword, Middleware.extractProfile, userHandler);
    router.post('/device/:id', Middleware.extractProfile, deviceHandler);

    /**
     * Radarr User Handler: Handles a webhook from Radarr, and sends a notification to all devices that are attached to the calling account.
     *
     * @param request Express request object
     * @param response Express response object
     */
    async function userHandler(request: express.Request, response: express.Response): Promise<void> {
        Logger.info('Started handling Radarr [user] webhook...');
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
                    const module =
                        request.params.profile && request.params.profile !== 'default' ? `Radarr (${request.params.profile})` : 'Radarr';
                    Logger.debug('->', devices?.length ?? 0, 'device(s) found');
                    if ((devices?.length ?? 0) > 0) {
                        switch (request.body['eventType']) {
                            case EventType.Download:
                                //await handleDownloadEventType(request.body as DownloadEventType, devices, module);
                                break;
                            case EventType.Grab:
                                //await handleGrabEventType(request.body as GrabEventType, devices, module);
                                break;
                            case EventType.Health:
                                //await handleHealthEventType(request.body as HealthEventType, devices, module);
                                break;
                            case EventType.Rename:
                                //await handleRenameEventType(request.body as RenameEventType, devices, module);
                                break;
                            case EventType.Test:
                                await handleTestEventType(request.body as TestEventType, devices, module);
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
        Logger.info('Finished handling Radarr [user] webhook.');
    }

    /**
     * Radarr Device Handler: Handles a webhook from Radarr [device ID], and sends a notification to the single device.
     *
     * @param request Express request object
     * @param response Express response object
     */
    async function deviceHandler(request: express.Request, response: express.Response): Promise<void> {
        Logger.info('Started handling Radarr [device] webhook...');
        Logger.info(JSON.stringify(request.body));
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
                const module =
                    request.params.profile && request.params.profile !== 'default' ? `Radarr (${request.params.profile})` : 'Radarr';
                switch (request.body['eventType']) {
                    case EventType.Download:
                        //await handleDownloadEventType(request.body as DownloadEventType, devices, module);
                        break;
                    case EventType.Grab:
                        //await handleGrabEventType(request.body as GrabEventType, devices, module);
                        break;
                    case EventType.Health:
                        //await handleHealthEventType(request.body as HealthEventType, devices, module);
                        break;
                    case EventType.Rename:
                        //await handleRenameEventType(request.body as RenameEventType, devices, module);
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
            // On any other thrown errors, capture, log, and return internal server error (500)
            ELogger.error(error.message);
            Logger.debug('Sending HTTP response to complete webhook...');
            response.status(500).json(<Server.Response>{ message: Constants.MSG_INTERNAL_SERVER_ERROR });
            Logger.debug('HTTP response sent (500 Internal Server Error)');
        }
        Logger.info('Finished handling Radarr [device] webhook.');
    }

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

    interface MovieProperties {
        id: number;
        title: string;
        releaseDate: string;
        folderPath: string;
        tmdbId: number;
    }

    interface RemoteMovieProperties {
        tmdbId: number;
        imdbId: string;
        title: string;
        year: number;
    }

    interface ReleaseProperties {
        quality: string;
        qualityVersion: number;
        releaseGroup: string;
        releaseTitle: string;
        indexer: string;
        size: number;
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
