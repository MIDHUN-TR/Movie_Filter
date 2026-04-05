import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Content from "@/models/movie";
import cloudinary from "@/lib/cloudinary";

interface SeasonPayload {
    seasonNumber: number;
    name?: string;
    numberOfEpisodes: number;
    watchedEpisodes: number;
}

interface ImportItem {
    title: string;
    type: string;
    posterImage: string;
    genres: string[];
    cast: string[];
    originalLanguage: string;
    countryOfOrigin: string;
    watchingState: string;
    releaseDate?: string;
    runtime?: number;
    numberOfSeasons?: number;
    seasons?: SeasonPayload[];
    completed?: boolean;
}

interface ImportResult {
    imported: number;
    skipped: number;
    duplicates: string[];
    errors: { title: string; error: string }[];
    total: number;
}

/**
 * Upload an image URL to Cloudinary.
 * Returns the Cloudinary secure URL, or the original URL if already on Cloudinary.
 */
async function uploadToCloudinary(imageUrl: string): Promise<string> {
    // Skip if already a Cloudinary URL
    if (!imageUrl || imageUrl.includes("res.cloudinary.com")) {
        return imageUrl;
    }

    // Skip if it's not a valid URL
    if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://") && !imageUrl.startsWith("data:")) {
        return imageUrl;
    }

    try {
        const result = await cloudinary.uploader.upload(imageUrl, {
            folder: "movie_filter/posters",
            transformation: [
                { width: 500, crop: "limit" },
                { quality: "auto" },
                { fetch_format: "auto" },
            ],
        });
        return result.secure_url;
    } catch (error) {
        console.error(`Failed to upload image to Cloudinary: ${imageUrl}`, error);
        // Return original URL if upload fails — the content can still be saved
        return imageUrl;
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();

        const { items }: { items: ImportItem[] } = await request.json();

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { success: false, error: "No items provided for import" },
                { status: 400 }
            );
        }

        const result: ImportResult = {
            imported: 0,
            skipped: 0,
            duplicates: [],
            errors: [],
            total: items.length,
        };

        // Process items sequentially to avoid overwhelming Cloudinary
        for (const item of items) {
            try {
                // Validate required fields
                if (!item.title || !item.title.trim()) {
                    result.errors.push({ title: item.title || "Unknown", error: "Missing title" });
                    result.skipped++;
                    continue;
                }

                // Check for duplicate: case-insensitive title + type match
                const existingContent = await Content.findOne({
                    title: { $regex: new RegExp(`^${escapeRegex(item.title.trim())}$`, "i") },
                    type: item.type,
                });

                if (existingContent) {
                    result.duplicates.push(item.title);
                    result.skipped++;
                    continue;
                }

                // Upload poster image to Cloudinary
                let posterUrl = item.posterImage;
                if (posterUrl) {
                    posterUrl = await uploadToCloudinary(posterUrl);
                }

                // Build the document
                const contentDoc: Record<string, unknown> = {
                    title: item.title.trim(),
                    type: item.type,
                    posterImage: posterUrl || "",
                    genres: item.genres || [],
                    cast: item.cast || [],
                    originalLanguage: item.originalLanguage || "",
                    countryOfOrigin: item.countryOfOrigin || "",
                    watchingState: item.watchingState || "pending",
                };

                if (item.type === "movie") {
                    contentDoc.releaseDate = item.releaseDate || undefined;
                    contentDoc.runtime = item.runtime || undefined;
                } else {
                    contentDoc.numberOfSeasons = item.numberOfSeasons || item.seasons?.length || 1;
                    contentDoc.seasons = item.seasons || [];
                    contentDoc.completed = item.completed || false;
                }

                await Content.create(contentDoc);
                result.imported++;
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : "Unknown error";
                result.errors.push({ title: item.title || "Unknown", error: message });
                result.skipped++;
            }
        }

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error: unknown) {
        console.error("Import error:", error);
        const message = error instanceof Error ? error.message : "Import failed";
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}

/**
 * Check for duplicates without importing — used for preview.
 */
export async function PUT(request: Request) {
    try {
        await connectDB();

        const { titles }: { titles: { title: string; type: string }[] } = await request.json();

        if (!titles || !Array.isArray(titles)) {
            return NextResponse.json(
                { success: false, error: "No titles provided" },
                { status: 400 }
            );
        }

        const duplicates: string[] = [];

        for (const { title, type } of titles) {
            if (!title) continue;

            const existing = await Content.findOne({
                title: { $regex: new RegExp(`^${escapeRegex(title.trim())}$`, "i") },
                type,
            });

            if (existing) {
                duplicates.push(title);
            }
        }

        return NextResponse.json({ success: true, duplicates });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Duplicate check failed";
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}

/**
 * Escape special regex characters in a string.
 */
function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
