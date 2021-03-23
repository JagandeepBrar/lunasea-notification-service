export enum EventType {
    BufferWarning = 'BufferWarning',
    PlaybackError = 'PlaybackError',
    PlaybackStart = 'PlaybackStart',
    PlaybackStop = 'PlaybackStop',
    PlaybackPause = 'PlaybackPause',
    PlaybackResume = 'PlaybackResume',
    PlexRemoteAccessDown = 'PlexRemoteAccessDown',
    PlexRemoteAccessBackUp = 'PlexRemoteAccessBackUp',
    PlexServerDown = 'PlexServerDown',
    PlexServerBackUp = 'PlexServerBackUp',
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

export interface WatchedEventType {
    event_type?: EventType;
    user?: string;
    user_id?: string;
    player?: string;
    title?: string;
    poster_url?: string;
    message?: string;
}
