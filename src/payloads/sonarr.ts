import { FanartTV } from '../api/fanart';
import { Models } from '../models/sonarr';
import { LunaNotificationPayload, payloadTitle } from '../payloads';

export namespace Payloads {
    const title = (profile: string, body: string): string => payloadTitle('Sonarr', profile, body);

    /**
     * Construct a LunaNotificationPayload based on a delete episode file event.
     */
    export const deleteEpisodeFileEventType = async (data: Models.EpisodeFileDeleteEventType, profile: string): Promise<LunaNotificationPayload> => {
        const body1 = data.episodes?.length == 1 ? `Season ${data.episodes[0].seasonNumber} – Episode ${data.episodes[0].episodeNumber}` : `${data.episodes?.length ?? 0} Episodes`;
        const body2 = 'Files Deleted';
        const image = data.series?.tvdbId ? await FanartTV.getSeriesPoster(data.series.tvdbId) : undefined;
        return <LunaNotificationPayload>{
            title: title(profile, data.series?.title ?? 'Unknown Series'),
            body: [body1, body2].join('\n'),
            image: image,
        };
    };

    /**
     * Construct a LunaNotificationPayload based on a delete series event.
     */
    export const deleteSeriesEventType = async (data: Models.SeriesDeleteEventType, profile: string): Promise<LunaNotificationPayload> => {
        let body = 'Series Deleted';
        if (data.deletedFiles) body += ' (With Files)';
        const image = data.series?.tvdbId ? await FanartTV.getSeriesPoster(data.series.tvdbId) : undefined;
        return <LunaNotificationPayload>{
            title: title(profile, data.series?.title ?? 'Unknown Series'),
            body: body,
            image: image,
        };
    };

    /**
     * Construct a LunaNotificationPayload based on a download event.
     */
    export const downloadEventType = async (data: Models.DownloadEventType, profile: string): Promise<LunaNotificationPayload> => {
        const body1 = data.episodes?.length == 1 ? `Season ${data.episodes[0].seasonNumber} – Episode ${data.episodes[0].episodeNumber}` : `${data.episodes?.length ?? 0} Episodes`;
        const quality = data.episodeFile ? data.episodeFile?.quality ?? 'Unknown Quality' : 'Unknown Quality';
        const body2 = data.isUpgrade ? `Upgraded (${quality})` : `Downloaded (${quality})`;
        const image = data.series?.tvdbId ? await FanartTV.getSeriesPoster(data.series.tvdbId) : undefined;
        return <LunaNotificationPayload>{
            title: title(profile, data.series?.title ?? 'Unknown Series'),
            body: [body1, body2].join('\n'),
            image: image,
        };
    };

    /**
     * Construct a LunaNotificationPayload based on a grab event.
     */
    export const grabEventType = async (data: Models.GrabEventType, profile: string): Promise<LunaNotificationPayload> => {
        const body1 = data.episodes?.length == 1 ? `Season ${data.episodes[0].seasonNumber} – Episode ${data.episodes[0].episodeNumber}` : `${data.episodes?.length ?? 0} Episodes`;
        const body2 = `Grabbed (${data.release?.quality ?? 'Unknown Quality'})`;
        const body3 = data?.release?.releaseTitle ?? 'Unknown Release';
        const image = data.series?.tvdbId ? await FanartTV.getSeriesPoster(data.series.tvdbId) : undefined;
        return <LunaNotificationPayload>{
            title: title(profile, data.series?.title ?? 'Unknown Series'),
            body: [body1, body2, body3].join('\n'),
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
        const image = data.series?.tvdbId ? await FanartTV.getSeriesPoster(data.series.tvdbId) : undefined;
        return <LunaNotificationPayload>{
            title: title(profile, data.series?.title ?? 'Unknown Series'),
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
            body: 'LunaSea is ready for Sonarr notifications!',
        };
    };
}
