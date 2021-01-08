import express from 'express';

export namespace Middleware {
    /**
     * Extracts the profile from the basic authentication header, and adds it to the request object for easy access.
     *
     * @param request Express request object
     * @param response Express response object
     * @param next Next middleware/handler to execute
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    export async function extractProfile(request: express.Request, response: express.Response, next: Function): Promise<void> {
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
}
