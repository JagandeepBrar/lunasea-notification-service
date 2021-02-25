import { Models } from '../models/sonarr';
import { LunaNotificationPayload, payloadTitle } from '../payloads';

export namespace Payloads {
    const title = (profile: string, body: string): string => payloadTitle('Sonarr', profile, body);

    /**
     * Construct a LunaNotificationPayload based on a delete episode file event.
     */
    export const deleteEpisodeFileEventType = (data: Models.EpisodeFileDeleteEventType, profile: string): LunaNotificationPayload => {
        const body1 = data.episodes?.length == 1 ? `Season ${data.episodes[0].seasonNumber} – Episode ${data.episodes[0].episodeNumber}` : `${data.episodes?.length ?? 0} Episodes`;
        const body2 = 'Files Deleted';
        return <LunaNotificationPayload>{
            title: title(profile, data.series?.title ?? 'Unknown Series'),
            body: [body1, body2].join('\n'),
        };
    };

    /**
     * Construct a LunaNotificationPayload based on a delete series event.
     */
    export const deleteSeriesEventType = (data: Models.SeriesDeleteEventType, profile: string): LunaNotificationPayload => {
        let body = 'Series Deleted';
        if (data.deletedFiles) body += ' (With Files)';
        return <LunaNotificationPayload>{
            title: title(profile, data.series?.title ?? 'Unknown Series'),
            body: body,
        };
    };

    /**
     * Construct a LunaNotificationPayload based on a download event.
     */
    export const downloadEventType = (data: Models.DownloadEventType, profile: string): LunaNotificationPayload => {
        const body1 = data.episodes?.length == 1 ? `Season ${data.episodes[0].seasonNumber} – Episode ${data.episodes[0].episodeNumber}` : `${data.episodes?.length ?? 0} Episodes`;
        const quality = data.episodeFile ? data.episodeFile?.quality ?? 'Unknown Quality' : 'Unknown Quality';
        const body2 = data.isUpgrade ? `Upgraded (${quality})` : `Downloaded (${quality})`;
        return <LunaNotificationPayload>{
            title: title(profile, data.series?.title ?? 'Unknown Series'),
            body: [body1, body2].join('\n'),
        };
    };

    /**
     * Construct a LunaNotificationPayload based on a grab event.
     */
    export const grabEventType = (data: Models.GrabEventType, profile: string): LunaNotificationPayload => {
        const body1 = data.episodes?.length == 1 ? `Season ${data.episodes[0].seasonNumber} – Episode ${data.episodes[0].episodeNumber}` : `${data.episodes?.length ?? 0} Episodes`;
        const body2 = `Grabbed (${data.release?.quality ?? 'Unknown Quality'})`;
        const body3 = data?.release?.releaseTitle ?? 'Unknown Release';
        return <LunaNotificationPayload>{
            title: title(profile, data.series?.title ?? 'Unknown Series'),
            body: [body1, body2, body3].join('\n'),
        };
    };

    /**
     * Construct a LunaNotificationPayload based on a health event.
     */
    export const healthEventType = (data: Models.HealthEventType, profile: string): LunaNotificationPayload => {
        return <LunaNotificationPayload>{
            title: title(profile, 'Health Check'),
            body: data.message ?? 'Unknown Message',
        };
    };

    /**
     * Construct a LunaNotificationPayload based on a rename event.
     */
    export const renameEventType = (data: Models.RenameEventType, profile: string): LunaNotificationPayload => {
        return <LunaNotificationPayload>{
            title: title(profile, data.series?.title ?? 'Unknown Series'),
            body: 'Files Renamed',
        };
    };

    /**
     * Construct a LunaNotificationPayload based on a test event.
     */
    export const testEventType = (data: Models.TestEventType, profile: string): LunaNotificationPayload => {
        return <LunaNotificationPayload>{
            title: title(profile, 'Connection Test'),
            body: 'LunaSea is ready for Sonarr notifications!',
        };
    };
}
