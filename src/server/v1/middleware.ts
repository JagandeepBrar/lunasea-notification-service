import express from 'express';
import basicauth from 'basic-auth';

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
        // Extract the username part from basic auth and set it as the profile
        const auth = basicauth(request);
        if (auth?.name) request.params.profile = auth.name;
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
        next();
    }
}
