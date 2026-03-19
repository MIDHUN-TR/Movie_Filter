// Enum types for watching state and content type
export enum WatchingState {
    WATCHED = "watched",
    PENDING = "pending",
    WATCHING = "watching",
}

export enum ContentType {
    MOVIE = "movie",
    SERIES = "series",
    ANIME = "anime",
    TV_SHOW = "tv",
}

// Interface for per-season episode tracking
export interface ISeason {
    seasonNumber: number;
    name?: string;
    numberOfEpisodes: number;
    watchedEpisodes: number;
}

// TypeScript interface for Content (without mongoose Document)
export interface IContentBase {
    title: string;
    posterImage: string;
    genres: string[];
    cast: string[];
    originalLanguage: string;
    countryOfOrigin: string;
    watchingState: WatchingState;
    type: ContentType;

    // Movie-specific fields
    releaseDate?: Date | string;
    runtime?: number;

    // Series/Anime/TV Show specific fields
    numberOfSeasons?: number;
    seasons?: ISeason[];
    completed?: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}
