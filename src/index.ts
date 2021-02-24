import { Server } from './server';
import { Environment } from './utilities/environment';
import { Logger } from './utilities/logger';
import { Firebase } from './utilities/firebase';

Logger.info(`LunaSea Notification Relay Server v${process.env.npm_package_version}`);
Environment.validate();
Firebase.initialize();
Server.start();
