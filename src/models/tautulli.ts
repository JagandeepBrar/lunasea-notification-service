export enum EventType {
    PlaybackError = 'PlaybackError',
    PlaybackStart = 'PlaybackStart',
    PlaybackStop = 'PlaybackStop',
    PlaybackPause = 'PlaybackPause',
    PlaybackResume = 'PlaybackResume',
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
    media_type?: MediaType;
    user?: string;
    user_id?: string;
    product?: string;
    title?: string;
    poster_url?: string;
    stream_local?: string;
    quality_profile?: string;
}

export interface PlaybackPauseEventType {
    event_type?: EventType;
    media_type?: MediaType;
    user?: string;
    user_id?: string;
    product?: string;
    title?: string;
    poster_url?: string;
    stream_local?: string;
    quality_profile?: string;
    session_id?: string;
}

export interface PlaybackResumeEventType {
    event_type?: EventType;
    media_type?: MediaType;
    user?: string;
    user_id?: string;
    product?: string;
    title?: string;
    poster_url?: string;
    stream_local?: string;
    quality_profile?: string;
    session_id?: string;
}

export interface PlaybackStartEventType {
    event_type?: EventType;
    media_type?: MediaType;
    user?: string;
    user_id?: string;
    product?: string;
    title?: string;
    poster_url?: string;
    stream_local?: string;
    quality_profile?: string;
    session_id?: string;
}

export interface PlaybackStopEventType {
    event_type?: EventType;
    media_type?: MediaType;
    user?: string;
    user_id?: string;
    product?: string;
    title?: string;
    poster_url?: string;
    stream_local?: string;
    quality_profile?: string;
}
