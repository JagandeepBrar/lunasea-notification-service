import express from 'express';
import { Sonarr } from '@lunasea-notification-relay/server/v1/sonarr';

// Create a router and use each of the modules' own router instance for each subroute
export const router = express.Router();
router.use('/sonarr', Sonarr.router);
