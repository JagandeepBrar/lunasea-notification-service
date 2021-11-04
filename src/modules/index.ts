import express from 'express';
import { Controller as Custom } from './custom';
import { Controller as Lidarr } from './lidarr';
import { Controller as Overseerr } from './overseerr';
import { Controller as Radarr } from './radarr';
import { Controller as Sonarr } from './sonarr';
import { Controller as Tautulli } from './tautulli';

// Create a router and use each of the modules' own router instance for each subroute
export const router = express.Router();
Custom.enable(router);
Lidarr.enable(router);
Overseerr.enable(router);
Radarr.enable(router);
Sonarr.enable(router);
Tautulli.enable(router);
