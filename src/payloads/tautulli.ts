import * as Models from '../models/tautulli';
import { NotificationPayload, payloadTitle } from '../payloads';

const createTitle = (profile: string, body: string): string => payloadTitle('Tautulli', profile, body);
const moduleKey = 'tautulli';

/**
 * Construct a NotificationPayload based on a buffer warning event.
 */
export const bufferWarningPayload = async (data: Models.BufferWarningEventType, profile: string): Promise<NotificationPayload> => {
    const user = data.user ?? 'Unknown User';
    const player = data.player ?? 'Unknown Player';
    const title = data.title ?? 'Unknown Content';
    const body = (data.message?.length ?? 0) == 0 ? `${user} (${player}) is buffering ${title}` : data.message;
    return <NotificationPayload>{
        title: createTitle(profile, 'Buffer Warning'),
        body: body,
        image: !data.poster_url ? undefined : data.poster_url,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.event_type,
            user_id: data.user_id ?? '',
            session_id: data.session_id ?? '',
        },
    };
};

/**
 * Construct a NotificationPayload based on a playback stop event.
 */
export const playbackErrorPayload = async (data: Models.PlaybackErrorEventType, profile: string): Promise<NotificationPayload> => {
    const user = data.user ?? 'Unknown User';
    const player = data.player ?? 'Unknown Player';
    const title = data.title ?? 'Unknown Content';
    const body = (data.message?.length ?? 0) == 0 ? `${user} (${player}) encountered an error trying to play ${title}` : data.message;
    return <NotificationPayload>{
        title: createTitle(profile, 'Playback Error'),
        body: body,
        image: !data.poster_url ? undefined : data.poster_url,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.event_type,
            user_id: data.user_id ?? '',
        },
    };
};

/**
 * Construct a NotificationPayload based on a playback pause event.
 */
export const playbackPausePayload = async (data: Models.PlaybackPauseEventType, profile: string): Promise<NotificationPayload> => {
    const user = data.user ?? 'Unknown User';
    const player = data.player ?? 'Unknown Player';
    const title = data.title ?? 'Unknown Content';
    const body = (data.message?.length ?? 0) == 0 ? `${user} (${player}) has paused ${title}` : data.message;
    return <NotificationPayload>{
        title: createTitle(profile, 'Playback Paused'),
        body: body,
        image: !data.poster_url ? undefined : data.poster_url,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.event_type,
            user_id: data.user_id ?? '',
            session_id: data.session_id ?? '',
        },
    };
};

/**
 * Construct a NotificationPayload based on a playback resume event.
 */
export const playbackResumePayload = async (data: Models.PlaybackResumeEventType, profile: string): Promise<NotificationPayload> => {
    const user = data.user ?? 'Unknown User';
    const player = data.player ?? 'Unknown Player';
    const title = data.title ?? 'Unknown Content';
    const body = (data.message?.length ?? 0) == 0 ? `${user} (${player}) has resumed ${title}` : data.message;
    return <NotificationPayload>{
        title: createTitle(profile, 'Playback Resumed'),
        body: body,
        image: !data.poster_url ? undefined : data.poster_url,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.event_type,
            user_id: data.user_id ?? '',
            session_id: data.session_id ?? '',
        },
    };
};

/**
 * Construct a NotificationPayload based on a playback start event.
 */
export const playbackStartPayload = async (data: Models.PlaybackStartEventType, profile: string): Promise<NotificationPayload> => {
    const user = data.user ?? 'Unknown User';
    const player = data.player ?? 'Unknown Player';
    const title = data.title ?? 'Unknown Content';
    const body = (data.message?.length ?? 0) == 0 ? `${user} (${player}) started playing ${title}` : data.message;
    return <NotificationPayload>{
        title: createTitle(profile, 'Playback Started'),
        body: body,
        image: !data.poster_url ? undefined : data.poster_url,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.event_type,
            user_id: data.user_id ?? '',
            session_id: data.session_id ?? '',
        },
    };
};

/**
 * Construct a NotificationPayload based on a playback stop event.
 */
export const playbackStopPayload = async (data: Models.PlaybackStopEventType, profile: string): Promise<NotificationPayload> => {
    const user = data.user ?? 'Unknown User';
    const player = data.player ?? 'Unknown Player';
    const title = data.title ?? 'Unknown Content';
    const body = (data.message?.length ?? 0) == 0 ? `${user} (${player}) has stopped ${title}` : data.message;
    return <NotificationPayload>{
        title: createTitle(profile, 'Playback Stopped'),
        body: body,
        image: !data.poster_url ? undefined : data.poster_url,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.event_type,
            user_id: data.user_id ?? '',
        },
    };
};

/**
 * Construct a NotificationPayload based on a plex remote access back up event.
 */
export const plexRemoteAccessBackUpPayload = async (
    data: Models.PlexRemoteAccessBackUpEventType,
    profile: string,
): Promise<NotificationPayload> => {
    const body = (data.message?.length ?? 0) == 0 ? 'The Plex Media Server remote access is back up' : data.message;
    return <NotificationPayload>{
        title: createTitle(profile, 'Plex Remote Access Back Up'),
        body: body,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.event_type,
        },
    };
};

/**
 * Construct a NotificationPayload based on a plex remote access down event.
 */
export const plexRemoteAccessDownPayload = async (
    data: Models.PlexRemoteAccessDownEventType,
    profile: string,
): Promise<NotificationPayload> => {
    const reason = data.remote_access_reason ?? 'Unknown Reason';
    const body = (data.message?.length ?? 0) == 0 ? `The Plex Media Server remote access is down (${reason})` : data.message;
    return <NotificationPayload>{
        title: createTitle(profile, 'Plex Remote Access Down'),
        body: body,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.event_type,
        },
    };
};

/**
 * Construct a NotificationPayload based on a plex server back up event.
 */
export const plexServerBackUpPayload = async (data: Models.PlexServerBackUpEventType, profile: string): Promise<NotificationPayload> => {
    const body = (data.message?.length ?? 0) == 0 ? 'The Plex Media Server is back up' : data.message;
    return <NotificationPayload>{
        title: createTitle(profile, 'Plex Server Back Up'),
        body: body,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.event_type,
        },
    };
};

/**
 * Construct a NotificationPayload based on a plex server down event.
 */
export const plexServerDownPayload = async (data: Models.PlexServerDownEventType, profile: string): Promise<NotificationPayload> => {
    const body = (data.message?.length ?? 0) == 0 ? 'The Plex Media Server is down' : data.message;
    return <NotificationPayload>{
        title: createTitle(profile, 'Plex Server Down'),
        body: body,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.event_type,
        },
    };
};

/**
 * Construct a NotificationPayload based on a plex update available event.
 */
export const plexUpdateAvailablePayload = async (
    data: Models.PlexUpdateAvailableEventType,
    profile: string,
): Promise<NotificationPayload> => {
    const version = data.update_version ?? 'Unknown Version';
    const body = (data.message?.length ?? 0) == 0 ? `An update is available for the Plex Media Server (version ${version})` : data.message;
    return <NotificationPayload>{
        title: createTitle(profile, 'Plex Update Available'),
        body: body,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.event_type,
        },
    };
};

/**
 * Construct a NotificationPayload based on a recently added event.
 */
export const recentlyAddedPayload = async (data: Models.RecentlyAddedEventType, profile: string): Promise<NotificationPayload> => {
    const title = data.title ?? 'Unknown Content';
    const body = (data.message?.length ?? 0) == 0 ? `${title} was recently added to Plex` : data.message;
    return <NotificationPayload>{
        title: createTitle(profile, 'Recently Added'),
        body: body,
        image: !data.poster_url ? undefined : data.poster_url,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.event_type,
        },
    };
};

/**
 * Construct a NotificationPayload based on a tautulli database corruption event.
 */
export const tautulliDatabaseCorruptionPayload = async (
    data: Models.TautulliDatabaseCorruptionEventType,
    profile: string,
): Promise<NotificationPayload> => {
    const body =
        (data.message?.length ?? 0) == 0
            ? `Tautulli database corruption detected: Automatic cleanup of database backups is suspended`
            : data.message;
    return <NotificationPayload>{
        title: createTitle(profile, 'Tautulli Database Corruption'),
        body: body,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.event_type,
        },
    };
};

/**
 * Construct a NotificationPayload based on a tautulli update available event.
 */
export const tautulliUpdateAvailablePayload = async (
    data: Models.TautulliUpdateAvailableEventType,
    profile: string,
): Promise<NotificationPayload> => {
    const version = data.tautulli_update_version ?? 'Unknown Version';
    const body = (data.message?.length ?? 0) == 0 ? `An update is available for Tautulli (version ${version})` : data.message;
    return <NotificationPayload>{
        title: createTitle(profile, 'Tautulli Update Available'),
        body: body,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.event_type,
        },
    };
};

/**
 * Construct a NotificationPayload based on a transcode decision change event.
 */
export const transcodeDecisionChangePayload = async (
    data: Models.TranscodeDecisionChangeEventType,
    profile: string,
): Promise<NotificationPayload> => {
    const user = data.user ?? 'Unknown User';
    const player = data.player ?? 'Unknown Player';
    const title = data.title ?? 'Unknown Content';
    const body = (data.message?.length ?? 0) == 0 ? `${user} (${player}) has changed transcode decision for ${title}` : data.message;
    return <NotificationPayload>{
        title: createTitle(profile, 'Transcode Decision Changed'),
        body: body,
        image: !data.poster_url ? undefined : data.poster_url,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.event_type,
            user_id: data.user_id ?? '',
            session_id: data.session_id ?? '',
        },
    };
};

/**
 * Construct a NotificationPayload based on a user concurrent streams event.
 */
export const userConcurrentStreamsPayload = async (
    data: Models.UserConcurrentStreamsEventType,
    profile: string,
): Promise<NotificationPayload> => {
    const user = data.user ?? 'Unknown User';
    const streams = data.user_streams ?? '??';
    const body = (data.message?.length ?? 0) == 0 ? `${user} has ${streams} concurrent streams` : data.message;
    return <NotificationPayload>{
        title: createTitle(profile, 'User Concurrent Streams'),
        body: body,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.event_type,
            user_id: data.user_id ?? '',
        },
    };
};

/**
 * Construct a NotificationPayload based on a user concurrent streams event.
 */
export const userNewDevicePayload = async (data: Models.UserNewDeviceEventType, profile: string): Promise<NotificationPayload> => {
    const user = data.user ?? 'Unknown User';
    const player = data.player ?? 'Unknown Player';
    const body = (data.message?.length ?? 0) == 0 ? `${user} is streaming from a new device: ${player}` : data.message;
    return <NotificationPayload>{
        title: createTitle(profile, 'User New Device'),
        body: body,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.event_type,
            user_id: data.user_id ?? '',
        },
    };
};

/**
 * Construct a NotificationPayload based on a watched event.
 */
export const watchedPayload = async (data: Models.WatchedEventType, profile: string): Promise<NotificationPayload> => {
    const user = data.user ?? 'Unknown User';
    const player = data.player ?? 'Unknown Player';
    const title = data.title ?? 'Unknown Content';
    const body = (data.message?.length ?? 0) == 0 ? `${user} (${player}) has watched ${title}` : data.message;
    return <NotificationPayload>{
        title: createTitle(profile, 'Watched'),
        body: body,
        image: !data.poster_url ? undefined : data.poster_url,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.event_type,
            user_id: data.user_id ?? '',
        },
    };
};
