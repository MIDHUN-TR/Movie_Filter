"use client";

import { useState, useRef } from "react";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    className?: string;
}

export default function ImageUpload({ value, onChange, className = "" }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError("Image must be under 5MB");
            return;
        }

        try {
            setUploading(true);
            setError("");

            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Upload failed");
            }

            onChange(data.url);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
            // Reset file input so the same file can be re-selected
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };


    const handleUrlUpload = async () => {
        if (!value || value.includes("res.cloudinary.com")) return;

        try {
            setUploading(true);
            setError("");

            const formData = new FormData();
            formData.append("url", value);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Upload failed");
            }

            onChange(data.url);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <div className="flex gap-2">
                {/* URL text input (fallback for pasting links) */}
                <input
                    type="text"
                    placeholder="Poster Image URL"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={uploading}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-[#3A0CA3]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#3A0CA3]/20 disabled:opacity-50"
                />

                {/* Cloud Upload button (for URLs) */}
                {value && (value.startsWith("http") || value.startsWith("data:")) && !value.includes("res.cloudinary.com") && (
                    <button
                        type="button"
                        onClick={handleUrlUpload}
                        disabled={uploading}
                        title="Upload this URL to Cloudinary"
                        className="flex items-center justify-center rounded-xl bg-[#3A0CA3]/20 text-white px-4 py-3 transition-all duration-200 hover:bg-[#3A0CA3]/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </button>
                )}

                {/* Upload button */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    {uploading ? (
                        <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400/30 border-t-[#3A0CA3]" />
                            <span>Uploading...</span>
                        </>
                    ) : (
                        <>
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Upload</span>
                        </>
                    )}
                </button>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            {/* Error */}
            {error && (
                <p className="text-xs text-red-400">{error}</p>
            )}

            {/* Thumbnail preview */}
            {value && !uploading && (
                <div className="flex items-center gap-2">
                    <img
                        src={value}
                        alt="Preview"
                        className="h-12 w-12 rounded-lg object-cover border border-white/10"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    <span className="text-xs text-slate-500 truncate max-w-[250px]">{value}</span>
                </div>
            )}
        </div>
    );
}
