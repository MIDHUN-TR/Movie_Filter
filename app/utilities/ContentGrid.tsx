"use client";

import { useState } from "react";
import Card from "./Card";
import { ContentType, WatchingState, ISeason } from "@/types/content";

interface ContentItem {
    _id: string;
    title: string;
    posterImage: string;
    genres: string[];
    cast: string[];
    originalLanguage: string;
    countryOfOrigin: string;
    watchingState: WatchingState;
    type: ContentType;
    releaseDate?: string;
    runtime?: number;
    numberOfSeasons?: number;
    seasons?: ISeason[];
    completed?: boolean;
}

type FilterValue =
    | "all"
    | ContentType.MOVIE
    | ContentType.SERIES
    | ContentType.ANIME
    | ContentType.TV_SHOW
    | WatchingState.PENDING
    | WatchingState.WATCHING
    | WatchingState.WATCHED;

interface FilterTab {
    label: string;
    value: FilterValue;
    icon: string;
}

const typeFilters: FilterTab[] = [
    { label: "All", value: "all", icon: "🎯" },
    { label: "Movies", value: ContentType.MOVIE, icon: "🎬" },
    { label: "Series", value: ContentType.SERIES, icon: "📺" },
    { label: "Anime", value: ContentType.ANIME, icon: "⚔️" },
    { label: "TV Shows", value: ContentType.TV_SHOW, icon: "📡" },
];

const stateFilters: FilterTab[] = [
    { label: "Pending", value: WatchingState.PENDING, icon: "⏳" },
    { label: "Watching", value: WatchingState.WATCHING, icon: "👀" },
    { label: "Watched", value: WatchingState.WATCHED, icon: "✅" },
];

export default function ContentGrid({ contentList, searchQuery = "" }: { contentList: ContentItem[]; searchQuery?: string }) {
    const [activeFilter, setActiveFilter] = useState<FilterValue>("all");

    const filteredList = contentList
        // Search filter — match against title, genres, and cast
        .filter((item) => {
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase().trim();
            return (
                item.title.toLowerCase().includes(q) ||
                item.genres.some((g) => g.toLowerCase().includes(q)) ||
                item.cast.some((c) => c.toLowerCase().includes(q))
            );
        })
        // Type / watching-state filter
        .filter((item) => {
        if (activeFilter === "all") return true;

        // Check if filter matches a content type
        if (Object.values(ContentType).includes(activeFilter as ContentType)) {
            return item.type === activeFilter;
        }

        // Check if filter matches a watching state
        if (Object.values(WatchingState).includes(activeFilter as WatchingState)) {
            // For series/anime/tv, auto-derive watching state from episode progress
            if (item.type !== ContentType.MOVIE && item.seasons && item.seasons.length > 0) {
                const totalEpisodes = item.seasons.reduce((sum, s) => sum + s.numberOfEpisodes, 0);
                const totalWatched = item.seasons.reduce((sum, s) => sum + s.watchedEpisodes, 0);
                let derivedState: WatchingState;
                if (totalEpisodes > 0 && totalWatched >= totalEpisodes) {
                    derivedState = WatchingState.WATCHED;
                } else if (totalWatched > 0) {
                    derivedState = WatchingState.WATCHING;
                } else {
                    derivedState = WatchingState.PENDING;
                }
                return derivedState === activeFilter;
            }
            return item.watchingState === activeFilter;
        }

        return true;
    });

    const FilterButton = ({ tab }: { tab: FilterTab }) => (
        <button
            onClick={() => setActiveFilter(tab.value)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap ${activeFilter === tab.value
                    ? "bg-[#3A0CA3] text-white shadow-lg shadow-[#3A0CA3]/25"
                    : "bg-white/5 text-slate-400 hover:bg-[#3A0CA3]/20 hover:text-white border border-white/5"
                }`}
        >
            <span className="text-sm">{tab.icon}</span>
            {tab.label}
        </button>
    );

    return (
        <div className="mt-12">
            <div className="flex flex-col gap-4 mb-8">
                <h2 className="text-2xl font-bold text-white px-2 border-l-4 border-[#3A0CA3]">
                    My Watchlist
                </h2>

                {/* Filter Tabs */}
                <div className="flex flex-col gap-3">
                    {/* Type Filters */}
                    <div className="flex flex-wrap gap-2">
                        {typeFilters.map((tab) => (
                            <FilterButton key={tab.value} tab={tab} />
                        ))}

                        {/* Divider */}
                        <div className="hidden sm:block w-px bg-white/10 mx-1" />

                        {/* State Filters */}
                        {stateFilters.map((tab) => (
                            <FilterButton key={tab.value} tab={tab} />
                        ))}
                    </div>
                </div>

                {/* Results count */}
                <p className="text-sm text-slate-500">
                    Showing {filteredList.length} of {contentList.length} items
                    {activeFilter !== "all" && (
                        <button
                            onClick={() => setActiveFilter("all")}
                            className="ml-2 text-[#3A0CA3] hover:brightness-125 underline underline-offset-2 transition-colors"
                        >
                            Clear filter
                        </button>
                    )}
                </p>
            </div>

            {/* Content Grid */}
            {filteredList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <span className="text-5xl mb-4">🔍</span>
                    <p className="text-lg font-medium text-slate-300">No content found</p>
                    <p className="text-sm text-slate-500 mt-1">
                        {searchQuery.trim()
                            ? `No results for "${searchQuery.trim()}"`
                            : "Try selecting a different filter"}
                    </p>
                    <button
                        onClick={() => setActiveFilter("all")}
                        className="mt-4 rounded-full bg-[#3A0CA3]/20 px-5 py-2 text-sm text-white hover:bg-[#3A0CA3]/40 transition-colors border border-[#3A0CA3]/30"
                    >
                        Show All
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredList.map((content) => (
                        <Card
                            key={content._id}
                            id={content._id}
                            title={content.title}
                            posterImage={content.posterImage}
                            genres={content.genres}
                            cast={content.cast}
                            originalLanguage={content.originalLanguage}
                            countryOfOrigin={content.countryOfOrigin}
                            watchingState={content.watchingState}
                            type={content.type}
                            releaseDate={content.type === ContentType.MOVIE ? content.releaseDate : undefined}
                            runtime={content.type === ContentType.MOVIE ? content.runtime : undefined}
                            numberOfSeasons={content.type !== ContentType.MOVIE ? content.numberOfSeasons : undefined}
                            seasons={content.type !== ContentType.MOVIE ? content.seasons || [] : undefined}
                            completed={content.type !== ContentType.MOVIE ? content.completed : undefined}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
