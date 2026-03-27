"use client";

import { useState } from "react";
import Header from "../utilities/Header";
import ContentGrid from "../utilities/ContentGrid";
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

export default function DashboardClient({ contentList }: { contentList: ContentItem[] }) {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <>
            <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            <ContentGrid contentList={contentList} searchQuery={searchQuery} />
        </>
    );
}
