"use client";

import Image from "next/image";
import { WatchingState, ContentType } from "@/types/content";

interface CardProps {
    title: string;
    posterImage: string;
    genres: string[];
    cast: string[];
    originalLanguage: string;
    countryOfOrigin: string;
    watchingState: WatchingState;
    type: ContentType;

    // Movie-specific fields
    releaseDate?: string;
    runtime?: number;

    // Series/Anime/TV Show specific fields
    numberOfSeasons?: number | null;
    numberOfEpisodes?: number | null;
    watchedEpisodes?: number;
    completed?: boolean;
}

// Helper function to format runtime
function formatRuntime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

// Helper function to get watching state color
function getWatchingStateStyle(state: WatchingState): { bg: string; text: string } {
    switch (state) {
        case WatchingState.WATCHED:
            return { bg: "bg-green-500/20", text: "text-green-400" };
        case WatchingState.WATCHING:
            return { bg: "bg-blue-500/20", text: "text-blue-400" };
        case WatchingState.PENDING:
        default:
            return { bg: "bg-yellow-500/20", text: "text-yellow-400" };
    }
}

// Helper function to get type badge color
function getTypeBadgeColor(type: ContentType): string {
    switch (type) {
        case ContentType.MOVIE:
            return "bg-purple-500";
        case ContentType.SERIES:
            return "bg-blue-500";
        case ContentType.ANIME:
            return "bg-pink-500";
        case ContentType.TV_SHOW:
            return "bg-teal-500";
        default:
            return "bg-slate-500";
    }
}

// Helper function to format type label
function formatTypeLabel(type: ContentType): string {
    switch (type) {
        case ContentType.MOVIE:
            return "Movie";
        case ContentType.SERIES:
            return "Series";
        case ContentType.ANIME:
            return "Anime";
        case ContentType.TV_SHOW:
            return "TV Show";
        default:
            return type;
    }
}

export default function Card({
    title,
    posterImage,
    genres,
    cast,
    originalLanguage,
    countryOfOrigin,
    watchingState,
    type,
    releaseDate,
    runtime,
    numberOfSeasons,
    numberOfEpisodes,
    watchedEpisodes = 0,
    completed = false,
}: CardProps) {
    const isMovie = type === ContentType.MOVIE;
    const watchingStyle = getWatchingStateStyle(watchingState);

    // Calculate progress for series/anime/tv shows
    const progress = numberOfEpisodes ? Math.round((watchedEpisodes / numberOfEpisodes) * 100) : 0;

    return (
        <div className="group relative overflow-hidden rounded-2xl bg-slate-900/40 border border-slate-800/50 transition-all duration-300 hover:bg-slate-800/60 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1">
            {/* Poster Image */}
            <div className="relative h-72 w-full overflow-hidden bg-slate-800">
                {posterImage ? (
                    <Image
                        src={posterImage}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-600">
                        <span className="text-6xl">🎬</span>
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                {/* Type Badge */}
                <div className={`absolute top-3 left-3 rounded-full ${getTypeBadgeColor(type)} px-3 py-1 text-xs font-bold text-white shadow-lg`}>
                    {formatTypeLabel(type)}
                </div>

                {/* Watching State Badge */}
                <div className={`absolute top-3 right-3 rounded-full ${watchingStyle.bg} ${watchingStyle.text} px-3 py-1 text-xs font-bold backdrop-blur-sm`}>
                    {watchingState.charAt(0).toUpperCase() + watchingState.slice(1)}
                </div>

                {/* Title on Image */}
                <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-xl font-bold text-white drop-shadow-lg line-clamp-2">
                        {title}
                    </h3>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Genres */}
                <div className="flex flex-wrap gap-1 mb-3">
                    {genres.slice(0, 3).map((genre, index) => (
                        <span
                            key={index}
                            className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300"
                        >
                            {genre}
                        </span>
                    ))}
                </div>

                {/* Type-specific info */}
                {isMovie ? (
                    // Movie-specific display
                    <div className="space-y-2 text-sm text-slate-400">
                        {releaseDate && (
                            <div className="flex items-center gap-2">
                                <span className="text-slate-500">📅</span>
                                <span>{new Date(releaseDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                            </div>
                        )}
                        {runtime && (
                            <div className="flex items-center gap-2">
                                <span className="text-slate-500">⏱️</span>
                                <span>{formatRuntime(runtime)}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    // Series/Anime/TV Show specific display
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-slate-400">
                            <div className="flex items-center gap-2">
                                <span className="text-slate-500">📺</span>
                                <span>{numberOfSeasons} Season{numberOfSeasons !== 1 ? "s" : ""}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-500">🎬</span>
                                <span>{numberOfEpisodes} Episodes</span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>Progress: {watchedEpisodes}/{numberOfEpisodes}</span>
                                <span>{completed ? "✅ Completed" : `${progress}%`}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-300 ${completed ? "bg-green-500" : "bg-orange-500"}`}
                                    style={{ width: `${completed ? 100 : progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Language & Country */}
                <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                    <span>🌐 {originalLanguage}</span>
                    <span>•</span>
                    <span>📍 {countryOfOrigin}</span>
                </div>

                {/* Cast */}
                {cast.length > 0 && (
                    <p className="mt-2 text-xs text-slate-500 truncate">
                        🎭 {cast.slice(0, 3).join(", ")}
                    </p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="px-4 pb-4 flex items-center gap-2">
                <button className="flex-1 rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white">
                    Details
                </button>
                <button className="flex-1 rounded-lg bg-orange-500 px-3 py-2 text-xs font-medium text-black transition-colors hover:bg-orange-400">
                    {isMovie ? "Watch" : "Continue"}
                </button>
            </div>
        </div>
    );
}
