import { Logger } from './logger';

export namespace Environment {
    /**
     * Validate that all required environment values are found.
     *
     * If a value is not found, it will exit the application.
     */
    export const validate = (): void => {
        if (!process.env.DATABASE_URL) shutdown('DATABASE_URL');
        if (!process.env.RESTRICTED_PACKAGE_NAME) shutdown('RESTRICTED_PACKAGE_NAME');
    };

    /**
     * Shutdown application with a log showing which variable is missing from the environment.
     *
     * @param variable Environmental variable to print as missing
     */
    const shutdown = (variable: string): void => {
        Logger.fatal(`Unable to find ${variable} environment value. Exiting...`);
        process.exit(1);
    };
}
