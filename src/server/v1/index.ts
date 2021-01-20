import express from 'express';
import { Radarr } from '@lunasea-notification-relay/server/v1/radarr';
import { Sonarr } from '@lunasea-notification-relay/server/v1/sonarr';
import { Overseerr } from '@lunasea-notification-relay/server/v1/overseerr';

// Create a router and use each of the modules' own router instance for each subroute
export const router = express.Router();
router.use('/sonarr', Sonarr.router);
router.use('/radarr', Radarr.router);
router.use('/overseerr', Overseerr.router);
