import express from 'express';
import { router as Lidarr } from './v1/lidarr';
import { router as Radarr } from './v1/radarr';
import { router as Sonarr } from './v1/sonarr';
import { router as Tautulli } from './v1/tautulli';
import { router as Overseerr } from './v1/overseerr';

// Create a router and use each of the modules' own router instance for each subroute
export const router = express.Router();
router.use('/lidarr', Lidarr);
router.use('/radarr', Radarr);
router.use('/sonarr', Sonarr);
router.use('/tautulli', Tautulli);
router.use('/overseerr', Overseerr);
