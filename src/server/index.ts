import express from 'express';
import { Logger } from '../utilities/logger';
import { router as v1 } from '../routes/v1';

export namespace Server {
    const PORT = process.env.PORT || '9000';
    const server = express();

    /**
     * Initialize the Express server.
     *
     * Does things like set CORS, set JSON limits, adds global middleware, etc.
     */
    export const initialize = (): void => {
        server.use(express.json());
        server.use('/v1', v1);
        server.get('/healthcheck', (req, res) => res.status(200).json({ status: 'OK' }));
    };

    /**
     * Start the express server on the the environment PORT value, or 9000.
     */
    export const start = (): void => {
        initialize();
        server.listen(PORT).on('error', (error) => {
            Logger.error(error);
            process.exit(1);
        });
        Logger.info('Server Running / Port', PORT);
    };

    /**
     * Simple interface to structure all responses to hooks
     */
    export interface Response {
        message: string;
    }
}
