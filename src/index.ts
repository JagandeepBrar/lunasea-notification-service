import { Server } from '@lunasea-notification-relay/server';
import { Logger } from '@lunasea-notification-relay/logger';

Logger.info(`LunaSea Notification Relay Server v${process.env.npm_package_version}`);
Server.start();
