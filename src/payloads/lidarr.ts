import { Models } from '../models/lidarr';
import { LunaNotificationPayload, payloadTitle } from '../payloads';

export namespace Payloads {
    const title = (profile: string, body: string): string => payloadTitle('Lidarr', profile, body);

    /**
     * Construct a LunaNotificationPayload based on a grab event.
     */
    export const grabEventType = (data: Models.GrabEventType, profile: string): LunaNotificationPayload => {
        const body1 = data.albums?.length == 1 ? data.albums[0].title ?? 'Unknown Album' : `${data.albums?.length ?? 0} Albums`;
        const body2 = `Grabbed (${data.release?.quality ?? 'Unknown Quality'})`;
        const body3 = data?.release?.releaseTitle ?? 'Unknown Release';
        return <LunaNotificationPayload>{
            title: title(profile, data.artist?.name ?? 'Unknown Artist'),
            body: [body1, body2, body3].join('\n'),
        };
    };

    /**
     * Construct a LunaNotificationPayload based on a download event.
     */
    export const downloadEventType = (data: Models.DownloadEventType, profile: string): LunaNotificationPayload => {
        const body1 = data.tracks?.length == 1 ? data.tracks[0].title ?? 'Unknown Track' : `${data.tracks?.length ?? 0} Tracks`;
        const quality = data.tracks && data.tracks.length > 0 ? data.tracks[0]?.quality ?? 'Unknown Quality' : 'Unknown Quality';
        const body2 = data.isUpgrade ? `Upgraded (${quality})` : `Downloaded (${quality})`;
        return <LunaNotificationPayload>{
            title: title(profile, data.artist?.name ?? 'Unknown Artist'),
            body: [body1, body2].join('\n'),
        };
    };

    /**
     * Construct a LunaNotificationPayload based on a rename event.
     */
    export const renameEventType = (data: Models.RenameEventType, profile: string): LunaNotificationPayload => {
        return <LunaNotificationPayload>{
            title: title(profile, data.artist?.name ?? 'Unknown Artist'),
            body: 'Files Renamed',
        };
    };

    /**
     * Construct a LunaNotificationPayload based on a retag event.
     */
    export const retagEventType = (data: Models.RetagEventType, profile: string): LunaNotificationPayload => {
        return <LunaNotificationPayload>{
            title: title(profile, data.artist?.name ?? 'Unknown Artist'),
            body: 'Tracks Retagged',
        };
    };

    /**
     * Construct a LunaNotificationPayload based on a test event.
     */
    export const testEventType = (data: Models.TestEventType, profile: string): LunaNotificationPayload => {
        return <LunaNotificationPayload>{
            title: title(profile, 'Connection Test'),
            body: 'LunaSea is ready for Lidarr notifications!',
        };
    };
}
