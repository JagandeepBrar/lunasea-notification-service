export enum EventType {
    BufferWarning = 'BufferWarning',
    PlaybackError = 'PlaybackError',
    PlaybackPause = 'PlaybackPause',
    PlaybackResume = 'PlaybackResume',
    PlaybackStart = 'PlaybackStart',
    PlaybackStop = 'PlaybackStop',
    PlexRemoteAccessBackUp = 'PlexRemoteAccessBackUp',
    PlexRemoteAccessDown = 'PlexRemoteAccessDown',
    PlexServerBackUp = 'PlexServerBackUp',
    PlexServerDown = 'PlexServerDown',
    PlexUpdateAvailable = 'PlexUpdateAvailable',
    RecentlyAdded = 'RecentlyAdded',
    TautulliDatabaseCorruption = 'TautulliDatabaseCorruption',
    TautulliUpdateAvailable = 'TautulliUpdateAvailable',
    TranscodeDecisionChange = 'TranscodeDecisionChange',
    UserConcurrentStreams = 'UserConcurrentStreams',
    UserNewDevice = 'UserNewDevice',
    Watched = 'Watched',
}

export enum MediaType {
    Movie = 'movie',
    Series = 'show',
    Season = 'season',
    Episode = 'episode',
    Artist = 'artist',
    Album = 'album',
    Track = 'track',
    Clip = 'clip',
}

export interface BufferWarningEventType {
    event_type?: EventType;
    user?: string;
    user_id?: string;
    player?: string;
    title?: string;
    poster_url?: string;
    session_id?: string;
    message?: string;
}

export interface PlaybackErrorEventType {
    event_type?: EventType;
    user?: string;
    user_id?: string;
    player?: string;
    title?: string;
    poster_url?: string;
    message?: string;
}

export interface PlaybackPauseEventType {
    event_type?: EventType;
    user?: string;
    user_id?: string;
    player?: string;
    title?: string;
    poster_url?: string;
    session_id?: string;
    message?: string;
}

export interface PlaybackResumeEventType {
    event_type?: EventType;
    user?: string;
    user_id?: string;
    player?: string;
    title?: string;
    poster_url?: string;
    session_id?: string;
    message?: string;
}

export interface PlaybackStartEventType {
    event_type?: EventType;
    user?: string;
    user_id?: string;
    player?: string;
    title?: string;
    poster_url?: string;
    session_id?: string;
    message?: string;
}

export interface PlaybackStopEventType {
    event_type?: EventType;
    user?: string;
    user_id?: string;
    player?: string;
    title?: string;
    poster_url?: string;
    message?: string;
}

export interface PlexRemoteAccessBackUpEventType {
    event_type?: EventType;
    message?: string;
}

export interface PlexRemoteAccessDownEventType {
    event_type?: EventType;
    remote_access_reason?: string;
    message?: string;
}

export interface PlexServerDownEventType {
    event_type?: EventType;
    message?: string;
}

export interface PlexServerBackUpEventType {
    event_type?: EventType;
    message?: string;
}

export interface PlexUpdateAvailableEventType {
    event_type?: EventType;
    update_version?: string;
    message?: string;
}

export interface RecentlyAddedEventType {
    event_type?: EventType;
    title?: string;
    poster_url?: string;
    message?: string;
}

export interface TautulliUpdateAvailableEventType {
    event_type?: EventType;
    tautulli_update_version?: string;
    message?: string;
}

export interface TautulliDatabaseCorruptionEventType {
    event_type?: EventType;
    message?: string;
}

export interface TranscodeDecisionChangeEventType {
    event_type?: EventType;
    user?: string;
    user_id?: string;
    player?: string;
    title?: string;
    poster_url?: string;
    session_id?: string;
    message?: string;
}

export interface UserConcurrentStreamsEventType {
    event_type?: EventType;
    user?: string;
    user_id?: string;
    user_streams?: string;
    message?: string;
}

export interface UserNewDeviceEventType {
    event_type?: EventType;
    user?: string;
    user_id?: string;
    player?: string;
    message?: string;
}

export interface WatchedEventType {
    event_type?: EventType;
    user?: string;
    user_id?: string;
    player?: string;
    title?: string;
    poster_url?: string;
    message?: string;
}
