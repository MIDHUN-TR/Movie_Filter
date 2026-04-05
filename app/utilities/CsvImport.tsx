"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    decodeCSVBuffer,
    parseCSVText,
    mapCSVToContent,
    SUPPORTED_ENCODINGS,
    type SupportedEncoding,
    type ParsedCSVItem,
} from "@/lib/csvParser";

// ─── Types ──────────────────────────────────────────────────────────────────

type ImportPhase = "idle" | "parsed" | "checking" | "importing" | "done";

interface ImportResult {
    imported: number;
    skipped: number;
    duplicates: string[];
    errors: { title: string; error: string }[];
    total: number;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function CsvImport() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // State
    const [open, setOpen] = useState(false);
    const [encoding, setEncoding] = useState<SupportedEncoding | "auto">("auto");
    const [phase, setPhase] = useState<ImportPhase>("idle");
    const [parsedItems, setParsedItems] = useState<ParsedCSVItem[]>([]);
    const [importResult, setImportResult] = useState<ImportResult | null>(null);
    const [progressText, setProgressText] = useState("");
    const [progressPercent, setProgressPercent] = useState(0);
    const [error, setError] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState("");

    // ─── Reset ──────────────────────────────────────────────────────────────

    const reset = () => {
        setPhase("idle");
        setParsedItems([]);
        setImportResult(null);
        setProgressText("");
        setProgressPercent(0);
        setError("");
        setIsDragging(false);
        setFileName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleClose = () => {
        setOpen(false);
        reset();
    };

    // ─── File Processing ────────────────────────────────────────────────────

    const processFile = useCallback(
        async (file: File) => {
            setError("");
            setFileName(file.name);

            if (
                !file.name.toLowerCase().endsWith(".csv") &&
                !file.name.toLowerCase().endsWith(".tsv") &&
                !file.name.toLowerCase().endsWith(".txt")
            ) {
                setError("Please select a CSV file (.csv, .tsv, or .txt)");
                return;
            }

            try {
                const buffer = await file.arrayBuffer();
                const text = decodeCSVBuffer(buffer, encoding);
                const rawRows = parseCSVText(text);

                if (rawRows.length === 0) {
                    setError("No data found in the CSV file. Check format & headers.");
                    return;
                }

                const items = mapCSVToContent(rawRows);
                setParsedItems(items);
                setPhase("checking");

                // Check for duplicates
                const titles = items
                    .filter((i) => i.content.title && i.content.type)
                    .map((i) => ({
                        title: i.content.title!,
                        type: i.content.type!,
                    }));

                try {
                    const res = await fetch("/api/import", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ titles }),
                    });
                    const data = await res.json();

                    if (data.success && data.duplicates) {
                        const dupSet = new Set(
                            data.duplicates.map((d: string) => d.toLowerCase())
                        );
                        const updatedItems = items.map((item) => ({
                            ...item,
                            isDuplicate: dupSet.has(
                                (item.content.title || "").toLowerCase()
                            ),
                        }));
                        setParsedItems(updatedItems);
                    }
                } catch {
                    // Duplicate check failed silently — proceed anyway
                    console.warn("Duplicate check failed, proceeding without.");
                }

                setPhase("parsed");
            } catch (err: unknown) {
                const msg =
                    err instanceof Error ? err.message : "Failed to parse CSV";
                setError(msg);
            }
        },
        [encoding]
    );

    // ─── Drag & Drop ────────────────────────────────────────────────────────

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    // ─── Import ─────────────────────────────────────────────────────────────

    const handleImport = async () => {
        const validItems = parsedItems.filter(
            (item) => !item.isDuplicate && item.errors.length === 0
        );

        if (validItems.length === 0) {
            setError("No valid items to import. Fix errors or remove duplicates.");
            return;
        }

        setPhase("importing");
        setProgressPercent(0);
        setProgressText(`Preparing ${validItems.length} items...`);

        try {
            // Build the payload
            const importPayload = validItems.map((item) => item.content);

            setProgressText(
                `Importing ${validItems.length} items (uploading images to Cloudinary)...`
            );
            setProgressPercent(20);

            const res = await fetch("/api/import", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: importPayload }),
            });

            setProgressPercent(90);

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Import failed");
            }

            setProgressPercent(100);
            setImportResult(data.data);
            setPhase("done");
            setProgressText("Import complete!");

            // Refresh the page data after a short delay
            setTimeout(() => router.refresh(), 500);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Import failed";
            setError(msg);
            setPhase("parsed");
        }
    };

    // ─── Counts ─────────────────────────────────────────────────────────────

    const validCount = parsedItems.filter(
        (i) => !i.isDuplicate && i.errors.length === 0
    ).length;
    const duplicateCount = parsedItems.filter((i) => i.isDuplicate).length;
    const errorCount = parsedItems.filter(
        (i) => i.errors.length > 0 && !i.isDuplicate
    ).length;

    // ─── Render ─────────────────────────────────────────────────────────────

    return (
        <>
            {/* Import CSV Button */}
            <button
                onClick={() => setOpen(true)}
                className="group relative overflow-hidden rounded-2xl border border-[#3A0CA3]/30 bg-[#3A0CA3]/10 px-5 py-3.5 font-semibold text-[#a78bfa] shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#3A0CA3]/20 hover:text-white hover:shadow-xl active:scale-95"
            >
                <span className="relative z-10 flex items-center gap-2">
                    <svg
                        className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3-3m0 0l3 3m-3-3v12"
                        />
                    </svg>
                    Import CSV
                </span>
            </button>

            {/* Modal */}
            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                    onClick={handleClose}
                >
                    <div
                        className="relative mx-4 w-full max-w-3xl animate-[slideUp_0.3s_ease-out] rounded-3xl border border-white/10 bg-[#0a0a0a]/95 p-8 shadow-2xl backdrop-blur-xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Decorative gradient */}
                        <div className="absolute -top-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-[#3A0CA3] to-transparent" />

                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition-all duration-200 hover:bg-white/10 hover:text-white hover:rotate-90"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Header */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <span className="flex items-center justify-center h-10 w-10 rounded-xl bg-[#3A0CA3]/20 text-lg">📄</span>
                                Import CSV
                            </h2>
                            <p className="mt-1 text-sm text-slate-400">
                                Bulk import movies, series, and anime from a CSV file
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-start gap-2">
                                <svg className="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* ─── Phase: Idle — File Upload ─────────────────────────── */}
                        {phase === "idle" && (
                            <div className="space-y-4">
                                {/* Encoding Selector */}
                                <div className="flex items-center gap-3">
                                    <label className="text-sm text-slate-400 whitespace-nowrap">Encoding:</label>
                                    <select
                                        value={encoding}
                                        onChange={(e) => setEncoding(e.target.value as SupportedEncoding | "auto")}
                                        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-all duration-200 focus:border-[#3A0CA3]/50 focus:ring-2 focus:ring-[#3A0CA3]/20 appearance-none cursor-pointer"
                                    >
                                        <option value="auto" className="bg-slate-900">Auto Detect</option>
                                        {SUPPORTED_ENCODINGS.map((enc) => (
                                            <option key={enc} value={enc} className="bg-slate-900">
                                                {enc.toUpperCase()}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Drop Zone */}
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 transition-all duration-300 cursor-pointer ${
                                        isDragging
                                            ? "border-[#3A0CA3] bg-[#3A0CA3]/10 scale-[1.02]"
                                            : "border-white/10 bg-white/[0.02] hover:border-[#3A0CA3]/40 hover:bg-white/[0.04]"
                                    }`}
                                >
                                    <div className={`flex items-center justify-center h-16 w-16 rounded-2xl transition-all duration-300 ${
                                        isDragging ? "bg-[#3A0CA3]/20 scale-110" : "bg-white/5"
                                    }`}>
                                        <svg className={`h-8 w-8 transition-colors duration-300 ${isDragging ? "text-[#3A0CA3]" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-white font-medium">
                                            {isDragging ? "Drop your CSV here" : "Drag & drop your CSV file"}
                                        </p>
                                        <p className="text-sm text-slate-500 mt-1">
                                            or click to browse • Supports .csv, .tsv, .txt
                                        </p>
                                    </div>
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".csv,.tsv,.txt"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                {/* CSV Format Guide */}
                                <details className="group rounded-xl border border-white/5 bg-white/[0.02]">
                                    <summary className="flex items-center justify-between cursor-pointer px-4 py-3 text-sm text-slate-400 hover:text-slate-300 transition-colors">
                                        <span className="flex items-center gap-2">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            CSV Format Guide
                                        </span>
                                        <svg className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <div className="px-4 pb-4 text-xs text-slate-500 space-y-2">
                                        <p><strong className="text-slate-300">Required columns:</strong> title, type, posterImage, genres, originalLanguage, countryOfOrigin</p>
                                        <p><strong className="text-slate-300">Optional:</strong> cast, watchingState, releaseDate, runtime, numberOfSeasons, seasonsData</p>
                                        <p><strong className="text-slate-300">Type values:</strong> movie, series, anime, tv</p>
                                        <p><strong className="text-slate-300">Seasons format:</strong> <code className="bg-white/10 px-1.5 py-0.5 rounded">Name:Episodes|Name:Episodes</code> or just <code className="bg-white/10 px-1.5 py-0.5 rounded">12|24|12</code></p>
                                        <p><strong className="text-slate-300">Example:</strong></p>
                                        <div className="bg-black/40 rounded-lg p-3 font-mono text-[10px] leading-relaxed overflow-x-auto">
                                            title,type,posterImage,genres,cast,originalLanguage,countryOfOrigin,watchingState,seasonsData<br/>
                                            Attack on Titan,anime,https://...,&quot;Action,Fantasy&quot;,&quot;Actor 1,Actor 2&quot;,Japanese,Japan,watching,&quot;Phantom Blood:25|Battle Tendency:24&quot;
                                        </div>
                                    </div>
                                </details>
                            </div>
                        )}

                        {/* ─── Phase: Checking ───────────────────────────────────── */}
                        {phase === "checking" && (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="h-10 w-10 animate-spin rounded-full border-3 border-slate-700 border-t-[#3A0CA3]" />
                                <p className="mt-4 text-sm text-slate-400">Checking for duplicates...</p>
                            </div>
                        )}

                        {/* ─── Phase: Parsed — Preview Table ─────────────────────── */}
                        {phase === "parsed" && (
                            <div className="space-y-4">
                                {/* File info */}
                                <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-[#3A0CA3]/20">
                                            <svg className="h-4 w-4 text-[#3A0CA3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-white font-medium">{fileName}</p>
                                            <p className="text-xs text-slate-500">{parsedItems.length} rows found</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={reset}
                                        className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        Change file
                                    </button>
                                </div>

                                {/* Status Counts */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-center">
                                        <p className="text-2xl font-bold text-emerald-400">{validCount}</p>
                                        <p className="text-xs text-emerald-400/70">Ready to import</p>
                                    </div>
                                    <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-center">
                                        <p className="text-2xl font-bold text-amber-400">{duplicateCount}</p>
                                        <p className="text-xs text-amber-400/70">Duplicates</p>
                                    </div>
                                    <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-center">
                                        <p className="text-2xl font-bold text-red-400">{errorCount}</p>
                                        <p className="text-xs text-red-400/70">Errors</p>
                                    </div>
                                </div>

                                {/* Preview Table */}
                                <div className="rounded-xl border border-white/5 overflow-hidden">
                                    <div className="max-h-[40vh] overflow-y-auto">
                                        <table className="w-full text-sm">
                                            <thead className="sticky top-0 z-10">
                                                <tr className="bg-[#0f0f0f] border-b border-white/5">
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider w-10">Status</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Title</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider w-20">Type</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider hidden sm:table-cell">Genres</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider w-16 hidden md:table-cell">Image</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider hidden lg:table-cell">Seasons</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {parsedItems.map((item, idx) => {
                                                    const statusIcon = item.isDuplicate
                                                        ? "⚠️"
                                                        : item.errors.length > 0
                                                        ? "❌"
                                                        : "✅";
                                                    const rowClass = item.isDuplicate
                                                        ? "bg-amber-500/[0.03]"
                                                        : item.errors.length > 0
                                                        ? "bg-red-500/[0.03]"
                                                        : "bg-transparent hover:bg-white/[0.02]";

                                                    return (
                                                        <tr key={idx} className={`${rowClass} transition-colors`}>
                                                            <td className="px-4 py-3" title={item.isDuplicate ? "Duplicate — will be skipped" : item.errors.length > 0 ? item.errors.join(", ") : "Ready to import"}>
                                                                <span className="text-base">{statusIcon}</span>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <p className="text-white font-medium truncate max-w-[200px]">{item.content.title || "—"}</p>
                                                                {item.errors.length > 0 && (
                                                                    <p className="text-[10px] text-red-400 mt-0.5 truncate max-w-[200px]">
                                                                        {item.errors.join(" • ")}
                                                                    </p>
                                                                )}
                                                                {item.isDuplicate && (
                                                                    <p className="text-[10px] text-amber-400 mt-0.5">Already in database</p>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                                                    item.content.type === "anime"
                                                                        ? "bg-purple-500/20 text-purple-300"
                                                                        : item.content.type === "movie"
                                                                        ? "bg-blue-500/20 text-blue-300"
                                                                        : item.content.type === "tv"
                                                                        ? "bg-teal-500/20 text-teal-300"
                                                                        : "bg-orange-500/20 text-orange-300"
                                                                }`}>
                                                                    {item.content.type || "—"}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 hidden sm:table-cell">
                                                                <p className="text-xs text-slate-400 truncate max-w-[150px]">
                                                                    {item.content.genres?.join(", ") || "—"}
                                                                </p>
                                                            </td>
                                                            <td className="px-4 py-3 hidden md:table-cell">
                                                                {item.content.posterImage ? (
                                                                    <div className="h-10 w-8 rounded overflow-hidden bg-white/5 border border-white/10">
                                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                        <img
                                                                            src={item.content.posterImage}
                                                                            alt=""
                                                                            className="h-full w-full object-cover"
                                                                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-xs text-slate-600">—</span>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3 hidden lg:table-cell">
                                                                {item.content.type !== "movie" && item.content.seasons ? (
                                                                    <div className="text-xs text-slate-400">
                                                                        {item.content.seasons.length} season{item.content.seasons.length !== 1 ? "s" : ""}
                                                                        {item.content.type === "anime" && item.content.seasons.some(s => s.name) && (
                                                                            <span className="text-[10px] text-purple-400 ml-1">(named)</span>
                                                                        )}
                                                                    </div>
                                                                ) : item.content.type === "movie" ? (
                                                                    <span className="text-xs text-slate-600">N/A</span>
                                                                ) : (
                                                                    <span className="text-xs text-slate-600">—</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-between pt-2">
                                    <p className="text-xs text-slate-500">
                                        {validCount} of {parsedItems.length} items will be imported
                                        {duplicateCount > 0 && ` • ${duplicateCount} duplicates skipped`}
                                    </p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleClose}
                                            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-white"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleImport}
                                            disabled={validCount === 0}
                                            className="rounded-xl bg-[#3A0CA3] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#3A0CA3]/25 transition-all duration-200 hover:shadow-xl hover:shadow-[#3A0CA3]/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Import {validCount} Items
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ─── Phase: Importing — Progress ───────────────────────── */}
                        {phase === "importing" && (
                            <div className="flex flex-col items-center justify-center py-12 space-y-6">
                                {/* Animated spinner */}
                                <div className="relative h-20 w-20">
                                    <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                                    <div
                                        className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#3A0CA3] animate-spin"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-sm font-bold text-white">{Math.round(progressPercent)}%</span>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div className="w-full max-w-sm">
                                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-[#3A0CA3] to-[#7c3aed] transition-all duration-500 ease-out"
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                    </div>
                                </div>

                                <p className="text-sm text-slate-400 text-center">{progressText}</p>
                                <p className="text-xs text-slate-600">
                                    Images are being uploaded to Cloudinary automatically...
                                </p>
                            </div>
                        )}

                        {/* ─── Phase: Done — Results ─────────────────────────────── */}
                        {phase === "done" && importResult && (
                            <div className="space-y-4">
                                {/* Success Banner */}
                                <div className="flex flex-col items-center text-center py-6">
                                    <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-emerald-500/20 mb-4">
                                        <svg className="h-8 w-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Import Complete!</h3>
                                    <p className="text-sm text-slate-400 mt-1">
                                        Successfully imported {importResult.imported} of {importResult.total} items
                                    </p>
                                </div>

                                {/* Result Stats */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
                                        <p className="text-3xl font-bold text-emerald-400">{importResult.imported}</p>
                                        <p className="text-xs text-emerald-400/70 mt-1">Imported</p>
                                    </div>
                                    <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-center">
                                        <p className="text-3xl font-bold text-amber-400">{importResult.duplicates.length}</p>
                                        <p className="text-xs text-amber-400/70 mt-1">Duplicates</p>
                                    </div>
                                    <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-center">
                                        <p className="text-3xl font-bold text-red-400">{importResult.errors.length}</p>
                                        <p className="text-xs text-red-400/70 mt-1">Errors</p>
                                    </div>
                                </div>

                                {/* Duplicate Details */}
                                {importResult.duplicates.length > 0 && (
                                    <details className="group rounded-xl border border-amber-500/10 bg-amber-500/[0.03]">
                                        <summary className="flex items-center justify-between cursor-pointer px-4 py-3 text-sm text-amber-400 hover:text-amber-300 transition-colors">
                                            <span>⚠️ Skipped Duplicates ({importResult.duplicates.length})</span>
                                            <svg className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </summary>
                                        <div className="px-4 pb-3">
                                            <ul className="text-xs text-slate-400 space-y-1">
                                                {importResult.duplicates.map((dup, i) => (
                                                    <li key={i} className="flex items-center gap-2">
                                                        <span className="h-1 w-1 rounded-full bg-amber-500/50" />
                                                        {dup}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </details>
                                )}

                                {/* Error Details */}
                                {importResult.errors.length > 0 && (
                                    <details className="group rounded-xl border border-red-500/10 bg-red-500/[0.03]">
                                        <summary className="flex items-center justify-between cursor-pointer px-4 py-3 text-sm text-red-400 hover:text-red-300 transition-colors">
                                            <span>❌ Errors ({importResult.errors.length})</span>
                                            <svg className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </summary>
                                        <div className="px-4 pb-3">
                                            <ul className="text-xs text-slate-400 space-y-1">
                                                {importResult.errors.map((err, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <span className="h-1 w-1 rounded-full bg-red-500/50 mt-1.5 flex-shrink-0" />
                                                        <span><strong className="text-red-300">{err.title}:</strong> {err.error}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </details>
                                )}

                                {/* Close Button */}
                                <div className="flex justify-end pt-2">
                                    <button
                                        onClick={handleClose}
                                        className="rounded-xl bg-[#3A0CA3] px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#3A0CA3]/25 transition-all duration-200 hover:shadow-xl hover:shadow-[#3A0CA3]/30 active:scale-95"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        )}
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
        </>
    );
}
