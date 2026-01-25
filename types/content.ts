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
    numberOfEpisodes?: number;
    watchedEpisodes?: number;
    completed?: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}
