import { FanartTV } from '../api/fanart';
import { DownloadEventType, GrabEventType, HealthEventType, RenameEventType, TestEventType } from '../models/radarr';
import { NotificationPayload, payloadTitle } from '../payloads';

const title = (profile: string, body: string): string => payloadTitle('Radarr', profile, body);

/**
 * Construct a NotificationPayload based on a download event.
 */
export const downloadEventType = async (data: DownloadEventType, profile: string): Promise<NotificationPayload> => {
    const quality = data.movieFile?.quality ? data.movieFile.quality : 'Unknown Quality';
    const body = data.isUpgrade ? `Upgraded (${quality})` : `Downloaded (${quality})`;
    const image = data.movie?.tmdbId ? await FanartTV.getMoviePoster(data.movie.tmdbId) : undefined;
    return <NotificationPayload>{
        title: title(profile, data.movie?.title ?? 'Unknown Movie'),
        body: body,
        image: image,
    };
};

/**
 * Construct a NotificationPayload based on a grab event.
 */
export const grabEventType = async (data: GrabEventType, profile: string): Promise<NotificationPayload> => {
    const body1 = `Grabbed (${data.release?.quality ?? 'Unknown Quality'})`;
    const body2 = data?.release?.releaseTitle ?? 'Unknown Release';
    const image = data.movie?.tmdbId ? await FanartTV.getMoviePoster(data.movie.tmdbId) : undefined;
    return <NotificationPayload>{
        title: title(profile, data.movie?.title ?? 'Unknown Movie'),
        body: [body1, body2].join('\n'),
        image: image,
    };
};

/**
 * Construct a NotificationPayload based on a health event.
 */
export const healthEventType = async (data: HealthEventType, profile: string): Promise<NotificationPayload> => {
    return <NotificationPayload>{
        title: title(profile, 'Health Check'),
        body: data.message ?? 'Unknown Message',
    };
};

/**
 * Construct a NotificationPayload based on a rename event.
 */
export const renameEventType = async (data: RenameEventType, profile: string): Promise<NotificationPayload> => {
    const image = data.movie?.tmdbId ? await FanartTV.getMoviePoster(data.movie.tmdbId) : undefined;
    return <NotificationPayload>{
        title: title(profile, data.movie?.title ?? 'Unknown Movie'),
        body: 'Files Renamed',
        image: image,
    };
};

/**
 * Construct a NotificationPayload based on a test event.
 */
export const testEventType = async (data: TestEventType, profile: string): Promise<NotificationPayload> => {
    return <NotificationPayload>{
        title: title(profile, 'Connection Test'),
        body: 'LunaSea is ready for Radarr notifications!',
    };
};
