import { Logger } from '@lunasea-notification-relay/core/logger';

export namespace Environment {
    /**
     * Validate that all required environment values are found.
     *
     * If a value is not found, it will exit the application.
     */
    export const validate = (): void => {
        if (!process.env.DATABASE_URL) {
            Logger.fatal('Unable to find DATABASE_URL environment value. Exiting...');
            process.exit(1);
        }
        if (!process.env.RESTRICTED_PACKAGE_NAME) {
            Logger.fatal('Unable to find RESTRICTED_PACKAGE_NAME environment value. Exiting...');
            process.exit(1);
        }
    };
}
