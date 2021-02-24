import express from 'express';
import { Route as Lidarr } from './routes/lidarr';
import { Radarr } from './routes/radarr';
import { Sonarr } from './routes/sonarr';
import { Route as Overseerr } from './routes/overseerr';

// Create a router and use each of the modules' own router instance for each subroute
export const router = express.Router();
router.use('/lidarr', Lidarr.router);
router.use('/radarr', Radarr.router);
router.use('/sonarr', Sonarr.router);
router.use('/overseerr', Overseerr.router);
