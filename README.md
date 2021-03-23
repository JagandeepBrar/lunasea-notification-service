# LunaSea Notification Relay

A simple TypeScript backend system that handles receiving webhooks from applications supported in [LunaSea](https://github.com/CometTools/LunaSea) and sends notifications to the respective user or device.

> **Currently Work-In-Progress**

## Application Support

| Application | Route           | Supported |
| :---------- | :-------------- | :-------: |
| Lidarr      | `v1/lidarr/`    |  &check;  |
| NZBGet      |                 |  &cross;  |
| Overseerr   | `v1/overseerr/` |  &check;  |
| Radarr      | `v1/radarr/`    |  &check;  |
| SABnzbd     |                 |  &cross;  |
| Sonarr      | `v1/sonarr/`    |  &check;  |
| Tautulli    |                 |  &cross;  |

## Build Guide

#### 1. Environment

All environment variables must either be set at an operating system-level, terminal-level, or by creating a `.env` file at the root of the project. A sample `.env` is supplied in the project (`.env.sample`).

| Variable                | Value                                                                 | Default | Required? |
| :---------------------- | :-------------------------------------------------------------------- | :-----: | :-------: |
| `FIREBASE_DATABASE_URL` | The Firebase database URL for your project.                           |         |  &check;  |
| `FANART_TV_API_KEY`     | A developer [Fanart.tv](https://fanart.tv/) API key.                  |         |  &check;  |
| `PORT`                  | The port to attach the relay server to.                               | `9000`  |  &cross;  |
| `LOG_LEVEL`             | The minimum logging level to store in `server.log`.                   | `warn`  |  &cross;  |
| `THEMOVIEDB_API_KEY`    | A developer [The Movie Database](https://www.themoviedb.org) API key. |         |  &check;  |

#### 2. Firebase Service Account

You must place a service account file at the root of the project, named `serviceaccount.json`. A service account file can be downloaded from the Firebase console for your project.

#### 3. Building the Project

1. Install Node.js (v14 is recommend, v10 or higher is required).
2. Run `npm run build` to build the project.
3. Run `npm run serve` to run the project.
