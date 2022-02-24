# LunaSea Notification Service

A simple TypeScript backend system that handles receiving webhooks from applications supported in [LunaSea](https://github.com/CometTools/LunaSea) and sends notifications to the respective user or device.

> Setting up an instance of your own notification service is **not** necessary to get webhook notifications in LunaSea. Simply use the Comet.Tools' hosted notification service, available at [https://notify.lunasea.app](https://notify.lunasea.app). Setting up your own instance _will not_ send notifications to the officially published LunaSea application.
>
> Setting up your own instance of the notification service is only necessary when building your own version of LunaSea, which utilizes a different Firebase project.

## Usage

For documentation on setting up the webhooks, please look at LunaSea's documentation [available here](https://docs.lunasea.app/lunasea/notifications).

### Endpoints

| Module    | Route                  | HTTP Method |
| :-------- | :--------------------- | :---------: |
| &mdash;   | `.../health`           |     GET     |
| Custom    | `.../v1/custom/...`    |    POST     |
| Lidarr    | `.../v1/lidarr/...`    |    POST     |
| NZBGet    | &mdash;                |   &mdash;   |
| Overseerr | `.../v1/overseerr/...` |    POST     |
| Radarr    | `.../v1/radarr/...`    |    POST     |
| SABnzbd   | &mdash;                |   &mdash;   |
| Sonarr    | `.../v1/sonarr/...`    |    POST     |
| Tautulli  | `.../v1/tautulli/...`  |    POST     |

### Client Types

The notification service supports both:

- Sending to a single device via a **Firebase Device Token**
  - Registering for a LunaSea account is _not_ necessary to get device-based notifications
- Sending to a group of devices via a user's **Firebase Auth UID**

#### 1. Sending to a Firebase Device Token

With the given routes above, append `device/{device_id}` to the route to send to a single device.

> **Example**: [https://notify.lunasea.app/v1/radarr/device/1234567890](https://notify.lunasea.app/v1/radarr/device/1234567890) to send a Radarr webhook to the Firebase device token `1234567890`.

#### 2. Sending to User's Firebase Auth UID

With the given routes above, append `user/{user_id}` to the route to send to all devices registered to the user's account. The device list is pulled from Cloud Firestore, with device tokens registered upon signing into a LunaSea account within the application.

> **Example**: [https://notify.lunasea.app/v1/radarr/user/abcdefghijklmno](https://notify.lunasea.app/v1/radarr/user/abcdefghijklmno) to send a Radarr webhook to the user with the Firebase Auth UID of `abcdefghijklmno`.

---

### Development

You must use the `.env.sample` to create your own `.env` file at the root of the project directory.

#### 1. Running the Project

2. Configure the required environmental variables
3. Run `npm install`
4. Run `npm start`

#### 2. Building the Project

2. Configure the required environmental variables
3. Run `npm install`
4. Run `npm run build`
5. Run `npm run serve`
