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
    instance.post('/:uid', handler);

    /**
     * Sonarr Handler: Handles a webhook from Sonarr, and sends a notification to all devices that are attached to the calling account.
     *
     * @param request Express request object
     * @param response Express response object
     */
    async function handler(request: express.Request, response: express.Response): Promise<void> {
        Logger.info('Started handling Sonarr webhook...');
        try {
            if (await Firebase.validateUserID(request.params.uid)) {
                Logger.debug('-> Validated user:', request.params.uid);
                Logger.debug('-> Sending HTTP response to complete webhook...');
                // Send an OK response once the user is verified
                response.status(200).json(<Server.Response>{ message: Constants.MSG_OK });
                Logger.debug('-> HTTP response sent (200 OK)');
                switch (request.body['eventType']) {
                    case EventType.Download:
                        //TODO
                        break;
                    case EventType.Grab:
                        //TODO
                        break;
                    case EventType.Health:
                        //TODO
                        break;
                    case EventType.Rename:
                        //TODO
                        break;
                    case EventType.Test:
                        await handleTestEventType(request.body as TestEventType, request.params.uid);
                        break;
                    default:
                        Logger.warn('An unknown eventType was received:', request.body['eventType'], request.body);
                        return;
                }
            } else {
                Logger.debug('Unable to validate user:', request.params.uid);
                Logger.debug('Sending HTTP response to complete webhook...');
                // If the user can't be found, return a not found error (404)
                response.status(404).json(<Server.Response>{ message: Constants.MSG_USER_NOT_FOUND });
                Logger.debug('HTTP response sent (404 Not Found)');
            }
        } catch (error) {
            // On any other thrown errors, capture, log, and return internal server error (500)
            ELogger.error(error.message);
            Logger.debug('Sending HTTP response to complete webhook...');
            response.status(500).send(<Server.Response>{ message: Constants.MSG_INTERNAL_SERVER_ERROR });
            Logger.debug('HTTP response sent (500 Internal Server Error)');
        }
        Logger.info('Finished handling Sonarr webhook.');
    }

    /**
     * Handle a test connection event type
     */
    const handleTestEventType = async (data: TestEventType, uid: string): Promise<void> => {
        Logger.debug('-> Handling as "Test" event type...');
        const devices: string[] = await Firebase.getDeviceTokenList(uid);
        Logger.debug('->', devices.length ?? 0, 'device(s) found');
        Logger.debug('-> Sending to devices...');
        (await Firebase.sendFirebaseCloudMessage(devices, {
            title: 'Sonarr',
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
        tvdbId: number;
        tvMazeId: number;
        type: SeriesType;
    }

    /**
     * Episode object containing episode details for a request
     */
    interface EpisodeProperties {
        id: number;
        episodeNumber: number;
        seasonNumber: number;
        title: string;
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
