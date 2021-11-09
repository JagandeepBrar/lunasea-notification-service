import { MulticastMessage } from 'firebase-admin/messaging';

/**
 * Generic Notification payload
 */
export interface Payload {
  title: string;
  body: string;
  image?: string;
  data?: {
    [key: string]: string;
  };
}

/**
 * Generic Notification Settings
 */
export interface Settings {
  sound: boolean;
}

/**
 * Build a Firebase MulticastMessage given a generic notification payload and settings
 *
 * @param tokens Firebase device token list
 * @param payload Generic notification payload
 * @param settings Notification settings
 * @returns Firebase MulticastMessage payload
 */
export const buildMulticastMessage = (
  tokens: string[],
  payload: Payload,
  settings: Settings,
): MulticastMessage => {
  return <MulticastMessage>{
    tokens: tokens,
    notification: {
      title: payload.title,
      body: payload.body,
      imageUrl: payload.image,
    },
    data: payload.data,
    android: {
      notification: {
        sound: settings.sound ? 'default' : undefined,
      },
      priority: 'high',
      ttl: 2419200,
    },
    apns: {
      payload: {
        aps: {
          mutableContent: payload.image !== undefined,
          sound: settings.sound ? 'default' : undefined,
          contentAvailable: true,
        },
      },
    },
  };
};

/**
 * Construct the title of any notification.
 *
 * If `profile` is undefined or "default", it does not append the profile to the title.
 * Otherwise, it does within brackets after the module name but before the body.
 *
 * Example:
 * - `Overseerr: Media Requested` without a profile
 * - `Overseerr (Profile): Media Requested` with a profile
 *
 * @param module The module/software.
 * @param profile The profile title.
 * @param body The title "body", as in the text to be appended after the module and profile name.
 */
export const generateTitle = (module: string, profile: string, body: string): string => {
  if (profile && profile !== 'default') return `${module} (${profile}): ${body}`;
  return `${module}: ${body}`;
};
