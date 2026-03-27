"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { WatchingState, ContentType, ISeason } from "@/types/content";
import ImageUpload from "./ImageUpload";

interface CardProps {
    id: string;
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
    seasons?: ISeason[];
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
            return "bg-[#3A0CA3]";
        case ContentType.SERIES:
            return "bg-[#3A0CA3]";
        case ContentType.ANIME:
            return "bg-[#3A0CA3]";
        case ContentType.TV_SHOW:
            return "bg-[#3A0CA3]";
        default:
            return "bg-slate-800";
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
    id,
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
    seasons = [],
    completed = false,
}: CardProps) {
    const router = useRouter();
    const isMovie = type === ContentType.MOVIE;

    // Aggregations from seasons
    const totalEpisodes = seasons?.reduce((sum, s) => sum + s.numberOfEpisodes, 0) || 0;
    const totalWatched = seasons?.reduce((sum, s) => sum + s.watchedEpisodes, 0) || 0;

    // Auto-derive watching state for series/anime/TV based on episode progress
    let autoState = watchingState;
    if (!isMovie) {
        if (totalEpisodes > 0 && totalWatched >= totalEpisodes) {
            autoState = WatchingState.WATCHED;
        } else if (totalWatched > 0) {
            autoState = WatchingState.WATCHING;
        } else {
            autoState = WatchingState.PENDING;
        }
    }

    const displayState = autoState || WatchingState.PENDING;
    const watchingStyle = getWatchingStateStyle(displayState);

    // Edit modal state
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Edit form state
    const [editTitle, setEditTitle] = useState(title);
    const [editPosterImage, setEditPosterImage] = useState(posterImage);
    const [editGenres, setEditGenres] = useState(genres.join(", "));
    const [editCast, setEditCast] = useState(cast.join(", "));
    const [editLanguage, setEditLanguage] = useState(originalLanguage);
    const [editCountry, setEditCountry] = useState(countryOfOrigin);
    const [editWatchingState, setEditWatchingState] = useState(watchingState);
    const [editReleaseDate, setEditReleaseDate] = useState(releaseDate ? releaseDate.split("T")[0] : "");
    const [editRuntime, setEditRuntime] = useState(runtime?.toString() || "");
    const [editSeasonsList, setEditSeasonsList] = useState<ISeason[]>(seasons || []);

    const addSeason = () => {
        setEditSeasonsList(prev => [
            ...prev,
            { seasonNumber: prev.length + 1, name: "", numberOfEpisodes: 1, watchedEpisodes: 0 }
        ]);
    };

    const removeSeason = () => {
        setEditSeasonsList(prev => prev.slice(0, -1));
    };

    // Sync state when props change (e.g. after a router.refresh() following an edit)
    useEffect(() => {
        setEditTitle(title);
        setEditPosterImage(posterImage);
        setEditGenres(genres.join(", "));
        setEditCast(cast.join(", "));
        setEditLanguage(originalLanguage);
        setEditCountry(countryOfOrigin);
        setEditWatchingState(watchingState);
        setEditReleaseDate(releaseDate ? releaseDate.split("T")[0] : "");
        setEditRuntime(runtime?.toString() || "");
        setEditSeasonsList(seasons || []);
    }, [
        title, posterImage, originalLanguage,
        countryOfOrigin, watchingState, releaseDate, runtime,
        numberOfSeasons,
        JSON.stringify(genres),
        JSON.stringify(cast),
        JSON.stringify(seasons)
    ]);

    const handleEdit = async () => {
        try {
            setLoading(true);
            setError("");

            const payload: any = {
                title: editTitle,
                posterImage: editPosterImage,
                genres: editGenres.split(",").map(g => g.trim()).filter(Boolean),
                cast: editCast.split(",").map(c => c.trim()).filter(Boolean),
                originalLanguage: editLanguage,
                countryOfOrigin: editCountry,
                watchingState: editWatchingState,
            };

            if (isMovie) {
                payload.releaseDate = editReleaseDate;
                payload.runtime = Number(editRuntime);
            } else {
                const totalEp = editSeasonsList.reduce((acc, s) => acc + s.numberOfEpisodes, 0);
                const watchedEp = editSeasonsList.reduce((acc, s) => acc + s.watchedEpisodes, 0);
                payload.numberOfSeasons = editSeasonsList.length;
                payload.seasons = editSeasonsList.map(season => {
                    const s = season as any;
                    return {
                        ...season,
                        name: (s.name && s.name.trim() !== "") ? s.name.trim() : ""
                    };
                });
                payload.completed = totalEp > 0 && watchedEp >= totalEp;
                // Auto-derive watching state based on progress
                payload.watchingState = (totalEp > 0 && watchedEp >= totalEp)
                    ? "watched"
                    : watchedEp > 0
                        ? "watching"
                        : "pending";
            }

            const res = await fetch(`/api/movies/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to update content");
            }

            setEditOpen(false);
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/movies/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete content.");
            setDeleteOpen(false);
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    // Find current active season
    const activeSeason = seasons?.find(s => s.watchedEpisodes < s.numberOfEpisodes) || seasons?.[seasons.length - 1];

    // Calculate progress for series/anime/tv shows based on total watched episode / total no of episodes
    const progress = totalEpisodes > 0 ? Math.round((totalWatched / totalEpisodes) * 100) : 0;

    return (
        <>
            <div className="group relative overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/5 transition-all duration-300 hover:bg-[#111111] hover:shadow-2xl hover:shadow-[#3A0CA3]/20 hover:-translate-y-1">
                {/* Poster Image */}
                <div className="relative h-72 w-full overflow-hidden bg-[#050505]">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />

                    {/* Type Badge */}
                    <div className={`absolute top-3 left-3 rounded-full ${getTypeBadgeColor(type)} px-3 py-1 text-xs font-bold text-white shadow-lg`}>
                        {formatTypeLabel(type)}
                    </div>

                    {/* Watching State Badge */}
                    <div className={`absolute top-3 right-3 rounded-full ${watchingStyle.bg} ${watchingStyle.text} px-3 py-1 text-xs font-bold backdrop-blur-sm`}>
                        {displayState.charAt(0).toUpperCase() + displayState.slice(1)}
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
                                className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-300"
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
                                    <span>
                                        {activeSeason
                                            ? `${activeSeason.seasonNumber ? `S${activeSeason.seasonNumber}` : activeSeason.name} • Ep ${activeSeason.watchedEpisodes}/${activeSeason.numberOfEpisodes}`
                                            : `${totalEpisodes} Episodes`}
                                    </span>
                                </div>
                            </div>

                            {/* Progress Bar & Current Season String */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Progress: {totalWatched}/{totalEpisodes}</span>
                                    <span>{completed ? "✅ Completed" : `${progress}%`}</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-300 ${completed ? "bg-[#008000]" : "bg-[#f01e2c]"}`}
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
                    <button
                        onClick={() => setEditOpen(true)}
                        className="flex-1 rounded-lg bg-[#3A0CA3]/20 px-3 py-2 text-xs font-medium text-[#3A0CA3] transition-colors hover:bg-[#3A0CA3] hover:text-white"
                    >
                        ✏️ Edit
                    </button>
                    <button
                        onClick={() => setDeleteOpen(true)}
                        className="flex-1 rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20 hover:text-white"
                    >
                        🗑️ Delete
                    </button>
                </div>
            </div>

            {/* Edit Modal */}
            {editOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                    onClick={() => setEditOpen(false)}
                >
                    <div
                        className="relative mx-4 w-full max-w-lg animate-[slideUp_0.3s_ease-out] rounded-3xl border border-white/10 bg-[#0a0a0a]/95 p-8 shadow-2xl backdrop-blur-xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Decorative gradient */}
                        <div className="absolute -top-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-[#3A0CA3] to-transparent" />

                        {/* Close Button */}
                        <button
                            onClick={() => setEditOpen(false)}
                            className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition-all duration-200 hover:bg-white/10 hover:text-white hover:rotate-90"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Header */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-white">Edit Content</h2>
                            <p className="mt-1 text-sm text-slate-400">Update the details of your content</p>
                            {error && (
                                <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg">
                                    {error}
                                </div>
                            )}
                        </div>

                        {/* Form */}
                        <div className="space-y-4">
                            {/* Common Fields */}
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-[#3A0CA3]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#3A0CA3]/20"
                                />
                                <ImageUpload
                                    value={editPosterImage}
                                    onChange={(url) => setEditPosterImage(url)}
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        placeholder="Genres (comma separated)"
                                        value={editGenres}
                                        onChange={(e) => setEditGenres(e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-[#3A0CA3]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#3A0CA3]/20"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Cast (comma separated)"
                                        value={editCast}
                                        onChange={(e) => setEditCast(e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-[#3A0CA3]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#3A0CA3]/20"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        placeholder="Original Language"
                                        value={editLanguage}
                                        onChange={(e) => setEditLanguage(e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-[#3A0CA3]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#3A0CA3]/20"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Country of Origin"
                                        value={editCountry}
                                        onChange={(e) => setEditCountry(e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-[#3A0CA3]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#3A0CA3]/20"
                                    />
                                </div>
                            </div>

                            {/* Movie-specific Fields */}
                            {isMovie && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="relative">
                                        <label className="absolute -top-2 left-3 bg-slate-900 px-1 text-xs text-slate-400">
                                            Release Date
                                        </label>
                                        <input
                                            type="date"
                                            value={editReleaseDate}
                                            onChange={(e) => setEditReleaseDate(e.target.value)}
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all duration-200 focus:border-[#3A0CA3]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#3A0CA3]/20"
                                        />
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="Runtime (minutes)"
                                        value={editRuntime}
                                        onChange={(e) => setEditRuntime(e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-[#3A0CA3]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#3A0CA3]/20"
                                    />
                                </div>
                            )}

                            {/* Series/Anime/TV Fields */}
                            {!isMovie && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                                        <div>
                                            <h4 className="text-white font-medium">Seasons ({editSeasonsList.length})</h4>
                                            <p className="text-xs text-slate-400">Add or remove seasons manually</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={removeSeason}
                                                disabled={editSeasonsList.length === 0}
                                                className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                title="Remove Last Season"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={addSeason}
                                                className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                                                title="Add Season"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                            </button>
                                        </div>
                                    </div>

                                    {editSeasonsList.length > 0 && (
                                        <div className="space-y-3 pl-4 border-l-2 border-white/5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                            {editSeasonsList.map((season, idx) => (
                                                <div key={`edit-season-${idx}`} className={`grid gap-3 items-center bg-white/5 p-3 rounded-xl border border-white/5 ${type === "anime" ? "grid-cols-2" : "grid-cols-2"}`}>
                                                    <span className="col-span-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Season {season.seasonNumber}</span>

                                                    {type === "anime" && (
                                                        <div className="col-span-2 relative mb-2">
                                                            <label className="text-[10px] text-slate-500 absolute -top-2 left-2 bg-[#1a1f2e] px-1 rounded">Name</label>
                                                            <input
                                                                type="text"
                                                                placeholder="e.g. Final Season Part 1"
                                                                value={(season as any).name || ""}
                                                                onChange={(e) => {
                                                                    const newList = [...editSeasonsList];
                                                                    (newList[idx] as any).name = e.target.value;
                                                                    setEditSeasonsList(newList);
                                                                }}
                                                                className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none transition-all duration-200 focus:border-[#3A0CA3]/50 focus:ring-1 focus:ring-[#3A0CA3]/20"
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="relative">
                                                        <label className="text-[10px] text-slate-500 absolute -top-2 left-2 bg-[#1a1f2e] px-1 rounded">Total Eps</label>
                                                        <input
                                                            type="number"
                                                            value={season.numberOfEpisodes || ""}
                                                            onChange={(e) => {
                                                                const val = parseInt(e.target.value, 10);
                                                                const newList = [...editSeasonsList];
                                                                newList[idx].numberOfEpisodes = isNaN(val) ? 0 : val;
                                                                setEditSeasonsList(newList);
                                                            }}
                                                            className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none transition-all duration-200 focus:border-[#3A0CA3]/50 focus:ring-1 focus:ring-[#3A0CA3]/20"
                                                        />
                                                    </div>
                                                    <div className="relative">
                                                        <label className="text-[10px] text-slate-500 absolute -top-2 left-2 bg-[#1a1f2e] px-1 rounded">Watched Eps</label>
                                                        <input
                                                            type="number"
                                                            value={season.watchedEpisodes || ""}
                                                            onChange={(e) => {
                                                                const val = parseInt(e.target.value, 10);
                                                                const newList = [...editSeasonsList];
                                                                newList[idx].watchedEpisodes = isNaN(val) ? 0 : val;
                                                                setEditSeasonsList(newList);
                                                            }}
                                                            className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none transition-all duration-200 focus:border-[#3A0CA3]/50 focus:ring-1 focus:ring-[#3A0CA3]/20"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Watching State */}
                            <select
                                value={editWatchingState}
                                onChange={(e) => setEditWatchingState(e.target.value as WatchingState)}
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all duration-200 focus:border-[#3A0CA3]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#3A0CA3]/20 appearance-none cursor-pointer"
                            >
                                <option value="pending" className="bg-slate-900">Pending</option>
                                <option value="watching" className="bg-slate-900">Watching</option>
                                <option value="watched" className="bg-slate-900">Watched</option>
                            </select>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex justify-end gap-3">
                            <button
                                onClick={() => setEditOpen(false)}
                                className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 font-medium text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEdit}
                                disabled={loading}
                                className="rounded-xl bg-[#3A0CA3] px-6 py-2.5 font-semibold text-white shadow-lg shadow-[#3A0CA3]/25 transition-all duration-200 hover:shadow-xl hover:shadow-[#3A0CA3]/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
            {/* Delete Confirmation Modal */}
            {deleteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => !loading && setDeleteOpen(false)}
                    />

                    <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-[#0a0a0a] p-6 shadow-2xl border border-white/5 animate-[scaleIn_0.2s_ease-out]">
                        <div className="text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mb-4">
                                <span className="text-3xl">🗑️</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Delete Content</h3>
                            <p className="text-slate-400 text-sm mb-6">
                                Are you sure you want to delete <span className="text-white font-medium">"{title}"</span>? This action cannot be undone.
                            </p>

                            {error && (
                                <div className="mb-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteOpen(false)}
                                    disabled={loading}
                                    className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="flex-1 rounded-xl bg-red-500 py-3 font-medium text-white transition-all hover:bg-red-600 focus:ring-4 focus:ring-red-500/30 disabled:opacity-50 flex justify-center items-center"
                                >
                                    {loading ? (
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    ) : (
                                        "Delete"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
