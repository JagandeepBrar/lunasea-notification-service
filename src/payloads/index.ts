export interface LunaNotificationPayload {
    title: string;
    body: string;
    image?: string;
    data?: {
        [key: string]: string;
    };
}

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
export const payloadTitle = (module: string, profile: string, body: string): string => {
    if (profile && profile !== 'default') return `${module} (${profile}): ${body}`;
    return `${module}: ${body}`;
};
