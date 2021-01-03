import { Constants } from '@lunasea-notification-relay/core/constants';
import { Server } from '@lunasea-notification-relay/server';
import express from 'express';

export namespace Lidarr {
    // Create a router, and add the handler route
    export const instance = express.Router();
    instance.post('/:uid', handler);

    /**
     * Lidarr Handler: Handles a webhook from Lidarr, and sends a notification to all devices that are attached to the calling account.
     *
     * @param request Express request object
     * @param response Express response object
     */
    async function handler(request: express.Request, response: express.Response): Promise<void> {
        //TODO
        response.status(200).json(<Server.Response>{ message: Constants.MSG_OK });
    }
}
