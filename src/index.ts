import { Server } from '@lunasea-notification-relay/server';
import { Logger } from '@lunasea-notification-relay/core/logger';
import { Firebase } from '@lunasea-notification-relay/core/firebase';

Logger.info(`LunaSea Notification Relay Server v${process.env.npm_package_version}`);
Firebase.initialize();
Server.start();
