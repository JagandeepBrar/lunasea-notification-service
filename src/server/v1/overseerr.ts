import { Constants } from '@lunasea-notification-relay/core/constants';
import { Firebase } from '@lunasea-notification-relay/core/firebase';
import { ELogger, Logger } from '@lunasea-notification-relay/core/logger';
import { Server } from '@lunasea-notification-relay/server';
import { Middleware } from '@lunasea-notification-relay/server/v1/middleware';
import express from 'express';

/**
 * Overseerr namespace to contain all Overseerr-related interfaces, enums, and handlers.
 */
export namespace Overseerr {
    /**
     * ROUTING AND HANDLERS
     */
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
     * Overseerr User Handler: Handles a webhook from Overseerr, and sends a notification to all devices that are attached to the calling account.
     *
     * @param request Express request object
     * @param response Express response object
     */
    async function userHandler(request: express.Request, response: express.Response): Promise<void> {
        Logger.info('Running Overseerr [user] webhook...');
        try {
            Logger.debug('-> Sending HTTP response to complete webhook...');
            response.status(200).json(<Server.Response>{ message: Constants.MSG_OK });
            Logger.debug('-> HTTP response sent (200 OK)');
            const devices: string[] = await Firebase.getDeviceTokenList(request.params.id);
            const module =
                request.params.profile && request.params.profile !== 'default' ? `Overseerr (${request.params.profile})` : 'Overseerr';
            Logger.debug('->', devices?.length ?? 0, 'device(s) found');
            if ((devices?.length ?? 0) > 0) {
                switch (request.body['notification_type']) {
                    case NotificationType.MEDIA_APPROVED:
                        await handleMediaApprovedNotificationType(request.body as RequestProperties, devices, module);
                        break;
                    case NotificationType.MEDIA_AVAILABLE:
                        await handleMediaAvailableNotificationType(request.body as RequestProperties, devices, module);
                        break;
                    case NotificationType.MEDIA_DECLINED:
                        await handleMediaDeclinedNotificationType(request.body as RequestProperties, devices, module);
                        break;
                    case NotificationType.MEDIA_FAILED:
                        await handleMediaFailedNotificationType(request.body as RequestProperties, devices, module);
                        break;
                    case NotificationType.MEDIA_PENDING:
                        await handleMediaPendingNotificationType(request.body as RequestProperties, devices, module);
                        break;
                    case NotificationType.TEST_NOTIFICATION:
                        await handleTestNotificationType(request.body as RequestProperties, devices, module);
                        break;
                    default:
                        Logger.warn('An unknown notification_type was received:', request.body['notification_type'], request.body);
                        return;
                }
            }
        } catch (error) {
            ELogger.error(error.message);
            Logger.debug('-> Sending HTTP response to complete webhook...');
            response.status(500).json(<Server.Response>{ message: Constants.MSG_INTERNAL_SERVER_ERROR });
            Logger.debug('HTTP response sent (500 Internal Server Error)');
        }
        Logger.info('Finished Overseerr [user] webhook.');
    }

    /**
     * Overseerr Device Handler: Handles a webhook from Overseerr [device ID], and sends a notification to the single device.
     *
     * @param request Express request object
     * @param response Express response object
     */
    async function deviceHandler(request: express.Request, response: express.Response): Promise<void> {
        Logger.info('Running Overseerr [device] webhook...');
        try {
            Logger.debug('-> Sending HTTP response to complete webhook...');
            response.status(200).json(<Server.Response>{ message: Constants.MSG_OK });
            Logger.debug('-> HTTP response sent (200 OK)');
            const devices: string[] = [request.params.id];
            const module =
                request.params.profile && request.params.profile !== 'default' ? `Overseerr (${request.params.profile})` : 'Overseerr';
            switch (request.body['notification_type']) {
                case NotificationType.MEDIA_APPROVED:
                    await handleMediaApprovedNotificationType(request.body as RequestProperties, devices, module);
                    break;
                case NotificationType.MEDIA_AVAILABLE:
                    await handleMediaAvailableNotificationType(request.body as RequestProperties, devices, module);
                    break;
                case NotificationType.MEDIA_DECLINED:
                    await handleMediaDeclinedNotificationType(request.body as RequestProperties, devices, module);
                    break;
                case NotificationType.MEDIA_FAILED:
                    await handleMediaFailedNotificationType(request.body as RequestProperties, devices, module);
                    break;
                case NotificationType.MEDIA_PENDING:
                    await handleMediaPendingNotificationType(request.body as RequestProperties, devices, module);
                    break;
                case NotificationType.TEST_NOTIFICATION:
                    await handleTestNotificationType(request.body as RequestProperties, devices, module);
                    break;
                default:
                    Logger.warn('An unknown notification_type was received:', request.body['notification_type'], request.body);
                    return;
            }
        } catch (error) {
            ELogger.error(error.message);
            Logger.debug('Sending HTTP response to complete webhook...');
            response.status(500).json(<Server.Response>{ message: Constants.MSG_INTERNAL_SERVER_ERROR });
            Logger.debug('HTTP response sent (500 Internal Server Error)');
        }
        Logger.info('Finished Overseerr [user] webhook.');
    }

    /**
     * Handle a "MEDIA_APPROVED" notification type
     *
     * @param data Request body as RequestProperties
     * @param devices List of Firebase device tokens
     * @param module Module name to be shown before the colon in the title
     */
    const handleMediaApprovedNotificationType = async (data: RequestProperties, devices: string[], module: string): Promise<void> => {
        Logger.debug(`-> Handling as ${data.notification_type} event type...`);
        Logger.debug('-> Sending to devices...');
        (await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${module}: ${data.media?.media_type === MediaType.MOVIE ? 'Movie' : 'Series'} Approved`,
            body: `${data.subject}\nOriginally Requested by ${data.username}`,
        }))
            ? Logger.debug('-> Sent to all devices.')
            : Logger.debug('-> Failed to send to devices.');
    };

    /**
     * Handle a "MEDIA_AVAILABLE" notification type
     *
     * @param data Request body as RequestProperties
     * @param devices List of Firebase device tokens
     * @param module Module name to be shown before the colon in the title
     */
    const handleMediaAvailableNotificationType = async (data: RequestProperties, devices: string[], module: string): Promise<void> => {
        Logger.debug(`-> Handling as ${data.notification_type} event type...`);
        Logger.debug('-> Sending to devices...');
        (await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${module}: ${data.media?.media_type === MediaType.MOVIE ? 'Movie' : 'Series'} Available`,
            body: `${data.subject}\nOriginally Requested by ${data.username}`,
        }))
            ? Logger.debug('-> Sent to all devices.')
            : Logger.debug('-> Failed to send to devices.');
    };

    /**
     * Handle a "MEDIA_DECLINED" notification type
     *
     * @param data Request body as RequestProperties
     * @param devices List of Firebase device tokens
     * @param module Module name to be shown before the colon in the title
     */
    const handleMediaDeclinedNotificationType = async (data: RequestProperties, devices: string[], module: string): Promise<void> => {
        Logger.debug(`-> Handling as ${data.notification_type} event type...`);
        Logger.debug('-> Sending to devices...');
        (await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${module}: ${data.media?.media_type === MediaType.MOVIE ? 'Movie' : 'Series'} Declined`,
            body: `${data.subject}\nOriginally Requested by ${data.username}`,
        }))
            ? Logger.debug('-> Sent to all devices.')
            : Logger.debug('-> Failed to send to devices.');
    };

    /**
     * Handle a "MEDIA_FAILED" notification type
     *
     * @param data Request body as RequestProperties
     * @param devices List of Firebase device tokens
     * @param module Module name to be shown before the colon in the title
     */
    const handleMediaFailedNotificationType = async (data: RequestProperties, devices: string[], module: string): Promise<void> => {
        Logger.debug(`-> Handling as ${data.notification_type} event type...`);
        Logger.debug('-> Sending to devices...');
        (await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${module}: ${data.media?.media_type === MediaType.MOVIE ? 'Movie' : 'Series'} Failed`,
            body: `${data.subject}\n${data.message}`,
        }))
            ? Logger.debug('-> Sent to all devices.')
            : Logger.debug('-> Failed to send to devices.');
    };

    /**
     * Handle a "MEDIA_PENDING" notification type
     *
     * @param data Request body as RequestProperties
     * @param devices List of Firebase device tokens
     * @param module Module name to be shown before the colon in the title
     */
    const handleMediaPendingNotificationType = async (data: RequestProperties, devices: string[], module: string): Promise<void> => {
        Logger.debug(`-> Handling as ${data.notification_type} event type...`);
        Logger.debug('-> Sending to devices...');
        (await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${module}: ${data.media?.media_type === MediaType.MOVIE ? 'Movie' : 'Series'} Requested`,
            body: `${data.subject}\nOriginally Requested by ${data.username}`,
        }))
            ? Logger.debug('-> Sent to all devices.')
            : Logger.debug('-> Failed to send to devices.');
    };

    /**
     * Handle a "TEST_NOTIFICATION" notification type
     *
     * @param data Request body as RequestProperties
     * @param devices List of Firebase device tokens
     * @param module Module name to be shown before the colon in the title
     */
    const handleTestNotificationType = async (data: RequestProperties, devices: string[], module: string): Promise<void> => {
        Logger.debug(`-> Handling as ${data.notification_type} event type...`);
        Logger.debug('-> Sending to devices...');
        (await Firebase.sendFirebaseCloudMessage(devices, {
            title: `${module}: Connection Test`,
            body: 'LunaSea is ready for Overseerr notifications!',
        }))
            ? Logger.debug('-> Sent to all devices.')
            : Logger.debug('-> Failed to send to devices.');
    };

    /**
     * DATA/MODEL STRUCTURES
     **/

    /**
     * All possible notification types
     */
    enum NotificationType {
        MEDIA_APPROVED = 'MEDIA_APPROVED',
        MEDIA_AVAILABLE = 'MEDIA_AVAILABLE',
        MEDIA_DECLINED = 'MEDIA_DECLINED',
        MEDIA_FAILED = 'MEDIA_FAILED',
        MEDIA_PENDING = 'MEDIA_PENDING',
        TEST_NOTIFICATION = 'TEST_NOTIFICATION',
    }

    /**
     * All possible media types
     */
    enum MediaType {
        MOVIE = 'movie',
        TV_SHOW = 'tv',
    }

    /**
     * Request object containing the request details
     */
    interface RequestProperties {
        notification_type: NotificationType;
        subject: string;
        message: string;
        image: string;
        email: string;
        username: string;
        avatar: string;
        media?: MediaProperties;
    }

    /**
     * Media object containing the media details
     */
    interface MediaProperties {
        media_type: MediaType;
        tmdbId: string;
        imdbId: string;
        tvdbId: string;
        status: string;
        status4k: string;
    }
}
