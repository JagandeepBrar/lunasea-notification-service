import { Server } from '../../server';
import { Middleware } from '../../server/middleware';
import { Constants } from '../../utilities/constants';
import { Logger } from '../../utilities/logger';
import { Webhooks } from '../../webhooks/sonarr';
import express from 'express';

/**
 * Route namespace to contain all Sonarr related routes and handlers.
 */
export namespace Route {
    export const router = express.Router();
    router.post('/user/:id', Middleware.validateUser, Middleware.checkNotificationPassword, Middleware.extractProfile, Middleware.pullUserTokens, handler);
    router.post('/device/:id', Middleware.extractProfile, Middleware.extractDeviceToken, handler);

    /**
     * Sonarr Webhook Handler: Handles a webhook from Sonarr, and sends a notification to all devices that are in `response.locals.tokens`.
     *
     * @param request Express request object
     * @param response Express response object
     */
    async function handler(request: express.Request, response: express.Response): Promise<void> {
        Logger.info('Running Sonarr webhook...');
        try {
            Logger.debug('-> Sending HTTP response to complete webhook...');
            response.status(200).json(<Server.Response>{ message: Constants.MSG_OK });
            Logger.debug('-> HTTP response sent (200 OK)');
            await Webhooks.execute(request.body, response.locals.tokens, response.locals.profile);
        } catch (error) {
            Logger.error(error.message);
            Logger.debug('-> Sending HTTP response to complete webhook...');
            response.status(500).json(<Server.Response>{ message: Constants.MSG_INTERNAL_SERVER_ERROR });
            Logger.debug('HTTP response sent (500 Internal Server Error)');
        }
        Logger.info('Finished Sonarr webhook.');
    }
}
