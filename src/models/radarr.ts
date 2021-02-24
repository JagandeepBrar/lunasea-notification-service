/**
 * Namespace to contain all Radarr-related models (export interfaces, enums, etc).
 */
export namespace Models {
    /**
     * All possible event types for the webhook
     */
    export enum EventType {
        Download = 'Download',
        Grab = 'Grab',
        Health = 'Health',
        Rename = 'Rename',
        Test = 'Test',
    }

    /**
     * Movie object containing movie details for a request
     */
    export interface MovieProperties {
        id: number;
        title: string;
        releaseDate: string;
        folderPath: string;
        tmdbId: number;
        imdbId?: string;
    }

    /**
     * Remote movie object containing remote details for a movie for a request
     */
    export interface RemoteMovieProperties {
        tmdbId: number;
        imdbId?: string;
        title: string;
        year: number;
    }

    /**
     * Release object containing release details for a request
     */
    export interface ReleaseProperties {
        quality: string;
        qualityVersion: number;
        releaseGroup: string;
        releaseTitle: string;
        indexer: string;
        size: number;
    }

    /**
     * Movie file object, containing details on the downloaded movie file for a request
     */
    export interface MovieFileProperties {
        id: number;
        relativePath: string;
        path: string;
        quality: string;
        qualityVersion: number;
        releaseGroup: string;
        sceneName: string;
        size: number;
    }

    /**
     * Interface for a "Download" event type
     */
    export interface DownloadEventType {
        eventType: EventType;
        movie: MovieProperties;
        remoteMovie: RemoteMovieProperties;
        movieFile: MovieFileProperties;
        isUpgrade: boolean;
        downloadId: string;
    }

    /**
     * Interface for a "Grab" event type
     */
    export interface GrabEventType {
        eventType: EventType;
        movie: MovieProperties;
        remoteMovie: RemoteMovieProperties;
        release: ReleaseProperties;
        downloadClient: string;
        downloadId: string;
    }

    /**
     * Interface for a "Health" event type
     */
    export interface HealthEventType {
        eventType: EventType;
        level: string;
        message: string;
        type: string;
        wikiUrl: string;
    }

    /**
     * Interface for a "Rename" event type
     */
    export interface RenameEventType {
        eventType: EventType;
        movie: MovieProperties;
    }

    /**
     * Interface for a "Test" event type
     */
    export interface TestEventType {
        eventType: EventType;
        movie: MovieProperties;
        remoteMovie: RemoteMovieProperties;
        release: ReleaseProperties;
    }
}
