import express from 'express';
import { Sonarr } from '@lunasea-notification-relay/server/v1/sonarr';
import { Lidarr } from '@lunasea-notification-relay/server/v1/lidarr';
import { Radarr } from '@lunasea-notification-relay/server/v1/radarr';

// Create a router and use each of the modules' own router instance for each subroute
export const router = express.Router();
router.use('/lidarr', Lidarr.instance);
router.use('/radarr', Radarr.instance);
router.use('/sonarr', Sonarr.instance);
