import { Server } from './server';
import { Firebase } from './services';
import { Environment, Logger } from './utils';

Logger.info(`LunaSea Notification Relay Server v${process.env.npm_package_version}`);
Environment.validate();
Firebase.initialize();
Server.start();
