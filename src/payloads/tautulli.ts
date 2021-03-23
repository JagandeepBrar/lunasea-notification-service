import {
    PlaybackErrorEventType,
    PlaybackPauseEventType,
    PlaybackResumeEventType,
    PlaybackStartEventType,
    PlaybackStopEventType,
    TranscodeDecisionChangeEventType,
} from '../models/tautulli';
import { NotificationPayload, payloadTitle } from '../payloads';

const createTitle = (profile: string, body: string): string => payloadTitle('Tautulli', profile, body);
const moduleKey = 'tautulli';

/**
 * Construct a NotificationPayload based on a playback stop event.
 */
export const playbackErrorPayload = async (data: PlaybackErrorEventType, profile: string): Promise<NotificationPayload> => {
    const user = data.user ?? 'Unknown User';
    const player = data.player ?? 'Unknown Player';
    const title = data.title ?? 'Unknown Content';
    const body = (data.message?.length ?? 0) == 0 ? `${user} (${player}) encountered an error trying to play ${title}` : data.message;
    return <NotificationPayload>{
        title: createTitle(profile, 'Playback Error'),
        body: body,
        image: data.poster_url,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.event_type,
            user_id: data.user_id,
        },
    };
};

/**
 * Construct a NotificationPayload based on a playback pause event.
 */
export const playbackPausePayload = async (data: PlaybackPauseEventType, profile: string): Promise<NotificationPayload> => {
    const user = data.user ?? 'Unknown User';
    const player = data.player ?? 'Unknown Player';
    const title = data.title ?? 'Unknown Content';
    const body = (data.message?.length ?? 0) == 0 ? `${user} (${player}) has paused ${title}` : data.message;
    return <NotificationPayload>{
        title: createTitle(profile, 'Playback Paused'),
        body: body,
        image: data.poster_url,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.event_type,
            session_id: data.session_id,
        },
    };
};

/**
 * Construct a NotificationPayload based on a playback resume event.
 */
export const playbackResumePayload = async (data: PlaybackResumeEventType, profile: string): Promise<NotificationPayload> => {
    const user = data.user ?? 'Unknown User';
    const player = data.player ?? 'Unknown Player';
    const title = data.title ?? 'Unknown Content';
    const body = (data.message?.length ?? 0) == 0 ? `${user} (${player}) has resumed ${title}` : data.message;
    return <NotificationPayload>{
        title: createTitle(profile, 'Playback Resumed'),
        body: body,
        image: data.poster_url,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.event_type,
            session_id: data.session_id,
        },
    };
};

/**
 * Construct a NotificationPayload based on a playback start event.
 */
export const playbackStartPayload = async (data: PlaybackStartEventType, profile: string): Promise<NotificationPayload> => {
    const user = data.user ?? 'Unknown User';
    const player = data.player ?? 'Unknown Player';
    const title = data.title ?? 'Unknown Content';
    const body = (data.message?.length ?? 0) == 0 ? `${user} (${player}) started playing ${title}` : data.message;
    return <NotificationPayload>{
        title: createTitle(profile, 'Playback Started'),
        body: body,
        image: data.poster_url,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.event_type,
            session_id: data.session_id,
        },
    };
};

/**
 * Construct a NotificationPayload based on a playback stop event.
 */
export const playbackStopPayload = async (data: PlaybackStopEventType, profile: string): Promise<NotificationPayload> => {
    const user = data.user ?? 'Unknown User';
    const player = data.player ?? 'Unknown Player';
    const title = data.title ?? 'Unknown Content';
    const body = (data.message?.length ?? 0) == 0 ? `${user} (${player}) has stopped ${title}` : data.message;
    return <NotificationPayload>{
        title: createTitle(profile, 'Playback Stopped'),
        body: body,
        image: data.poster_url,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.event_type,
            user_id: data.user_id,
        },
    };
};

/**
 * Construct a NotificationPayload based on a transcode decision change event.
 */
export const transcodeDecisionChangePayload = async (
    data: TranscodeDecisionChangeEventType,
    profile: string,
): Promise<NotificationPayload> => {
    const user = data.user ?? 'Unknown User';
    const player = data.player ?? 'Unknown Player';
    const title = data.title ?? 'Unknown Content';
    const body = (data.message?.length ?? 0) == 0 ? `${user} (${player}) has changed transcode decision for ${title}` : data.message;
    return <NotificationPayload>{
        title: createTitle(profile, 'Transcode Decision Changed'),
        body: body,
        image: data.poster_url,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.event_type,
            user_id: data.user_id,
        },
    };
};
