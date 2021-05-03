import express from 'express';
import { router as Custom } from './v1/custom';
import { router as Lidarr } from './v1/lidarr';
import { router as Overseerr } from './v1/overseerr';
import { router as Radarr } from './v1/radarr';
import { router as Sonarr } from './v1/sonarr';
import { router as Tautulli } from './v1/tautulli';

// Create a router and use each of the modules' own router instance for each subroute
export const router = express.Router();
router.use('/custom', Custom);
router.use('/lidarr', Lidarr);
router.use('/overseerr', Overseerr);
router.use('/radarr', Radarr);
router.use('/sonarr', Sonarr);
router.use('/tautulli', Tautulli);
