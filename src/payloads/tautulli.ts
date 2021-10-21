import * as Models from '../models/tautulli';
import { NotificationPayload, payloadTitle } from '../payloads';

const createTitle = (profile: string, body: string): string =>
  payloadTitle('Tautulli', profile, body);
const moduleKey = 'tautulli';

/**
 * Construct a NotificationPayload based on a buffer warning event.
 */
export const bufferWarningPayload = async (
  payload: Models.ActionTypePayload,
  profile: string,
): Promise<NotificationPayload> => {
  const user = payload?.data?.user ?? 'Unknown User';
  const player = payload?.data?.player ?? 'Unknown Player';
  const title = payload?.data?.title ?? 'Unknown Content';
  const body = !payload?.data?.message?.length
    ? `${user} (${player}) is buffering ${title}`
    : payload?.data?.message;
  return <NotificationPayload>{
    title: createTitle(profile, 'Buffer Warning'),
    body: body,
    image: !payload?.data?.poster_url ? undefined : payload?.data?.poster_url,
    data: {
      module: moduleKey,
      profile: profile,
      event: Models.EventTypeDeprecated.BufferWarning,
      user_id: String(payload?.data?.user_id ?? ''),
      session_id: payload?.data?.session_id ?? '',
    },
  };
};

/**
 * Construct a NotificationPayload based on a playback error event.
 */
export const playbackErrorPayload = async (
  payload: Models.ActionTypePayload,
  profile: string,
): Promise<NotificationPayload> => {
  const user = payload?.data?.user ?? 'Unknown User';
  const player = payload?.data?.player ?? 'Unknown Player';
  const title = payload?.data?.title ?? 'Unknown Content';
  const body = !payload?.data?.message?.length
    ? `${user} (${player}) encountered an error trying to play ${title}`
    : payload?.data?.message;
  return <NotificationPayload>{
    title: createTitle(profile, 'Playback Error'),
    body: body,
    image: !payload?.data?.poster_url ? undefined : payload?.data?.poster_url,
    data: {
      module: moduleKey,
      profile: profile,
      event: Models.EventTypeDeprecated.PlaybackError,
      user_id: String(payload?.data?.user_id ?? ''),
    },
  };
};

/**
 * Construct a NotificationPayload based on a playback pause event.
 */
export const playbackPausePayload = async (
  payload: Models.ActionTypePayload,
  profile: string,
): Promise<NotificationPayload> => {
  const user = payload?.data?.user ?? 'Unknown User';
  const player = payload?.data?.player ?? 'Unknown Player';
  const title = payload?.data?.title ?? 'Unknown Content';
  const body = !payload?.data?.message?.length
    ? `${user} (${player}) has paused ${title}`
    : payload?.data?.message;
  return <NotificationPayload>{
    title: createTitle(profile, 'Playback Paused'),
    body: body,
    image: !payload?.data?.poster_url ? undefined : payload?.data?.poster_url,
    data: {
      module: moduleKey,
      profile: profile,
      event: Models.EventTypeDeprecated.PlaybackPause,
      user_id: String(payload?.data?.user_id ?? ''),
      session_id: payload?.data?.session_id ?? '',
    },
  };
};

/**
 * Construct a NotificationPayload based on a playback resume event.
 */
export const playbackResumePayload = async (
  payload: Models.ActionTypePayload,
  profile: string,
): Promise<NotificationPayload> => {
  const user = payload?.data?.user ?? 'Unknown User';
  const player = payload?.data?.player ?? 'Unknown Player';
  const title = payload?.data?.title ?? 'Unknown Content';
  const body = !payload?.data?.message?.length
    ? `${user} (${player}) has resumed ${title}`
    : payload?.data?.message;
  return <NotificationPayload>{
    title: createTitle(profile, 'Playback Resumed'),
    body: body,
    image: !payload?.data?.poster_url ? undefined : payload?.data?.poster_url,
    data: {
      module: moduleKey,
      profile: profile,
      event: Models.EventTypeDeprecated.PlaybackResume,
      user_id: String(payload?.data?.user_id ?? ''),
      session_id: payload?.data?.session_id ?? '',
    },
  };
};

/**
 * Construct a NotificationPayload based on a playback start event.
 */
export const playbackStartPayload = async (
  payload: Models.ActionTypePayload,
  profile: string,
): Promise<NotificationPayload> => {
  const user = payload?.data?.user ?? 'Unknown User';
  const player = payload?.data?.player ?? 'Unknown Player';
  const title = payload?.data?.title ?? 'Unknown Content';
  const body = !payload?.data?.message?.length
    ? `${user} (${player}) started playing ${title}`
    : payload?.data?.message;
  return <NotificationPayload>{
    title: createTitle(profile, 'Playback Started'),
    body: body,
    image: !payload?.data?.poster_url ? undefined : payload?.data?.poster_url,
    data: {
      module: moduleKey,
      profile: profile,
      event: Models.EventTypeDeprecated.PlaybackStart,
      user_id: String(payload?.data?.user_id ?? ''),
      session_id: payload?.data?.session_id ?? '',
    },
  };
};

/**
 * Construct a NotificationPayload based on a playback stop event.
 */
export const playbackStopPayload = async (
  payload: Models.ActionTypePayload,
  profile: string,
): Promise<NotificationPayload> => {
  const user = payload?.data?.user ?? 'Unknown User';
  const player = payload?.data?.player ?? 'Unknown Player';
  const title = payload?.data?.title ?? 'Unknown Content';
  const body = !payload?.data?.message?.length
    ? `${user} (${player}) has stopped ${title}`
    : payload?.data?.message;
  return <NotificationPayload>{
    title: createTitle(profile, 'Playback Stopped'),
    body: body,
    image: !payload?.data?.poster_url ? undefined : payload?.data?.poster_url,
    data: {
      module: moduleKey,
      profile: profile,
      event: Models.EventTypeDeprecated.PlaybackStop,
      user_id: String(payload?.data?.user_id ?? ''),
      session_id: payload?.data?.session_id ?? '',
    },
  };
};

/**
 * Construct a NotificationPayload based on a plex remote access back up event.
 */
export const plexRemoteAccessBackUpPayload = async (
  payload: Models.ActionTypePayload,
  profile: string,
): Promise<NotificationPayload> => {
  const body = !payload?.data?.message?.length
    ? 'The Plex Media Server remote access is back up'
    : payload?.data?.message;
  return <NotificationPayload>{
    title: createTitle(profile, 'Plex Remote Access Back Up'),
    body: body,
    data: {
      module: moduleKey,
      profile: profile,
      event: Models.EventTypeDeprecated.PlexRemoteAccessBackUp,
    },
  };
};

/**
 * Construct a NotificationPayload based on a plex remote access down event.
 */
export const plexRemoteAccessDownPayload = async (
  payload: Models.ActionTypePayload,
  profile: string,
): Promise<NotificationPayload> => {
  const reason = payload?.data?.remote_access_reason ?? 'Unknown Reason';
  const body = !payload?.data?.message?.length
    ? `The Plex Media Server remote access is down (${reason})`
    : payload?.data?.message;
  return <NotificationPayload>{
    title: createTitle(profile, 'Plex Remote Access Down'),
    body: body,
    data: {
      module: moduleKey,
      profile: profile,
      event: Models.EventTypeDeprecated.PlexRemoteAccessDown,
    },
  };
};

/**
 * Construct a NotificationPayload based on a plex server back up event.
 */
export const plexServerBackUpPayload = async (
  payload: Models.ActionTypePayload,
  profile: string,
): Promise<NotificationPayload> => {
  const body = !payload?.data?.message?.length
    ? 'The Plex Media Server is back up'
    : payload?.data?.message;
  return <NotificationPayload>{
    title: createTitle(profile, 'Plex Server Back Up'),
    body: body,
    data: {
      module: moduleKey,
      profile: profile,
      event: Models.EventTypeDeprecated.PlexServerBackUp,
    },
  };
};

/**
 * Construct a NotificationPayload based on a plex server down event.
 */
export const plexServerDownPayload = async (
  payload: Models.ActionTypePayload,
  profile: string,
): Promise<NotificationPayload> => {
  const body = !payload?.data?.message?.length
    ? 'The Plex Media Server is down'
    : payload?.data?.message;
  return <NotificationPayload>{
    title: createTitle(profile, 'Plex Server Down'),
    body: body,
    data: {
      module: moduleKey,
      profile: profile,
      event: Models.EventTypeDeprecated.PlexServerDown,
    },
  };
};

/**
 * Construct a NotificationPayload based on a plex update available event.
 */
export const plexUpdateAvailablePayload = async (
  payload: Models.ActionTypePayload,
  profile: string,
): Promise<NotificationPayload> => {
  const version = payload?.data?.update_version ?? 'Unknown Version';
  const body = !payload?.data?.message?.length
    ? `An update is available for the Plex Media Server (version ${version})`
    : payload?.data?.message;
  return <NotificationPayload>{
    title: createTitle(profile, 'Plex Update Available'),
    body: body,
    data: {
      module: moduleKey,
      profile: profile,
      event: Models.EventTypeDeprecated.PlexUpdateAvailable,
    },
  };
};

/**
 * Construct a NotificationPayload based on a recently added event.
 */
export const recentlyAddedPayload = async (
  payload: Models.ActionTypePayload,
  profile: string,
): Promise<NotificationPayload> => {
  const title = payload?.data?.title ?? 'Unknown Content';
  const body = !payload?.data?.message?.length
    ? `${title} was recently added to Plex`
    : payload?.data?.message;
  return <NotificationPayload>{
    title: createTitle(profile, 'Recently Added'),
    body: body,
    image: !payload?.data?.poster_url ? undefined : payload?.data?.poster_url,
    data: {
      module: moduleKey,
      profile: profile,
      event: Models.EventTypeDeprecated.RecentlyAdded,
    },
  };
};

/**
 * Construct a NotificationPayload based on a tautulli database corruption event.
 */
export const tautulliDatabaseCorruptionPayload = async (
  payload: Models.ActionTypePayload,
  profile: string,
): Promise<NotificationPayload> => {
  const body = !payload?.data?.message?.length
    ? `Tautulli database corruption detected: Automatic cleanup of database backups is suspended`
    : payload?.data?.message;
  return <NotificationPayload>{
    title: createTitle(profile, 'Tautulli Database Corruption'),
    body: body,
    data: {
      module: moduleKey,
      profile: profile,
      event: Models.EventTypeDeprecated.TautulliDatabaseCorruption,
    },
  };
};

/**
 * Construct a NotificationPayload based on a tautulli update available event.
 */
export const tautulliUpdateAvailablePayload = async (
  payload: Models.ActionTypePayload,
  profile: string,
): Promise<NotificationPayload> => {
  const version = payload?.data?.tautulli_update_version ?? 'Unknown Version';
  const body = !payload?.data?.message?.length
    ? `An update is available for Tautulli (version ${version})`
    : payload?.data?.message;
  return <NotificationPayload>{
    title: createTitle(profile, 'Tautulli Update Available'),
    body: body,
    data: {
      module: moduleKey,
      profile: profile,
      event: Models.EventTypeDeprecated.TautulliUpdateAvailable,
    },
  };
};

/**
 * Construct a NotificationPayload based on a test event.
 */
export const testPayload = async (
  payload: Models.ActionTypePayload,
  profile: string,
): Promise<NotificationPayload> => {
  return <NotificationPayload>{
    title: createTitle(profile, 'Connection Test'),
    body: 'LunaSea is ready for Tautulli notifications!',
    image: !payload?.data?.poster_url ? undefined : payload?.data?.poster_url,
    data: {
      module: moduleKey,
      profile: profile,
      event: Models.EventTypeDeprecated.PlaybackStop,
      user_id: 'test',
    },
  };
};

/**
 * Construct a NotificationPayload based on a transcode decision change event.
 */
export const transcodeDecisionChangePayload = async (
  payload: Models.ActionTypePayload,
  profile: string,
): Promise<NotificationPayload> => {
  const user = payload?.data?.user ?? 'Unknown User';
  const player = payload?.data?.player ?? 'Unknown Player';
  const title = payload?.data?.title ?? 'Unknown Content';
  const body = !payload?.data?.message?.length
    ? `${user} (${player}) has changed transcode decision for ${title}`
    : payload?.data?.message;
  return <NotificationPayload>{
    title: createTitle(profile, 'Transcode Decision Changed'),
    body: body,
    image: !payload?.data?.poster_url ? undefined : payload?.data?.poster_url,
    data: {
      module: moduleKey,
      profile: profile,
      event: Models.EventTypeDeprecated.TranscodeDecisionChange,
      user_id: String(payload?.data?.user_id ?? ''),
      session_id: payload?.data?.session_id ?? '',
    },
  };
};

/**
 * Construct a NotificationPayload based on a user concurrent streams event.
 */
export const userConcurrentStreamsPayload = async (
  payload: Models.ActionTypePayload,
  profile: string,
): Promise<NotificationPayload> => {
  const user = payload?.data?.user ?? 'Unknown User';
  const streams = payload?.data?.user_streams ?? '??';
  const body = !payload?.data?.message?.length
    ? `${user} has ${streams} concurrent streams`
    : payload?.data?.message;
  return <NotificationPayload>{
    title: createTitle(profile, 'User Concurrent Streams'),
    body: body,
    data: {
      module: moduleKey,
      profile: profile,
      event: Models.EventTypeDeprecated.UserConcurrentStreams,
      user_id: String(payload?.data?.user_id ?? ''),
    },
  };
};

/**
 * Construct a NotificationPayload based on a user concurrent streams event.
 */
export const userNewDevicePayload = async (
  payload: Models.ActionTypePayload,
  profile: string,
): Promise<NotificationPayload> => {
  const user = payload?.data?.user ?? 'Unknown User';
  const player = payload?.data?.player ?? 'Unknown Player';
  const body = !payload?.data?.message?.length
    ? `${user} is streaming from a new device: ${player}`
    : payload?.data?.message;
  return <NotificationPayload>{
    title: createTitle(profile, 'User New Device'),
    body: body,
    data: {
      module: moduleKey,
      profile: profile,
      event: Models.EventTypeDeprecated.UserNewDevice,
      user_id: String(payload?.data?.user_id ?? ''),
    },
  };
};

/**
 * Construct a NotificationPayload based on a watched event.
 */
export const watchedPayload = async (
  payload: Models.ActionTypePayload,
  profile: string,
): Promise<NotificationPayload> => {
  const user = payload?.data?.user ?? 'Unknown User';
  const player = payload?.data?.player ?? 'Unknown Player';
  const title = payload?.data?.title ?? 'Unknown Content';
  const body = !payload?.data?.message?.length
    ? `${user} (${player}) has watched ${title}`
    : payload?.data?.message;
  return <NotificationPayload>{
    title: createTitle(profile, 'Watched'),
    body: body,
    image: !payload?.data?.poster_url ? undefined : payload?.data?.poster_url,
    data: {
      module: moduleKey,
      profile: profile,
      event: Models.EventTypeDeprecated.Watched,
      user_id: String(payload?.data?.user_id ?? ''),
    },
  };
};

///////////////////////////
/// DEPRECATED PAYLOADS ///
///////////////////////////

/**
 * **DEPRECATED**: Should now use the built-in agent
 * Construct a NotificationPayload based on a buffer warning event.
 */
export const bufferWarningPayloadDeprecated = async (
  data: Models.BufferWarningEventTypeDeprecated,
  profile: string,
): Promise<NotificationPayload> => {
  const user = data.user ?? 'Unknown User';
  const player = data.player ?? 'Unknown Player';
  const title = data.title ?? 'Unknown Content';
  const body =
    (data.message?.length ?? 0) == 0 ? `${user} (${player}) is buffering ${title}` : data.message;
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
 * **DEPRECATED**: Should now use the built-in agent
 * Construct a NotificationPayload based on a playback stop event.
 */
export const playbackErrorPayloadDeprecated = async (
  data: Models.PlaybackErrorEventTypeDeprecated,
  profile: string,
): Promise<NotificationPayload> => {
  const user = data.user ?? 'Unknown User';
  const player = data.player ?? 'Unknown Player';
  const title = data.title ?? 'Unknown Content';
  const body =
    (data.message?.length ?? 0) == 0
      ? `${user} (${player}) encountered an error trying to play ${title}`
      : data.message;
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
 * **DEPRECATED**: Should now use the built-in agent
 * Construct a NotificationPayload based on a playback pause event.
 */
export const playbackPausePayloadDeprecated = async (
  data: Models.PlaybackPauseEventTypeDeprecated,
  profile: string,
): Promise<NotificationPayload> => {
  const user = data.user ?? 'Unknown User';
  const player = data.player ?? 'Unknown Player';
  const title = data.title ?? 'Unknown Content';
  const body =
    (data.message?.length ?? 0) == 0 ? `${user} (${player}) has paused ${title}` : data.message;
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
 * **DEPRECATED**: Should now use the built-in agent
 * Construct a NotificationPayload based on a playback resume event.
 */
export const playbackResumePayloadDeprecated = async (
  data: Models.PlaybackResumeEventTypeDeprecated,
  profile: string,
): Promise<NotificationPayload> => {
  const user = data.user ?? 'Unknown User';
  const player = data.player ?? 'Unknown Player';
  const title = data.title ?? 'Unknown Content';
  const body =
    (data.message?.length ?? 0) == 0 ? `${user} (${player}) has resumed ${title}` : data.message;
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
 * **DEPRECATED**: Should now use the built-in agent
 * Construct a NotificationPayload based on a playback start event.
 */
export const playbackStartPayloadDeprecated = async (
  data: Models.PlaybackStartEventTypeDeprecated,
  profile: string,
): Promise<NotificationPayload> => {
  const user = data.user ?? 'Unknown User';
  const player = data.player ?? 'Unknown Player';
  const title = data.title ?? 'Unknown Content';
  const body =
    (data.message?.length ?? 0) == 0
      ? `${user} (${player}) started playing ${title}`
      : data.message;
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
 * **DEPRECATED**: Should now use the built-in agent
 * Construct a NotificationPayload based on a playback stop event.
 */
export const playbackStopPayloadDeprecated = async (
  data: Models.PlaybackStopEventTypeDeprecated,
  profile: string,
): Promise<NotificationPayload> => {
  const user = data.user ?? 'Unknown User';
  const player = data.player ?? 'Unknown Player';
  const title = data.title ?? 'Unknown Content';
  const body =
    (data.message?.length ?? 0) == 0 ? `${user} (${player}) has stopped ${title}` : data.message;
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
 * **DEPRECATED**: Should now use the built-in agent
 * Construct a NotificationPayload based on a plex remote access back up event.
 */
export const plexRemoteAccessBackUpPayloadDeprecated = async (
  data: Models.PlexRemoteAccessBackUpEventTypeDeprecated,
  profile: string,
): Promise<NotificationPayload> => {
  const body =
    (data.message?.length ?? 0) == 0
      ? 'The Plex Media Server remote access is back up'
      : data.message;
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
 * **DEPRECATED**: Should now use the built-in agent
 * Construct a NotificationPayload based on a plex remote access down event.
 */
export const plexRemoteAccessDownPayloadDeprecated = async (
  data: Models.PlexRemoteAccessDownEventTypeDeprecated,
  profile: string,
): Promise<NotificationPayload> => {
  const reason = data.remote_access_reason ?? 'Unknown Reason';
  const body =
    (data.message?.length ?? 0) == 0
      ? `The Plex Media Server remote access is down (${reason})`
      : data.message;
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
 * **DEPRECATED**: Should now use the built-in agent
 * Construct a NotificationPayload based on a plex server back up event.
 */
export const plexServerBackUpPayloadDeprecated = async (
  data: Models.PlexServerBackUpEventTypeDeprecated,
  profile: string,
): Promise<NotificationPayload> => {
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
 * **DEPRECATED**: Should now use the built-in agent
 * Construct a NotificationPayload based on a plex server down event.
 */
export const plexServerDownPayloadDeprecated = async (
  data: Models.PlexServerDownEventTypeDeprecated,
  profile: string,
): Promise<NotificationPayload> => {
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
 * **DEPRECATED**: Should now use the built-in agent
 * Construct a NotificationPayload based on a plex update available event.
 */
export const plexUpdateAvailablePayloadDeprecated = async (
  data: Models.PlexUpdateAvailableEventTypeDeprecated,
  profile: string,
): Promise<NotificationPayload> => {
  const version = data.update_version ?? 'Unknown Version';
  const body =
    (data.message?.length ?? 0) == 0
      ? `An update is available for the Plex Media Server (version ${version})`
      : data.message;
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
 * **DEPRECATED**: Should now use the built-in agent
 * Construct a NotificationPayload based on a recently added event.
 */
export const recentlyAddedPayloadDeprecated = async (
  data: Models.RecentlyAddedEventTypeDeprecated,
  profile: string,
): Promise<NotificationPayload> => {
  const title = data.title ?? 'Unknown Content';
  const body =
    (data.message?.length ?? 0) == 0 ? `${title} was recently added to Plex` : data.message;
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
 * **DEPRECATED**: Should now use the built-in agent
 * Construct a NotificationPayload based on a tautulli database corruption event.
 */
export const tautulliDatabaseCorruptionPayloadDeprecated = async (
  data: Models.TautulliDatabaseCorruptionEventTypeDeprecated,
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
 * **DEPRECATED**: Should now use the built-in agent
 * Construct a NotificationPayload based on a tautulli update available event.
 */
export const tautulliUpdateAvailablePayloadDeprecated = async (
  data: Models.TautulliUpdateAvailableEventTypeDeprecated,
  profile: string,
): Promise<NotificationPayload> => {
  const version = data.tautulli_update_version ?? 'Unknown Version';
  const body =
    (data.message?.length ?? 0) == 0
      ? `An update is available for Tautulli (version ${version})`
      : data.message;
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
 * **DEPRECATED**: Should now use the built-in agent
 * Construct a NotificationPayload based on a transcode decision change event.
 */
export const transcodeDecisionChangePayloadDeprecated = async (
  data: Models.TranscodeDecisionChangeEventTypeDeprecated,
  profile: string,
): Promise<NotificationPayload> => {
  const user = data.user ?? 'Unknown User';
  const player = data.player ?? 'Unknown Player';
  const title = data.title ?? 'Unknown Content';
  const body =
    (data.message?.length ?? 0) == 0
      ? `${user} (${player}) has changed transcode decision for ${title}`
      : data.message;
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
 * **DEPRECATED**: Should now use the built-in agent
 * Construct a NotificationPayload based on a user concurrent streams event.
 */
export const userConcurrentStreamsPayloadDeprecated = async (
  data: Models.UserConcurrentStreamsEventTypeDeprecated,
  profile: string,
): Promise<NotificationPayload> => {
  const user = data.user ?? 'Unknown User';
  const streams = data.user_streams ?? '??';
  const body =
    (data.message?.length ?? 0) == 0 ? `${user} has ${streams} concurrent streams` : data.message;
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
 * **DEPRECATED**: Should now use the built-in agent
 * Construct a NotificationPayload based on a user concurrent streams event.
 */
export const userNewDevicePayloadDeprecated = async (
  data: Models.UserNewDeviceEventTypeDeprecated,
  profile: string,
): Promise<NotificationPayload> => {
  const user = data.user ?? 'Unknown User';
  const player = data.player ?? 'Unknown Player';
  const body =
    (data.message?.length ?? 0) == 0
      ? `${user} is streaming from a new device: ${player}`
      : data.message;
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
 * **DEPRECATED**: Should now use the built-in agent
 * Construct a NotificationPayload based on a watched event.
 */
export const watchedPayloadDeprecated = async (
  data: Models.WatchedEventTypeDeprecated,
  profile: string,
): Promise<NotificationPayload> => {
  const user = data.user ?? 'Unknown User';
  const player = data.player ?? 'Unknown Player';
  const title = data.title ?? 'Unknown Content';
  const body =
    (data.message?.length ?? 0) == 0 ? `${user} (${player}) has watched ${title}` : data.message;
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
