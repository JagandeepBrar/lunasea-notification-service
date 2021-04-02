# LunaSea Notification Relay

[![Docker Build Status](https://img.shields.io/docker/cloud/build/comettools/lunasea-notification-relay?style=for-the-badge)](https://hub.docker.com/r/comettools/lunasea-notification-relay)
[![Docker Cloud Build](https://img.shields.io/docker/cloud/automated/comettools/lunasea-notification-relay?style=for-the-badge)](https://hub.docker.com/r/comettools/lunasea-notification-relay)
[![Docker Pulls](https://img.shields.io/docker/pulls/comettools/lunasea-notification-relay?style=for-the-badge)](https://hub.docker.com/r/comettools/lunasea-notification-relay)
![Version](https://img.shields.io/docker/v/comettools/lunasea-notification-relay?sort=semver&style=for-the-badge)

A simple TypeScript backend system that handles receiving webhooks from applications supported in [LunaSea](https://github.com/CometTools/LunaSea) and sends notifications to the respective user or device.

> Setting up an instance of your own notification relay is **not** necessary to get webhook notifications in LunaSea. Simply use the Comet.Tools' hosted notification relay, available at [https://notify.lunasea.app](https://notify.lunasea.app). Setting up your own instance _will not_ send notifications to the officially published LunaSea application.
>
> Setting up your own instance of the notification relay is only necessary when building your own version of LunaSea, which utilizes a different Firebase project.

## Usage

### Endpoints

| Module    | Route                  | HTTP Method |
| :-------- | :--------------------- | :---------: |
| &mdash;   | `.../health`           |     GET     |
| Lidarr    | `.../v1/lidarr/...`    |    POST     |
| NZBGet    | &mdash;                |   &mdash;   |
| Overseerr | `.../v1/overseerr/...` |    POST     |
| Radarr    | `.../v1/radarr/...`    |    POST     |
| SABnzbd   | &mdash;                |   &mdash;   |
| Sonarr    | `.../v1/sonarr/...`    |    POST     |
| Tautulli  | `.../v1/tautulli/...`  |    POST     |

### Client Types

The notification relay supports both:

-   Sending to a single device via a **Firebase Device Token**
    -   Registering for a LunaSea account is _not_ necessary to get device-based notifications
-   Sending to a group of devices via a user's **Firebase Auth UID**

#### 1. Sending to a Firebase Device Token

With the given routes above, append `device/{device_id}` to the route to send to a single device.

> **Example**: [https://notify.lunasea.app/v1/radarr/device/1234567890](https://notify.lunasea.app/v1/radarr/device/1234567890) to send a Radarr webhook to the Firebase device token `1234567890`.

#### 2. Sending to User's Firebase Auth UID

With the given routes above, append `user/{user_id}` to the route to send to all devices registered to the user's account. The device list is pulled from Cloud Firestore, with device tokens registered upon signing into a LunaSea account within the application.

> **Example**: [https://notify.lunasea.app/v1/radarr/user/abcdefghijklmno](https://notify.lunasea.app/v1/radarr/user/abcdefghijklmno) to send a Radarr webhook to the user with the Firebase Auth UID of `abcdefghijklmno`.

---

## Development & Installation

### Environment

All environment variables must either be set at an operating system-level, terminal-level, as Docker environment variables, or by creating a `.env` file at the root of the project. A sample `.env` is supplied in the project (`.env.sample`).

| Variable                | Value                                                                 | Default | Required? |
| :---------------------- | :-------------------------------------------------------------------- | :-----: | :-------: |
| `FIREBASE_DATABASE_URL` | The Firebase database URL for your project.                           | &mdash; |  &check;  |
| `FANART_TV_API_KEY`     | A developer [Fanart.tv](https://fanart.tv/) API key.                  | &mdash; |  &check;  |
| `THEMOVIEDB_API_KEY`    | A developer [The Movie Database](https://www.themoviedb.org) API key. | &mdash; |  &check;  |
| `PORT`                  | The port to attach the relay server to.                               | `9000`  |  &cross;  |
| `LOG_LEVEL`             | The minimum logging level to store in `server.log`.                   | `warn`  |  &cross;  |

### Setup Guide (Docker)

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

### Setup Guide (Development)

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
