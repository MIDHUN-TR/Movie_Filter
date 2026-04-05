import { ContentType, WatchingState } from "@/types/content";
import type { IContentBase, ISeason } from "@/types/content";

// ─── Encoding Detection ─────────────────────────────────────────────────────

/**
 * Supported encodings for CSV files.
 */
export const SUPPORTED_ENCODINGS = [
    "utf-8",
    "utf-16le",
    "utf-16be",
    "iso-8859-1",
    "windows-1252",
    "shift-jis",
    "euc-jp",
    "iso-2022-jp",
    "euc-kr",
    "gb2312",
    "gbk",
    "big5",
    "ascii",
] as const;

export type SupportedEncoding = (typeof SUPPORTED_ENCODINGS)[number];

/**
 * Detect encoding from BOM (Byte Order Mark).
 * Returns the encoding name or null if no BOM detected.
 */
function detectBOM(bytes: Uint8Array): SupportedEncoding | null {
    if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
        return "utf-8";
    }
    if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) {
        return "utf-16le";
    }
    if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
        return "utf-16be";
    }
    return null;
}

/**
 * Decode a buffer to string using the specified or auto-detected encoding.
 */
export function decodeCSVBuffer(
    buffer: ArrayBuffer,
    encoding?: SupportedEncoding | "auto"
): string {
    const bytes = new Uint8Array(buffer);

    // Auto-detect from BOM
    const bomEncoding = detectBOM(bytes);

    const selectedEncoding: string = encoding && encoding !== "auto"
        ? encoding
        : bomEncoding || "utf-8";

    // Strip BOM bytes if present
    let startOffset = 0;
    if (bomEncoding === "utf-8" && bytes[0] === 0xef) {
        startOffset = 3;
    } else if (bomEncoding === "utf-16le" || bomEncoding === "utf-16be") {
        startOffset = 2;
    }

    const slicedBuffer = startOffset > 0 ? buffer.slice(startOffset) : buffer;

    try {
        const decoder = new TextDecoder(selectedEncoding, { fatal: true });
        return decoder.decode(slicedBuffer);
    } catch {
        // Fallback: try UTF-8 with replacement characters
        try {
            const fallbackDecoder = new TextDecoder("utf-8", { fatal: false });
            return fallbackDecoder.decode(slicedBuffer);
        } catch {
            // Last resort: ISO-8859-1 (accepts any byte sequence)
            const lastResort = new TextDecoder("iso-8859-1", { fatal: false });
            return lastResort.decode(slicedBuffer);
        }
    }
}

// ─── CSV Parsing ─────────────────────────────────────────────────────────────

/**
 * Auto-detect the delimiter used in the CSV (comma, semicolon, tab).
 */
function detectDelimiter(firstLine: string): string {
    const commaCount = (firstLine.match(/,/g) || []).length;
    const semicolonCount = (firstLine.match(/;/g) || []).length;
    const tabCount = (firstLine.match(/\t/g) || []).length;

    if (tabCount > commaCount && tabCount > semicolonCount) return "\t";
    if (semicolonCount > commaCount) return ";";
    return ",";
}

/**
 * Parse a single CSV line into fields, handling quoted values correctly.
 * Supports: escaped quotes (""), newlines within quotes, etc.
 */
function parseCSVLine(line: string, delimiter: string): string[] {
    const fields: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (inQuotes) {
            if (char === '"') {
                // Check for escaped quote
                if (i + 1 < line.length && line[i + 1] === '"') {
                    current += '"';
                    i++; // Skip next quote
                } else {
                    inQuotes = false;
                }
            } else {
                current += char;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === delimiter) {
                fields.push(current.trim());
                current = "";
            } else {
                current += char;
            }
        }
    }
    fields.push(current.trim());
    return fields;
}

/**
 * Split CSV text into rows, properly handling newlines within quoted fields.
 */
function splitCSVRows(text: string): string[] {
    const rows: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (char === '"') {
            // Toggle quote state (handling escaped quotes)
            if (inQuotes && i + 1 < text.length && text[i + 1] === '"') {
                current += '""';
                i++;
            } else {
                inQuotes = !inQuotes;
                current += char;
            }
        } else if ((char === "\n" || char === "\r") && !inQuotes) {
            // End of row
            if (char === "\r" && i + 1 < text.length && text[i + 1] === "\n") {
                i++; // Skip \n in \r\n
            }
            if (current.trim().length > 0) {
                rows.push(current);
            }
            current = "";
        } else {
            current += char;
        }
    }
    if (current.trim().length > 0) {
        rows.push(current);
    }
    return rows;
}

/**
 * Parse full CSV text into an array of objects keyed by header names.
 */
export function parseCSVText(text: string): Record<string, string>[] {
    const rows = splitCSVRows(text);
    if (rows.length < 2) return []; // Need at least header + 1 data row

    const headerLine = rows[0];
    const delimiter = detectDelimiter(headerLine);
    const headers = parseCSVLine(headerLine, delimiter).map((h) =>
        h.toLowerCase().replace(/[^a-z0-9_]/g, "").trim()
    );

    const results: Record<string, string>[] = [];
    for (let i = 1; i < rows.length; i++) {
        const fields = parseCSVLine(rows[i], delimiter);
        const obj: Record<string, string> = {};
        headers.forEach((header, idx) => {
            if (header && idx < fields.length) {
                obj[header] = fields[idx];
            }
        });
        // Skip fully empty rows
        const hasData = Object.values(obj).some((v) => v.trim().length > 0);
        if (hasData) {
            results.push(obj);
        }
    }
    return results;
}

// ─── Column Mapping & Content Building ───────────────────────────────────────

/**
 * Common header aliases for flexible column name matching.
 */
const HEADER_ALIASES: Record<string, string[]> = {
    title: ["title", "name", "moviename", "movietitle", "animename", "seriesname", "showtitle"],
    type: ["type", "contenttype", "category", "kind"],
    posterimage: ["posterimage", "poster", "image", "imageurl", "posterurl", "thumbnail", "cover", "coverimage"],
    genres: ["genres", "genre", "tags", "categories"],
    cast: ["cast", "actors", "starring", "stars"],
    originallanguage: ["originallanguage", "language", "lang", "originallang"],
    countryoforigin: ["countryoforigin", "country", "origin", "region"],
    watchingstate: ["watchingstate", "status", "state", "watchstatus", "watchstate"],
    releasedate: ["releasedate", "release", "date", "year", "releaseyear"],
    runtime: ["runtime", "duration", "length", "minutes", "durationminutes"],
    numberofseasons: ["numberofseasons", "seasons", "totalseasons", "seasoncount"],
    seasonsdata: ["seasonsdata", "seasondetails", "seasoninfo", "episodes", "episodedata", "seasonepisodes"],
};

/**
 * Resolve a CSV header to a known field name using aliases.
 */
function resolveHeader(rawHeader: string): string | null {
    const normalized = rawHeader.toLowerCase().replace(/[^a-z0-9]/g, "");
    for (const [fieldName, aliases] of Object.entries(HEADER_ALIASES)) {
        if (aliases.includes(normalized)) {
            return fieldName;
        }
    }
    return null;
}

/**
 * Parse the seasons data string for a content item.
 * Supports formats:
 *   - "SeasonName:EpisodeCount|SeasonName:EpisodeCount"   → named seasons
 *   - "EpisodeCount|EpisodeCount|EpisodeCount"            → numbered seasons
 *   - "12"                                                 → single season
 */
export function parseSeasonsData(
    seasonsStr: string,
    isAnime: boolean
): ISeason[] {
    if (!seasonsStr || seasonsStr.trim().length === 0) return [];

    const parts = seasonsStr.split("|").map((p) => p.trim()).filter(Boolean);
    const seasons: ISeason[] = [];

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        if (part.includes(":")) {
            // Format: "SeasonName:EpisodeCount"
            const colonIdx = part.lastIndexOf(":");
            const name = part.substring(0, colonIdx).trim();
            const epCount = parseInt(part.substring(colonIdx + 1).trim(), 10);
            seasons.push({
                seasonNumber: i + 1,
                name: name || (isAnime ? `Season ${i + 1}` : undefined),
                numberOfEpisodes: isNaN(epCount) ? 1 : Math.max(1, epCount),
                watchedEpisodes: 0,
            });
        } else {
            // Format: just a number (episode count)
            const epCount = parseInt(part, 10);
            seasons.push({
                seasonNumber: i + 1,
                name: isAnime ? `Season ${i + 1}` : undefined,
                numberOfEpisodes: isNaN(epCount) ? 1 : Math.max(1, epCount),
                watchedEpisodes: 0,
            });
        }
    }

    return seasons;
}

/**
 * Parse the content type string into a ContentType enum value.
 */
function parseContentType(typeStr: string): ContentType {
    const normalized = typeStr.toLowerCase().trim();
    switch (normalized) {
        case "movie":
        case "film":
            return ContentType.MOVIE;
        case "series":
        case "show":
        case "web series":
        case "webseries":
            return ContentType.SERIES;
        case "anime":
        case "animation":
            return ContentType.ANIME;
        case "tv":
        case "tv show":
        case "tvshow":
        case "television":
            return ContentType.TV_SHOW;
        default:
            return ContentType.MOVIE; // Default fallback
    }
}

/**
 * Parse watching state string into WatchingState enum.
 */
function parseWatchingState(stateStr: string): WatchingState {
    const normalized = stateStr.toLowerCase().trim();
    switch (normalized) {
        case "watched":
        case "completed":
        case "done":
        case "finished":
            return WatchingState.WATCHED;
        case "watching":
        case "in progress":
        case "ongoing":
        case "current":
            return WatchingState.WATCHING;
        case "pending":
        case "plan to watch":
        case "planned":
        case "ptw":
        case "to watch":
        default:
            return WatchingState.PENDING;
    }
}

/**
 * Parse comma-separated list (genres, cast).
 */
function parseCommaSeparated(str: string): string[] {
    if (!str) return [];
    return str
        .split(/[,;]/)
        .map((s) => s.trim())
        .filter(Boolean);
}

export interface ParsedCSVItem {
    content: Partial<IContentBase>;
    rawRow: Record<string, string>;
    errors: string[];
    isDuplicate?: boolean;
}

/**
 * Convert parsed CSV rows into content items ready for import.
 */
export function mapCSVToContent(
    rows: Record<string, string>[]
): ParsedCSVItem[] {
    return rows.map((row) => {
        const errors: string[] = [];

        // Build a resolved field map
        const resolved: Record<string, string> = {};
        for (const [rawKey, value] of Object.entries(row)) {
            const fieldName = resolveHeader(rawKey);
            if (fieldName) {
                resolved[fieldName] = value;
            }
        }

        // Required fields
        const title = resolved.title?.trim();
        if (!title) errors.push("Missing title");

        const typeStr = resolved.type?.trim() || "movie";
        const type = parseContentType(typeStr);
        const isAnime = type === ContentType.ANIME;
        const isMovie = type === ContentType.MOVIE;

        // Build the content object
        const content: Partial<IContentBase> = {
            title: title || "",
            type,
            posterImage: resolved.posterimage?.trim() || "",
            genres: parseCommaSeparated(resolved.genres || ""),
            cast: parseCommaSeparated(resolved.cast || ""),
            originalLanguage: resolved.originallanguage?.trim() || "",
            countryOfOrigin: resolved.countryoforigin?.trim() || "",
            watchingState: parseWatchingState(resolved.watchingstate || "pending"),
        };

        if (!content.posterImage) errors.push("Missing poster image");
        if (!content.genres || content.genres.length === 0) errors.push("Missing genres");
        if (!content.originalLanguage) errors.push("Missing original language");
        if (!content.countryOfOrigin) errors.push("Missing country of origin");

        if (isMovie) {
            // Movie-specific fields
            if (resolved.releasedate) {
                content.releaseDate = resolved.releasedate.trim();
            } else {
                errors.push("Missing release date");
            }
            const rt = parseInt(resolved.runtime || "", 10);
            if (!isNaN(rt) && rt > 0) {
                content.runtime = rt;
            } else {
                errors.push("Missing or invalid runtime");
            }
        } else {
            // Series/Anime/TV — parse seasons
            const seasonsData = resolved.seasonsdata || resolved.numberofseasons || "";
            const seasons = parseSeasonsData(seasonsData, isAnime);

            if (seasons.length > 0) {
                content.seasons = seasons;
                content.numberOfSeasons = seasons.length;
            } else {
                // Try to get numberOfSeasons as a plain number
                const numSeasons = parseInt(resolved.numberofseasons || "", 10);
                if (!isNaN(numSeasons) && numSeasons > 0) {
                    content.numberOfSeasons = numSeasons;
                    // Generate placeholder seasons
                    content.seasons = Array.from({ length: numSeasons }, (_, i) => ({
                        seasonNumber: i + 1,
                        name: isAnime ? `Season ${i + 1}` : undefined,
                        numberOfEpisodes: 1,
                        watchedEpisodes: 0,
                    }));
                } else {
                    errors.push("Missing season/episode data");
                }
            }
        }

        return { content, rawRow: row, errors };
    });
}
