import { FanartTV } from '../api/fanart';
import { Models } from '../models/radarr';
import { LunaNotificationPayload, payloadTitle } from '../payloads';

export namespace Payloads {
    const title = (profile: string, body: string): string => payloadTitle('Radarr', profile, body);

    /**
     * Construct a LunaNotificationPayload based on a download event.
     */
    export const downloadEventType = async (data: Models.DownloadEventType, profile: string): Promise<LunaNotificationPayload> => {
        const quality = data.movieFile?.quality ? data.movieFile.quality : 'Unknown Quality';
        const body = data.isUpgrade ? `Upgraded (${quality})` : `Downloaded (${quality})`;
        const image = data.movie?.tmdbId ? await FanartTV.getMoviePoster(data.movie.tmdbId) : undefined;
        return <LunaNotificationPayload>{
            title: title(profile, data.movie?.title ?? 'Unknown Movie'),
            body: body,
            image: image,
        };
    };

    /**
     * Construct a LunaNotificationPayload based on a grab event.
     */
    export const grabEventType = async (data: Models.GrabEventType, profile: string): Promise<LunaNotificationPayload> => {
        const body1 = `Grabbed (${data.release?.quality ?? 'Unknown Quality'})`;
        const body2 = data?.release?.releaseTitle ?? 'Unknown Release';
        const image = data.movie?.tmdbId ? await FanartTV.getMoviePoster(data.movie.tmdbId) : undefined;
        return <LunaNotificationPayload>{
            title: title(profile, data.movie?.title ?? 'Unknown Movie'),
            body: [body1, body2].join('\n'),
            image: image,
        };
    };

    /**
     * Construct a LunaNotificationPayload based on a health event.
     */
    export const healthEventType = async (data: Models.HealthEventType, profile: string): Promise<LunaNotificationPayload> => {
        return <LunaNotificationPayload>{
            title: title(profile, 'Health Check'),
            body: data.message ?? 'Unknown Message',
        };
    };

    /**
     * Construct a LunaNotificationPayload based on a rename event.
     */
    export const renameEventType = async (data: Models.RenameEventType, profile: string): Promise<LunaNotificationPayload> => {
        const image = data.movie?.tmdbId ? await FanartTV.getMoviePoster(data.movie.tmdbId) : undefined;
        return <LunaNotificationPayload>{
            title: title(profile, data.movie?.title ?? 'Unknown Movie'),
            body: 'Files Renamed',
            image: image,
        };
    };

    /**
     * Construct a LunaNotificationPayload based on a test event.
     */
    export const testEventType = async (data: Models.TestEventType, profile: string): Promise<LunaNotificationPayload> => {
        return <LunaNotificationPayload>{
            title: title(profile, 'Connection Test'),
            body: 'LunaSea is ready for Radarr notifications!',
        };
    };
}
