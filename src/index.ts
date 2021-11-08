import { Server } from './server';
import { Firebase, Redis } from './services';
import { Environment, Logger } from './utils';

Logger.info(`LunaSea Notification Relay Server v${process.env.npm_package_version}`);
Environment.validate();
Firebase.initialize();
Redis.initialize();
Server.start();
