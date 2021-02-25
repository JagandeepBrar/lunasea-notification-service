import { MediaType, RequestProperties } from '../models/overseerr';
import { NotificationPayload, payloadTitle } from '../payloads';

const title = (profile: string, body: string): string => payloadTitle('Overseerr', profile, body);

/**
 * Construct a NotificationPayload based on a media approved event.
 */
export const mediaApprovedPayload = async (data: RequestProperties, profile: string): Promise<NotificationPayload> => {
    const body1 = data.subject;
    const body2 = `Originally Requested by ${data.username ?? 'Unknown User'}`;
    return <NotificationPayload>{
        title: title(profile, `${data.media?.media_type === MediaType.MOVIE ? 'Movie' : 'Series'} Approved`),
        body: [body1, body2].join('\n'),
    };
};

/**
 * Construct a NotificationPayload based on a media available event.
 */
export const mediaAvailablePayload = async (data: RequestProperties, profile: string): Promise<NotificationPayload> => {
    const body1 = data.subject;
    const body2 = `Originally Requested by ${data.username ?? 'Unknown User'}`;
    return <NotificationPayload>{
        title: title(profile, `${data.media?.media_type === MediaType.MOVIE ? 'Movie' : 'Series'} Available`),
        body: [body1, body2].join('\n'),
    };
};

/**
 * Construct a NotificationPayload based on a media declined event.
 */
export const mediaDeclinedPayload = async (data: RequestProperties, profile: string): Promise<NotificationPayload> => {
    const body1 = data.subject;
    const body2 = `Originally Requested by ${data.username ?? 'Unknown User'}`;
    return <NotificationPayload>{
        title: title(profile, `${data.media?.media_type === MediaType.MOVIE ? 'Movie' : 'Series'} Declined`),
        body: [body1, body2].join('\n'),
    };
};

/**
 * Construct a NotificationPayload based on a media failed event.
 */
export const mediaFailedPayload = async (data: RequestProperties, profile: string): Promise<NotificationPayload> => {
    const body1 = data.subject;
    const body2 = `Originally Requested by ${data.username ?? 'Unknown User'}`;
    return <NotificationPayload>{
        title: title(profile, `${data.media?.media_type === MediaType.MOVIE ? 'Movie' : 'Series'} Failed`),
        body: [body1, body2].join('\n'),
    };
};

/**
 * Construct a NotificationPayload based on a media pending event.
 */
export const mediaPendingPayload = async (data: RequestProperties, profile: string): Promise<NotificationPayload> => {
    const body1 = data.subject;
    const body2 = `Originally Requested by ${data.username ?? 'Unknown User'}`;
    return <NotificationPayload>{
        title: title(profile, `${data.media?.media_type === MediaType.MOVIE ? 'Movie' : 'Series'} Requested`),
        body: [body1, body2].join('\n'),
    };
};

/**
 * Construct a NotificationPayload based on a test event.
 */
export const testPayload = async (data: RequestProperties, profile: string): Promise<NotificationPayload> => {
    return <NotificationPayload>{
        title: title(profile, 'Connection Test'),
        body: 'LunaSea is ready for Overseerr notifications!',
    };
};
