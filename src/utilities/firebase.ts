import { Logger } from './logger';
import * as admin from 'firebase-admin';
import { NotificationPayload } from '../payloads';

export namespace Firebase {
  /**
   * Initialize the connection to Firebase and link it to the service account.
   */
  export const initialize = (): void => {
    // Determine service account path
    let serviceaccount: string;
    switch ((process.env.NODE_ENV ?? '').toLowerCase()) {
      case 'docker':
        serviceaccount = '../config/serviceaccount.json';
        break;
      case 'production':
      case 'development':
      default:
        serviceaccount = 'serviceaccount.json';
        break;
    }
    Logger.debug('Initializing Firebase...');
    admin.initializeApp({
      credential: admin.credential.cert(serviceaccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
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
   * @param tokens Firebase device token list
   * @param payload Preconstructed NotificationPayload
   * @param data Data message payload
   */
  export const sendNotification = async (
    tokens: string[],
    payload: NotificationPayload,
  ): Promise<boolean> => {
    Logger.debug('Sending notification(s)...');
    try {
      const message: admin.messaging.MulticastMessage = <admin.messaging.MulticastMessage>{
        tokens: tokens,
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.image,
        },
        data: payload.data,
        android: {
          notification: {
            sound: 'default',
          },
          priority: 'high',
          ttl: 2419200,
        },
        apns: {
          payload: {
            aps: {
              mutableContent: payload.image !== undefined,
              sound: 'default',
              contentAvailable: true,
            },
          },
        },
      };
      // Send the message
      return await admin
        .messaging()
        .sendMulticast(message)
        .then((response) => {
          Logger.debug(
            `-> Sent notification(s): success: ${response.successCount} / failure: ${response.failureCount}`,
          );
          return response.successCount > 0;
        });
    } catch (error) {
      Logger.error(error.message);
      return false;
    }
  };
}
