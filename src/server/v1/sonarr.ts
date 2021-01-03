import express from 'express';

export namespace Sonarr {
    export const instance = express.Router();

    const handler = (request: express.Request, response: express.Response): void => {};

    instance.post('/:uid', handler);
}
