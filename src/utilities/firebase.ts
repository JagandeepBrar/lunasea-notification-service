import { Logger } from './logger';
import * as serviceaccount from '../../serviceaccount.json';
import * as admin from 'firebase-admin';

export namespace Firebase {
    /**
     * Initialize the connection to Firebase and link it to the service account.
     */
    export const initialize = (): void => {
        Logger.debug('Initializing Firebase...');
        Logger.debug('-> Project:', serviceaccount['project_id']);
        Logger.debug('-> Database URL:', process.env.DATABASE_URL);
        Logger.debug('-> Restricted Package Name:', process.env.RESTRICTED_PACKAGE_NAME);
        admin.initializeApp({
            credential: admin.credential.cert(serviceaccount as admin.ServiceAccount),
            databaseURL: process.env.DATABASE_URL,
        });
        Logger.debug('Initialized Firebase.');
    };

    /**
     * Validate that the a user with the given UID exists in the Firebase project.
     *
     * @param uid Firebase UID
     * @returns true if found, false if not found
     */
    export const validateUserID = async (uid: string): Promise<boolean> => {
        try {
            if (!uid) return false;
            return await admin
                .auth()
                .getUser(uid)
                .then((user) => {
                    if (user) return true;
                    return false;
                });
        } catch (error) {
            Logger.error(uid, '/', error.message);
            return false;
        }
    };

    /**
     * Returns a list of device tokens that are attached to the given UID.
     *
     * @param uid Firebase UID
     * @returns list of string device token IDs
     */
    export const getDeviceTokenList = async (uid: string): Promise<string[]> => {
        try {
            if (!uid) return [];
            return await admin
                .firestore()
                .doc(`users/${uid}`)
                .get()
                .then((document) => {
                    const data = document.data();
                    if (data) return data['devices'] ?? [];
                    return [];
                });
        } catch (error) {
            Logger.error(uid, '/', error.message);
            return [];
        }
    };

    /**
     * Send a message to the supplied device token list.
     *
     * @param devices Firebase device token list
     * @param notification Notification message payload
     * @param data Data message payload
     */
    export const sendFirebaseCloudMessage = async (
        devices: string[],
        notification?: admin.messaging.NotificationMessagePayload,
        data?: admin.messaging.DataMessagePayload,
    ): Promise<boolean> => {
        try {
            // Initialize the payload
            const payload: admin.messaging.MessagingPayload = {};
            if (data) payload.data = data;
            if (notification) {
                payload.notification = notification;
                payload.notification.sound = 'default';
            }
            // Initialize the options
            const options: admin.messaging.MessagingOptions = {
                contentAvailable: true,
                timeToLive: 604800,
                restrictedPackageName: process.env.RESTRICTED_PACKAGE_NAME,
            };
            // Send the messages
            return await admin
                .messaging()
                .sendToDevice(devices, payload, options)
                .then(() => true);
        } catch (error) {
            Logger.error(error.message);
            return false;
        }
    };
}