/**
 * Namespace to contain all Sonarr-related models (interfaces, enums, etc).
 */
export namespace Models {
    /**
     * All possible event types for the webhook
     */
    export enum EventType {
        Download = 'Download',
        EpisodeFileDelete = 'EpisodeFileDelete',
        Grab = 'Grab',
        Health = 'Health',
        Rename = 'Rename',
        SeriesDelete = 'SeriesDelete',
        Test = 'Test',
    }

    /**
     * All possible series types
     */
    export enum SeriesType {
        Standard = 'standard',
        Anime = 'anime',
        Daily = 'daily',
    }

    /**
     * Series object containing series details for a request
     */
    export interface SeriesProperties {
        id?: number;
        title?: string;
        path?: string;
        type?: SeriesType;
        tvdbId?: number;
        tvMazeId?: number;
        imdbId?: string;
    }

    /**
     * Episode object containing episode details for a request
     */
    export interface EpisodeProperties {
        id?: number;
        episodeNumber?: number;
        seasonNumber?: number;
        title?: string;
        airDate?: string;
        airDateUtc?: string;
    }

    /**
     * Release object containing release details for a request
     */
    export interface ReleaseProperties {
        quality?: string;
        qualityVersion?: number;
        releaseGroup?: string;
        releaseTitle?: string;
        indexer?: string;
        size?: number;
    }

    /**
     * Episode file object containing episode file details for a request
     */
    export interface EpisodeFileProperties {
        id?: number;
        relativePath?: string;
        path?: string;
        quality?: string;
        qualityVersion?: number;
        releaseGroup?: string;
        sceneName?: string;
        size?: number;
    }

    /**
     * Interface for a "Grab" event type
     */
    export interface GrabEventType {
        eventType?: EventType;
        series?: SeriesProperties;
        episodes?: EpisodeProperties[];
        release?: ReleaseProperties;
        downloadClient?: string;
        downloadId?: string;
    }

    /**
     * Interface for a "Download" event type
     */
    export interface DownloadEventType {
        eventType?: EventType;
        series?: SeriesProperties;
        episodes?: EpisodeProperties[];
        episodeFile?: EpisodeFileProperties;
        isUpgrade?: boolean;
        downloadClient?: string;
        downloadId?: string;
    }

    /**
     * Interface for a "Health" event type
     */
    export interface HealthEventType {
        eventType?: EventType;
        level?: string;
        message?: string;
        type?: string;
        wikiUrl?: string;
    }

    /**
     * Interface for a "Rename" event type
     */
    export interface RenameEventType {
        eventType?: EventType;
        series?: SeriesProperties;
    }

    /**
     * Interface for a "Test" event type
     */
    export interface TestEventType {
        eventType?: EventType;
        series?: SeriesProperties;
        episodes?: EpisodeProperties[];
    }

    /**
     * Interface for a "SeriesDelete" event type
     */
    export interface SeriesDeleteEventType {
        eventType?: EventType;
        series?: SeriesProperties;
        deletedFiles?: boolean;
    }

    /**
     * Interface for a "EpisodeFileDelete" event type
     */
    export interface EpisodeFileDeleteEventType {
        eventType?: EventType;
        series?: SeriesProperties;
        episodes?: EpisodeProperties[];
    }
}
