import express from 'express';
import basicauth from 'basic-auth';
import { Constants } from '@lunasea-notification-relay/core/constants';
import { Logger } from '@lunasea-notification-relay/core/logger';
import { Server } from '@lunasea-notification-relay/server';
import { Firebase } from '@lunasea-notification-relay/core/firebase';

export namespace Middleware {
    /**
     * Extracts the profile from the basic authentication header, and adds it to the request object (request.params.profile) for easy access.
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
        if (auth?.name) request.params.profile = auth.name;
        Logger.debug(`-> Profile: ${request.params.profile ?? 'default'}`);
        Logger.debug('Finished extractProfile middleware.');
        next();
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
     * Validate that an ID was passed into the request
     *
     * @param request Express request object
     * @param response Express response object
     * @param next Next middleware/handler to execute
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    export async function checkIdentifierExists(request: express.Request, response: express.Response, next: Function): Promise<void> {
        Logger.debug('Running checkIdentifierExists middleware...');
        if (request.params.id) {
            Logger.debug(`-> ID exists: ${request.params.id}`);
            Logger.debug('Finished checkIdentifierExists middleware.');
            next();
        } else {
            Logger.warn('-> A request with no ID was attempted.');
            Logger.debug('-> Sending HTTP response to complete webhook...');
            response.status(400).json(<Server.Response>{ message: Constants.MSG_NO_ID_SUPPLIED });
            Logger.debug('-> HTTP response sent (400 Bad Request)');
            Logger.debug('Finished checkIdentifierExists middleware.');
        }
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
        if (await Firebase.validateUserID(request.params.id)) {
            Logger.debug('-> Validated user:', request.params.id);
            Logger.debug('Finished validateUser middleware.');
            next();
        } else {
            Logger.warn('-> Unable to validate user:', request.params.id);
            Logger.debug('-> Sending HTTP response to complete webhook...');
            // If the user can't be found, return a not found error (404)
            response.status(404).json(<Server.Response>{ message: Constants.MSG_USER_NOT_FOUND });
            Logger.debug('HTTP response sent (404 Not Found)');
            Logger.debug('Finished validateUser middleware.');
        }
    }
}
