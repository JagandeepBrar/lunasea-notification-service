import express from 'express';
import basicauth from 'basic-auth';
import { Constants } from '../utilities/constants';
import { Firebase } from '../utilities/firebase';
import { Logger } from '../utilities/logger';
import { Server } from '../server';

/**
 * Contains various middleware for the route handlers
 */
export namespace Middleware {
    /**
     * Extracts the profile from the basic authentication header.
     * Sets the profile to `request.params.profile`.
     *
     * @param request Express request object
     * @param response Express response object
     * @param next Next middleware/handler to execute
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    export async function extractProfile(request: express.Request, response: express.Response, next: Function): Promise<void> {
        Logger.debug('Running extractProfile middleware...');
        // Extract the username part from basic auth and set it as the profile
        const auth = basicauth(request);
        response.locals.profile = auth?.name ?? 'default';
        Logger.debug(`-> Profile: ${response.locals.profile}`);
        Logger.debug('Finished extractProfile middleware.');
        next();
    }

    /**
     * Pull the device token from the request.
     * Sets the token to `response.locals.tokens` within an array.
     *
     * @param request Express request object
     * @param response Express response object
     * @param next Next middleware/handler to execute
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    export async function extractDeviceToken(request: express.Request, response: express.Response, next: Function): Promise<void> {
        Logger.debug(`Running extractDeviceToken middleware...`);
        if (request.params.id) {
            response.locals.tokens = [request.params.id];
            Logger.debug(`-> Device Token: ${request.params.id.substr(0, 15)}...`);
            Logger.debug('Finished extractDeviceToken middleware.');
            next();
        } else {
            Logger.warn('-> A request with no device ID was attempted. Cancelling request...');
            Logger.debug('-> Sending HTTP response to complete webhook...');
            response.status(400).json(<Server.Response>{ message: Constants.MSG_NO_ID_SUPPLIED });
            Logger.debug('-> HTTP response sent (400 Bad Request)');
            Logger.debug('Finished extractDeviceToken middleware.');
        }
    }

    /**
     * Pull the user's tokens from Cloud Firestore.
     * Sets the tokens to `response.locals.tokens`.
     *
     * @param request Express request object
     * @param response Express response object
     * @param next Next middleware/handler to execute
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    export async function pullUserTokens(request: express.Request, response: express.Response, next: Function): Promise<void> {
        const devices: string[] = await Firebase.getDeviceTokenList(request.params.id);
        if ((devices?.length ?? 0) > 0) {
            response.locals.tokens = devices;
            Logger.debug('->', devices?.length ?? 0, 'device(s) found');
            Logger.debug('Finished pullUserTokens middleware.');
            next();
        } else {
            Logger.warn('-> 0 device(s) found. Cancelling request...');
            Logger.debug('-> Sending HTTP response to complete webhook...');
            response.status(400).json(<Server.Response>{ message: Constants.MSG_NO_DEVICES_FOUND });
            Logger.debug('-> HTTP response sent (400 Bad Request)');
            Logger.debug('Finished pullUserTokens middleware.');
        }
    }

    /**
     * Checks the account notification password.
     *
     * @param request Express request object
     * @param response Express response object
     * @param next Next middleware/handler to execute
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    export async function checkNotificationPassword(request: express.Request, response: express.Response, next: Function): Promise<void> {
        Logger.debug('Running checkNotificationPassword middleware...');
        // TODO
        Logger.debug('Finished checkNotificationPassword middleware.');
        next();
    }

    /**
     * Validate that the user exists in the Firebase authentication table
     *
     * @param request Express request object
     * @param response Express response object
     * @param next Next middleware/handler to execute
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    export async function validateUser(request: express.Request, response: express.Response, next: Function): Promise<void> {
        Logger.debug('Running validateUser middleware...');
        if (request.params.id && (await Firebase.validateUserID(request.params.id))) {
            Logger.debug('-> Validated user:', request.params.id);
            Logger.debug('Finished validateUser middleware.');
            next();
        } else {
            Logger.warn('-> Unable to validate user:', request.params.id ?? 'undefined', 'Cancelling request...');
            Logger.debug('-> Sending HTTP response to complete webhook...');
            // If the user can't be found, return a not found error (404)
            response.status(404).json(<Server.Response>{ message: Constants.MSG_USER_NOT_FOUND });
            Logger.debug('HTTP response sent (404 Not Found)');
            Logger.debug('Finished validateUser middleware.');
        }
    }
}
