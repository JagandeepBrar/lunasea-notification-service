import { FanartTV } from '../api/fanart';
import {
    DownloadEventType,
    EpisodeFileDeleteEventType,
    GrabEventType,
    HealthEventType,
    RenameEventType,
    SeriesDeleteEventType,
    TestEventType,
} from '../models/sonarr';
import { NotificationPayload, payloadTitle } from '../payloads';

const title = (profile: string, body: string): string => payloadTitle('Sonarr', profile, body);
const moduleKey = 'sonarr';

/**
 * Construct a NotificationPayload based on a delete episode file event.
 */
export const deleteEpisodeFilePayload = async (data: EpisodeFileDeleteEventType, profile: string): Promise<NotificationPayload> => {
    const body1 =
        data.episodes?.length == 1
            ? `Season ${data.episodes[0].seasonNumber} – Episode ${data.episodes[0].episodeNumber}`
            : `${data.episodes?.length ?? 0} Episodes`;
    const body2 = 'Files Deleted';
    const image = data.series?.tvdbId ? await FanartTV.getSeriesPoster(data.series.tvdbId) : undefined;
    return <NotificationPayload>{
        title: title(profile, data.series?.title ?? 'Unknown Series'),
        body: [body1, body2].join('\n'),
        image: image,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.eventType,
            seriesId: data.series?.id?.toString() ?? '-1',
            seasonNumber: data.episodes && data.episodes.length > 0 ? data.episodes[0]?.seasonNumber?.toString() ?? '-1' : '-1',
        },
    };
};

/**
 * Construct a NotificationPayload based on a delete series event.
 */
export const deleteSeriesPayload = async (data: SeriesDeleteEventType, profile: string): Promise<NotificationPayload> => {
    let body = 'Series Deleted';
    if (data.deletedFiles) body += ' (With Files)';
    const image = data.series?.tvdbId ? await FanartTV.getSeriesPoster(data.series.tvdbId) : undefined;
    return <NotificationPayload>{
        title: title(profile, data.series?.title ?? 'Unknown Series'),
        body: body,
        image: image,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.eventType,
        },
    };
};

/**
 * Construct a NotificationPayload based on a download event.
 */
export const downloadPayload = async (data: DownloadEventType, profile: string): Promise<NotificationPayload> => {
    const body1 =
        data.episodes?.length == 1
            ? `Season ${data.episodes[0].seasonNumber} – Episode ${data.episodes[0].episodeNumber}`
            : `${data.episodes?.length ?? 0} Episodes`;
    const quality = data.episodeFile ? data.episodeFile?.quality ?? 'Unknown Quality' : 'Unknown Quality';
    const body2 = data.isUpgrade ? `Upgraded (${quality})` : `Downloaded (${quality})`;
    const image = data.series?.tvdbId ? await FanartTV.getSeriesPoster(data.series.tvdbId) : undefined;
    return <NotificationPayload>{
        title: title(profile, data.series?.title ?? 'Unknown Series'),
        body: [body1, body2].join('\n'),
        image: image,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.eventType,
            seriesId: data.series?.id?.toString() ?? '-1',
            seasonNumber: data.episodes && data.episodes.length > 0 ? data.episodes[0]?.seasonNumber?.toString() ?? '-1' : '-1',
        },
    };
};

/**
 * Construct a NotificationPayload based on a grab event.
 */
export const grabPayload = async (data: GrabEventType, profile: string): Promise<NotificationPayload> => {
    const body1 =
        data.episodes?.length == 1
            ? `Season ${data.episodes[0].seasonNumber} – Episode ${data.episodes[0].episodeNumber}`
            : `${data.episodes?.length ?? 0} Episodes`;
    const body2 = `Grabbed (${data.release?.quality ?? 'Unknown Quality'})`;
    const body3 = data?.release?.releaseTitle ?? 'Unknown Release';
    const image = data.series?.tvdbId ? await FanartTV.getSeriesPoster(data.series.tvdbId) : undefined;
    return <NotificationPayload>{
        title: title(profile, data.series?.title ?? 'Unknown Series'),
        body: [body1, body2, body3].join('\n'),
        image: image,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.eventType,
            seriesId: data.series?.id?.toString() ?? '-1',
            seasonNumber: data.episodes && data.episodes.length > 0 ? data.episodes[0]?.seasonNumber?.toString() ?? '-1' : '-1',
        },
    };
};

/**
 * Construct a NotificationPayload based on a health event.
 */
export const healthPayload = async (data: HealthEventType, profile: string): Promise<NotificationPayload> => {
    return <NotificationPayload>{
        title: title(profile, 'Health Check'),
        body: data.message ?? 'Unknown Message',
        data: {
            module: moduleKey,
            profile: profile,
            event: data.eventType,
        },
    };
};

/**
 * Construct a NotificationPayload based on a rename event.
 */
export const renamePayload = async (data: RenameEventType, profile: string): Promise<NotificationPayload> => {
    const image = data.series?.tvdbId ? await FanartTV.getSeriesPoster(data.series.tvdbId) : undefined;
    return <NotificationPayload>{
        title: title(profile, data.series?.title ?? 'Unknown Series'),
        body: 'Files Renamed',
        image: image,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.eventType,
            seriesId: data.series?.id?.toString() ?? '-1',
        },
    };
};

/**
 * Construct a NotificationPayload based on a test event.
 */
export const testPayload = async (data: TestEventType, profile: string): Promise<NotificationPayload> => {
    return <NotificationPayload>{
        title: title(profile, 'Connection Test'),
        body: 'LunaSea is ready for Sonarr notifications!',
        data: {
            module: moduleKey,
            profile: profile,
            event: data.eventType,
        },
    };
};
