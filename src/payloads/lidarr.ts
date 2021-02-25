import { FanartTV } from '../api/fanart';
import { DownloadEventType, GrabEventType, RenameEventType, RetagEventType, TestEventType } from '../models/lidarr';
import { NotificationPayload, payloadTitle } from '../payloads';

const title = (profile: string, body: string): string => payloadTitle('Lidarr', profile, body);

/**
 * Construct a NotificationPayload based on a grab event.
 */
export const grabPayload = async (data: GrabEventType, profile: string): Promise<NotificationPayload> => {
    const body1 = data.albums?.length == 1 ? data.albums[0].title ?? 'Unknown Album' : `${data.albums?.length ?? 0} Albums`;
    const body2 = `Grabbed (${data.release?.quality ?? 'Unknown Quality'})`;
    const body3 = data?.release?.releaseTitle ?? 'Unknown Release';
    const image = data.artist?.mbId ? await FanartTV.getArtistThumbnail(data.artist.mbId) : undefined;
    return <NotificationPayload>{
        title: title(profile, data.artist?.name ?? 'Unknown Artist'),
        body: [body1, body2, body3].join('\n'),
        image: image,
    };
};

/**
 * Construct a NotificationPayload based on a download event.
 */
export const downloadPayload = async (data: DownloadEventType, profile: string): Promise<NotificationPayload> => {
    const body1 = data.tracks?.length == 1 ? data.tracks[0].title ?? 'Unknown Track' : `${data.tracks?.length ?? 0} Tracks`;
    const quality = data.tracks && data.tracks.length > 0 ? data.tracks[0]?.quality ?? 'Unknown Quality' : 'Unknown Quality';
    const body2 = data.isUpgrade ? `Upgraded (${quality})` : `Downloaded (${quality})`;
    const image = data.artist?.mbId ? await FanartTV.getArtistThumbnail(data.artist.mbId) : undefined;
    return <NotificationPayload>{
        title: title(profile, data.artist?.name ?? 'Unknown Artist'),
        body: [body1, body2].join('\n'),
        image: image,
    };
};

/**
 * Construct a NotificationPayload based on a rename event.
 */
export const renamePayload = async (data: RenameEventType, profile: string): Promise<NotificationPayload> => {
    const image = data.artist?.mbId ? await FanartTV.getArtistThumbnail(data.artist.mbId) : undefined;
    return <NotificationPayload>{
        title: title(profile, data.artist?.name ?? 'Unknown Artist'),
        body: 'Files Renamed',
        image: image,
    };
};

/**
 * Construct a NotificationPayload based on a retag event.
 */
export const retagPayload = async (data: RetagEventType, profile: string): Promise<NotificationPayload> => {
    const image = data.artist?.mbId ? await FanartTV.getArtistThumbnail(data.artist.mbId) : undefined;
    return <NotificationPayload>{
        title: title(profile, data.artist?.name ?? 'Unknown Artist'),
        body: 'Tracks Retagged',
        image: image,
    };
};

/**
 * Construct a NotificationPayload based on a test event.
 */
export const testPayload = async (data: TestEventType, profile: string): Promise<NotificationPayload> => {
    return <NotificationPayload>{
        title: title(profile, 'Connection Test'),
        body: 'LunaSea is ready for Lidarr notifications!',
    };
};
