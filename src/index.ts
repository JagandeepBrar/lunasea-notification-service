import { Server } from '@lunasea-notification-relay/server';
import { Environment } from '@lunasea-notification-relay/core/environment';
import { Logger } from '@lunasea-notification-relay/core/logger';
import { Firebase } from '@lunasea-notification-relay/core/firebase';

Logger.info(`LunaSea Notification Relay Server v${process.env.npm_package_version}`);
Environment.validate();
Firebase.initialize();
Server.start();
