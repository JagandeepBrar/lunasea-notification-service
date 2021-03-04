import { FanartTV } from '../api/fanart';
import { MediaType, RequestProperties } from '../models/overseerr';
import { NotificationPayload, payloadTitle } from '../payloads';
import { Logger } from '../utilities/logger';

const title = (profile: string, body: string): string => payloadTitle('Overseerr', profile, body);

/**
 * Construct a NotificationPayload based on a media approved event.
 */
export const mediaApprovedPayload = async (data: RequestProperties, profile: string): Promise<NotificationPayload> => {
    const body1 = data.subject;
    const body2 = `Originally Requested by ${data.username ?? 'Unknown User'}`;
    const image = data.media?.media_type === MediaType.MOVIE ? await getMovieImageURL(data) : await getSeriesImageURL(data);
    return <NotificationPayload>{
        title: title(profile, `${data.media?.media_type === MediaType.MOVIE ? 'Movie' : 'Series'} Approved`),
        body: [body1, body2].join('\n'),
        image: image,
    };
};

/**
 * Construct a NotificationPayload based on a media available event.
 */
export const mediaAvailablePayload = async (data: RequestProperties, profile: string): Promise<NotificationPayload> => {
    const body1 = data.subject;
    const body2 = `Originally Requested by ${data.username ?? 'Unknown User'}`;
    const image = data.media?.media_type === MediaType.MOVIE ? await getMovieImageURL(data) : await getSeriesImageURL(data);
    return <NotificationPayload>{
        title: title(profile, `${data.media?.media_type === MediaType.MOVIE ? 'Movie' : 'Series'} Available`),
        body: [body1, body2].join('\n'),
        image: image,
    };
};

/**
 * Construct a NotificationPayload based on a media declined event.
 */
export const mediaDeclinedPayload = async (data: RequestProperties, profile: string): Promise<NotificationPayload> => {
    const body1 = data.subject;
    const body2 = `Originally Requested by ${data.username ?? 'Unknown User'}`;
    const image = data.media?.media_type === MediaType.MOVIE ? await getMovieImageURL(data) : await getSeriesImageURL(data);
    return <NotificationPayload>{
        title: title(profile, `${data.media?.media_type === MediaType.MOVIE ? 'Movie' : 'Series'} Declined`),
        body: [body1, body2].join('\n'),
        image: image,
    };
};

/**
 * Construct a NotificationPayload based on a media failed event.
 */
export const mediaFailedPayload = async (data: RequestProperties, profile: string): Promise<NotificationPayload> => {
    const body1 = data.subject;
    const body2 = `Originally Requested by ${data.username ?? 'Unknown User'}`;
    const image = data.media?.media_type === MediaType.MOVIE ? await getMovieImageURL(data) : await getSeriesImageURL(data);
    return <NotificationPayload>{
        title: title(profile, `${data.media?.media_type === MediaType.MOVIE ? 'Movie' : 'Series'} Failed`),
        body: [body1, body2].join('\n'),
        image: image,
    };
};

/**
 * Construct a NotificationPayload based on a media pending event.
 */
export const mediaPendingPayload = async (data: RequestProperties, profile: string): Promise<NotificationPayload> => {
    const body1 = data.subject;
    const body2 = `Originally Requested by ${data.username ?? 'Unknown User'}`;
    const image = data.media?.media_type === MediaType.MOVIE ? await getMovieImageURL(data) : await getSeriesImageURL(data);
    return <NotificationPayload>{
        title: title(profile, `${data.media?.media_type === MediaType.MOVIE ? 'Movie' : 'Series'} Requested`),
        body: [body1, body2].join('\n'),
        image: image,
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

/**
 * Pull the TVDB ID and fetch the series poster URL
 *
 * @param data RequestProperties from Overseerr
 */
const getSeriesImageURL = async (data: RequestProperties): Promise<string | undefined> => {
    try {
        if (data.media?.tvdbId) {
            const id = parseInt(data.media.tvdbId);
            if (!isNaN(id)) return await FanartTV.getSeriesPoster(id);
        }
    } catch (error) {
        Logger.error(error);
    }
    return undefined;
};

/**
 * Pull the TMDB ID and fetch the movie poster URL
 *
 * @param data RequestProperties from Overseerr
 */
const getMovieImageURL = async (data: RequestProperties): Promise<string | undefined> => {
    try {
        if (data.media?.tmdbId) {
            const id = parseInt(data.media.tmdbId);
            if (!isNaN(id)) return await FanartTV.getMoviePoster(id);
        }
    } catch (error) {
        Logger.error(error);
    }
    return undefined;
};
