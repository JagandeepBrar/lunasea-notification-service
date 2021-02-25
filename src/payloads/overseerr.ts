import { Models } from '../models/overseerr';
import { LunaNotificationPayload, payloadTitle } from '../payloads';

export namespace Payloads {
    const title = (profile: string, body: string): string => payloadTitle('Overseerr', profile, body);

    /**
     * Construct a LunaNotificationPayload based on a media approved event.
     */
    export const mediaApprovedNotificationType = async (data: Models.RequestProperties, profile: string): Promise<LunaNotificationPayload> => {
        const body1 = data.subject;
        const body2 = `Originally Requested by ${data.username ?? 'Unknown User'}`;
        return <LunaNotificationPayload>{
            title: title(profile, `${data.media?.media_type === Models.MediaType.MOVIE ? 'Movie' : 'Series'} Approved`),
            body: [body1, body2].join('\n'),
        };
    };

    /**
     * Construct a LunaNotificationPayload based on a media available event.
     */
    export const mediaAvailableNotificationType = async (data: Models.RequestProperties, profile: string): Promise<LunaNotificationPayload> => {
        const body1 = data.subject;
        const body2 = `Originally Requested by ${data.username ?? 'Unknown User'}`;
        return <LunaNotificationPayload>{
            title: title(profile, `${data.media?.media_type === Models.MediaType.MOVIE ? 'Movie' : 'Series'} Available`),
            body: [body1, body2].join('\n'),
        };
    };

    /**
     * Construct a LunaNotificationPayload based on a media declined event.
     */
    export const mediaDeclinedNotificationType = async (data: Models.RequestProperties, profile: string): Promise<LunaNotificationPayload> => {
        const body1 = data.subject;
        const body2 = `Originally Requested by ${data.username ?? 'Unknown User'}`;
        return <LunaNotificationPayload>{
            title: title(profile, `${data.media?.media_type === Models.MediaType.MOVIE ? 'Movie' : 'Series'} Declined`),
            body: [body1, body2].join('\n'),
        };
    };

    /**
     * Construct a LunaNotificationPayload based on a media failed event.
     */
    export const mediaFailedNotificationType = async (data: Models.RequestProperties, profile: string): Promise<LunaNotificationPayload> => {
        const body1 = data.subject;
        const body2 = `Originally Requested by ${data.username ?? 'Unknown User'}`;
        return <LunaNotificationPayload>{
            title: title(profile, `${data.media?.media_type === Models.MediaType.MOVIE ? 'Movie' : 'Series'} Failed`),
            body: [body1, body2].join('\n'),
        };
    };

    /**
     * Construct a LunaNotificationPayload based on a media pending event.
     */
    export const mediaPendingNotificationType = async (data: Models.RequestProperties, profile: string): Promise<LunaNotificationPayload> => {
        const body1 = data.subject;
        const body2 = `Originally Requested by ${data.username ?? 'Unknown User'}`;
        return <LunaNotificationPayload>{
            title: title(profile, `${data.media?.media_type === Models.MediaType.MOVIE ? 'Movie' : 'Series'} Requested`),
            body: [body1, body2].join('\n'),
        };
    };

    /**
     * Construct a LunaNotificationPayload based on a test event.
     */
    export const testNotificationType = async (data: Models.RequestProperties, profile: string): Promise<LunaNotificationPayload> => {
        return <LunaNotificationPayload>{
            title: title(profile, 'Connection Test'),
            body: 'LunaSea is ready for Overseerr notifications!',
        };
    };
}
