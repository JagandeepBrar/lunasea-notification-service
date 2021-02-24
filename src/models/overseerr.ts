/**
 * Namespace to contain all Overseerr-related models (interfaces, enums, etc).
 */
export namespace Models {
    /**
     * All possible notification types for the webhook
     */
    export enum NotificationType {
        MEDIA_APPROVED = 'MEDIA_APPROVED',
        MEDIA_AVAILABLE = 'MEDIA_AVAILABLE',
        MEDIA_DECLINED = 'MEDIA_DECLINED',
        MEDIA_FAILED = 'MEDIA_FAILED',
        MEDIA_PENDING = 'MEDIA_PENDING',
        TEST_NOTIFICATION = 'TEST_NOTIFICATION',
    }

    /**
     * All possible media types
     */
    export enum MediaType {
        MOVIE = 'movie',
        TV_SHOW = 'tv',
    }

    /**
     * Request object containing the request details
     */
    export interface RequestProperties {
        notification_type: NotificationType;
        subject: string;
        message: string;
        image: string;
        email: string;
        username: string;
        avatar: string;
        media?: MediaProperties;
    }

    /**
     * Media object containing the media details
     */
    export interface MediaProperties {
        media_type: MediaType;
        tmdbId: string;
        imdbId: string;
        tvdbId: string;
        status: string;
        status4k: string;
    }
}
