# LunaSea Notification Relay

A simple TypeScript backend system that handles receiving webhooks from applications supported in [LunaSea](https://github.com/CometTools/LunaSea) and sends notifications to the respective user or device.

## Application Support

| Application | Route           | Supported |
| :---------- | :-------------- | :-------: |
| Lidarr      | `v1/lidarr/`    |  &check;  |
| NZBGet      |                 |  &cross;  |
| Overseerr   | `v1/overseerr/` |  &check;  |
| Radarr      | `v1/radarr/`    |  &check;  |
| SABnzbd     |                 |  &cross;  |
| Sonarr      | `v1/sonarr/`    |  &check;  |
| Tautulli    | `v1/tautulli/`  |  &check;  |

## Environment

All environment variables must either be set at an operating system-level, terminal-level, as Docker environment variables, or by creating a `.env` file at the root of the project. A sample `.env` is supplied in the project (`.env.sample`).

| Variable                | Value                                                                 | Default | Required? |
| :---------------------- | :-------------------------------------------------------------------- | :-----: | :-------: |
| `FIREBASE_DATABASE_URL` | The Firebase database URL for your project.                           |         |  &check;  |
| `FANART_TV_API_KEY`     | A developer [Fanart.tv](https://fanart.tv/) API key.                  |         |  &check;  |
| `PORT`                  | The port to attach the relay server to.                               | `9000`  |  &cross;  |
| `LOG_LEVEL`             | The minimum logging level to store in `server.log`.                   | `warn`  |  &cross;  |
| `THEMOVIEDB_API_KEY`    | A developer [The Movie Database](https://www.themoviedb.org) API key. |         |  &check;  |

## Setup Guide (Docker)

You must use a bind mount to mount a host OS directory to the Docker image. **This folder must contain the Firebase service account file**, named `serviceaccount.json`. A server log file, `server.log` will be written to this directory.

```docker
docker run -d \
    -e LOG_LEVEL=debug \
    -e FIREBASE_DATABASE_URL=https://example-project.firebaseio.com \
    -e FANART_TV_API_KEY=1234567890 \
    -e THEMOVIEDB_API_KEY=1234567890 \
    -p 9000:9000 \
    -v /hostos/path/to/config:/usr/src/config \
    --restart unless-stopped \
comettools/lunasea-notification-relay:latest
```

## Setup Guide (Development)

You must place a service account file at the root of the project, named `serviceaccount.json`. A service account file can be downloaded from the Firebase console for your project.

#### 1. Running the Project

1. Install Node.js (v14 is recommend, v10 or higher is required).
2. Configure the required environmental variables
3. Run `npm install`
4. Run `npm start`

#### 2. Building the Project

1. Install Node.js (v14 is recommend, v10 or higher is required).
2. Configure the required environmental variables
3. Run `npm install`
4. Run `npm run build`
5. Run `npm run serve`
