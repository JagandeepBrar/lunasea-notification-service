import * as admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging, MulticastMessage } from 'firebase-admin/messaging';
import { Logger, Notifications } from '../../utils';

let firebase: admin.app.App;

/**
 * @private
 */
const _getServiceAccountPath = (): string => {
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
  return serviceaccount;
};

/**
 * Initialize the connection to Firebase and link it to the service account.
 */
export const initialize = (): void => {
  Logger.debug('Initializing Firebase...');
  firebase = admin.initializeApp({
    credential: admin.credential.cert(_getServiceAccountPath()),
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
    return await getAuth(firebase)
      .getUser(uid)
      .then((user) => {
        if (user) return true;
        return false;
      });
  } catch (error: any) {
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
    return await getFirestore(firebase)
      .doc(`users/${uid}`)
      .get()
      .then((document) => {
        const data = document.data();
        if (data) return data['devices'] ?? [];
        return [];
      });
  } catch (error: any) {
    Logger.error(uid, '/', error.message);
    return [];
  }
};

/**
 * Send a message to the supplied device token list.
 *
 * @param tokens Firebase device token list
 * @param payload Preconstructed NotificationPayload
 * @param settings Notification settings
 * @param data Data message payload
 */
export const sendNotification = async (
  tokens: string[],
  payload: Notifications.Payload,
  settings: Notifications.Settings,
): Promise<boolean> => {
  Logger.debug('Sending notification(s)...');
  try {
    const message: MulticastMessage = Notifications.buildMulticastMessage(
      tokens,
      payload,
      settings,
    );
    // Send the message
    return await getMessaging(firebase)
      .sendMulticast(message)
      .then((response) => {
        Logger.debug(
          `-> Sent notification(s): success: ${response.successCount} / failure: ${response.failureCount}`,
        );
        return response.successCount > 0;
      });
  } catch (error: any) {
    Logger.error(error.message);
    return false;
  }
};
