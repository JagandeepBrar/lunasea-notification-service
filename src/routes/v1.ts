import express from 'express';
import { Route as Lidarr } from './v1/lidarr';
import { Route as Radarr } from './v1/radarr';
import { Route as Sonarr } from './v1/sonarr';
import { Route as Overseerr } from './v1/overseerr';

// Create a router and use each of the modules' own router instance for each subroute
export const router = express.Router();
router.use('/lidarr', Lidarr.router);
router.use('/radarr', Radarr.router);
router.use('/sonarr', Sonarr.router);
router.use('/overseerr', Overseerr.router);
