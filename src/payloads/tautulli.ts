import { PlaybackPauseEventType, PlaybackResumeEventType, PlaybackStartEventType, PlaybackStopEventType } from '../models/tautulli';
import { NotificationPayload, payloadTitle } from '../payloads';

const title = (profile: string, body: string): string => payloadTitle('Tautulli', profile, body);
const moduleKey = 'tautulli';

/**
 * Construct a NotificationPayload based on a playback pause event.
 */
export const playbackPausePayload = async (data: PlaybackPauseEventType, profile: string): Promise<NotificationPayload> => {
    const body1 = `${data.title ?? 'Unknown Content'} (${data.quality_profile ?? 'Unknown Quality'})`;
    const body2 = `${data.user ?? 'Unknown User'} on ${data.product ?? 'Unknown Product'}`;
    return <NotificationPayload>{
        title: title(profile, `${data.stream_local === '0' ? 'Remote' : 'Local'} Playback Paused`),
        body: [body1, body2].join('\n'),
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
    const body1 = `${data.title ?? 'Unknown Content'} (${data.quality_profile ?? 'Unknown Quality'})`;
    const body2 = `${data.user ?? 'Unknown User'} on ${data.product ?? 'Unknown Product'}`;
    return <NotificationPayload>{
        title: title(profile, `${data.stream_local === '0' ? 'Remote' : 'Local'} Playback Resumed`),
        body: [body1, body2].join('\n'),
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
    const body1 = `${data.title ?? 'Unknown Content'} (${data.quality_profile ?? 'Unknown Quality'})`;
    const body2 = `${data.user ?? 'Unknown User'} on ${data.product ?? 'Unknown Product'}`;
    return <NotificationPayload>{
        title: title(profile, `${data.stream_local === '0' ? 'Remote' : 'Local'} Playback Started`),
        body: [body1, body2].join('\n'),
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
    const body1 = `${data.title ?? 'Unknown Content'} (${data.quality_profile ?? 'Unknown Quality'})`;
    const body2 = `${data.user ?? 'Unknown User'} on ${data.product ?? 'Unknown Product'}`;
    return <NotificationPayload>{
        title: title(profile, `${data.stream_local === '0' ? 'Remote' : 'Local'} Playback Stopped`),
        body: [body1, body2].join('\n'),
        image: data.poster_url,
        data: {
            module: moduleKey,
            profile: profile,
            event: data.event_type,
            user_id: data.user_id,
        },
    };
};
