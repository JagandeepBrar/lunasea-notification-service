import express from 'express';

export namespace Lidarr {
    export const instance = express.Router();

    const handler = (request: express.Request, response: express.Response): void => {};

    instance.post('/:uid', handler);
}
