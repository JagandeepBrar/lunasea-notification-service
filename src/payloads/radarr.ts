import { Models } from '../models/radarr';
import { LunaNotificationPayload, payloadTitle } from '../payloads';

export namespace Payloads {
    const title = (profile: string, body: string): string => payloadTitle('Radarr', profile, body);

    /**
     * Construct a LunaNotificationPayload based on a download event.
     */
    export const downloadEventType = (data: Models.DownloadEventType, profile: string): LunaNotificationPayload => {
        const quality = data.movieFile?.quality ? data.movieFile.quality : 'Unknown Quality';
        const body = data.isUpgrade ? `Upgraded (${quality})` : `Downloaded (${quality})`;
        return <LunaNotificationPayload>{
            title: title(profile, data.movie?.title ?? 'Unknown Movie'),
            body: body,
        };
    };

    /**
     * Construct a LunaNotificationPayload based on a grab event.
     */
    export const grabEventType = (data: Models.GrabEventType, profile: string): LunaNotificationPayload => {
        const body1 = `Grabbed (${data.release?.quality ?? 'Unknown Quality'})`;
        const body2 = data?.release?.releaseTitle ?? 'Unknown Release';
        return <LunaNotificationPayload>{
            title: title(profile, data.movie?.title ?? 'Unknown Movie'),
            body: [body1, body2].join('\n'),
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
            title: title(profile, data.movie?.title ?? 'Unknown Movie'),
            body: 'Files Renamed',
        };
    };

    /**
     * Construct a LunaNotificationPayload based on a test event.
     */
    export const testEventType = (data: Models.TestEventType, profile: string): LunaNotificationPayload => {
        return <LunaNotificationPayload>{
            title: title(profile, 'Connection Test'),
            body: 'LunaSea is ready for Radarr notifications!',
        };
    };
}
