export namespace Models {
    export enum NotificationType {
        MEDIA_APPROVED = 'MEDIA_APPROVED',
        MEDIA_AVAILABLE = 'MEDIA_AVAILABLE',
        MEDIA_DECLINED = 'MEDIA_DECLINED',
        MEDIA_FAILED = 'MEDIA_FAILED',
        MEDIA_PENDING = 'MEDIA_PENDING',
        TEST_NOTIFICATION = 'TEST_NOTIFICATION',
    }

    export enum MediaType {
        MOVIE = 'movie',
        TV_SHOW = 'tv',
    }

    export interface RequestProperties {
        notification_type?: NotificationType;
        subject?: string;
        message?: string;
        image?: string;
        email?: string;
        username?: string;
        avatar?: string;
        media?: MediaProperties;
    }

    export interface MediaProperties {
        media_type?: MediaType;
        tmdbId?: string;
        imdbId?: string;
        tvdbId?: string;
        status?: string;
        status4k?: string;
    }
}
