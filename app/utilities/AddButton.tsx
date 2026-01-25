"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddContentModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [type, setType] = useState("movie");
  const [title, setTitle] = useState("");
  const [posterImage, setPosterImage] = useState("");
  const [genres, setGenres] = useState("");
  const [cast, setCast] = useState("");
  const [originalLanguage, setOriginalLanguage] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("");
  const [watchingState, setWatchingState] = useState("pending");

  // Movie specific
  const [releaseDate, setReleaseDate] = useState("");
  const [runtime, setRuntime] = useState("");

  // Series specific
  const [numberOfSeasons, setNumberOfSeasons] = useState("");
  const [numberOfEpisodes, setNumberOfEpisodes] = useState("");

  const isMovie = type === "movie";
  const isSeriesLike = ["series", "anime", "tv"].includes(type);

  const resetForm = () => {
    setTitle("");
    setPosterImage("");
    setGenres("");
    setCast("");
    setOriginalLanguage("");
    setCountryOfOrigin("");
    setWatchingState("pending");
    setReleaseDate("");
    setRuntime("");
    setNumberOfSeasons("");
    setNumberOfEpisodes("");
    setError("");
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const payload: any = {
        type,
        title,
        posterImage,
        genres: genres.split(",").map(g => g.trim()).filter(Boolean),
        cast: cast.split(",").map(c => c.trim()).filter(Boolean),
        originalLanguage,
        countryOfOrigin,
        watchingState,
      };

      if (isMovie) {
        payload.releaseDate = releaseDate;
        payload.runtime = Number(runtime);
      } else {
        payload.numberOfSeasons = Number(numberOfSeasons);
        payload.numberOfEpisodes = Number(numberOfEpisodes);
      }

      const res = await fetch("/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create content");
      }

      setOpen(false);
      resetForm();
      router.refresh(); // Refresh to show new data
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Modern Floating Add Button - Orange Theme */}
      <button
        onClick={() => setOpen(true)}
        className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30 active:scale-95"
      >
        <span className="relative z-10 flex items-center gap-2">
          <svg
            className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Content
        </span>
        <div className="absolute inset-0 -z-0 bg-gradient-to-r from-amber-500 to-orange-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </button>

      {/* Modal Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all duration-300"
          onClick={() => setOpen(false)}
        >
          {/* Modal Content */}
          <div
            className="relative mx-4 w-full max-w-lg animate-[slideUp_0.3s_ease-out] rounded-3xl border border-white/10 bg-slate-900/95 p-8 shadow-2xl backdrop-blur-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative gradient */}
            <div className="absolute -top-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition-all duration-200 hover:bg-white/10 hover:text-white hover:rotate-90"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">
                Add New Content
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Fill in the details to add to your watchlist
              </p>
              {error && (
                <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg">
                  {error}
                </div>
              )}
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Type Selector */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: "movie", label: "Movie", icon: "🎬" },
                  { value: "series", label: "Series", icon: "📺" },
                  { value: "anime", label: "Anime", icon: "⚔️" },
                  { value: "tv", label: "TV Show", icon: "📡" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setType(option.value)}
                    className={`flex flex-col items-center gap-1 rounded-xl p-3 text-sm font-medium transition-all duration-200 ${type === option.value
                      ? "bg-gradient-to-br from-orange-500/20 to-amber-500/20 text-white ring-2 ring-orange-500"
                      : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-300"
                      }`}
                  >
                    <span className="text-lg">{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>

              {/* Common Fields */}
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-orange-500/50 focus:bg-white/10 focus:ring-2 focus:ring-orange-500/20"
                />
                <input
                  type="text"
                  placeholder="Poster Image URL"
                  value={posterImage}
                  onChange={(e) => setPosterImage(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-orange-500/50 focus:bg-white/10 focus:ring-2 focus:ring-orange-500/20"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Genres (comma separated)"
                    value={genres}
                    onChange={(e) => setGenres(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-orange-500/50 focus:bg-white/10 focus:ring-2 focus:ring-orange-500/20"
                  />
                  <input
                    type="text"
                    placeholder="Cast (comma separated)"
                    value={cast}
                    onChange={(e) => setCast(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-orange-500/50 focus:bg-white/10 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Original Language"
                    value={originalLanguage}
                    onChange={(e) => setOriginalLanguage(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-orange-500/50 focus:bg-white/10 focus:ring-2 focus:ring-orange-500/20"
                  />
                  <input
                    type="text"
                    placeholder="Country of Origin"
                    value={countryOfOrigin}
                    onChange={(e) => setCountryOfOrigin(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-orange-500/50 focus:bg-white/10 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              {/* Movie-specific Fields */}
              {isMovie && (
                <div className="grid grid-cols-2 gap-3 animate-[fadeIn_0.2s_ease-out]">
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-slate-900 px-1 text-xs text-slate-400">
                      Release Date
                    </label>
                    <input
                      type="date"
                      value={releaseDate}
                      onChange={(e) => setReleaseDate(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all duration-200 focus:border-orange-500/50 focus:bg-white/10 focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                  <input
                    type="number"
                    placeholder="Runtime (minutes)"
                    value={runtime}
                    onChange={(e) => setRuntime(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-orange-500/50 focus:bg-white/10 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              )}

              {/* Series/Anime/TV Fields */}
              {isSeriesLike && (
                <div className="grid grid-cols-2 gap-3 animate-[fadeIn_0.2s_ease-out]">
                  <input
                    type="number"
                    placeholder="No. of Seasons"
                    value={numberOfSeasons}
                    onChange={(e) => setNumberOfSeasons(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-orange-500/50 focus:bg-white/10 focus:ring-2 focus:ring-orange-500/20"
                  />
                  <input
                    type="number"
                    placeholder="No. of Episodes"
                    value={numberOfEpisodes}
                    onChange={(e) => setNumberOfEpisodes(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-orange-500/50 focus:bg-white/10 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              )}

              {/* Watching State */}
              <div>
                <select
                  value={watchingState}
                  onChange={(e) => setWatchingState(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-orange-500/50 focus:bg-white/10 focus:ring-2 focus:ring-orange-500/20 appearance-none cursor-pointer"
                >
                  <option value="pending" className="bg-slate-900">Pending</option>
                  <option value="watching" className="bg-slate-900">Watching</option>
                  <option value="watched" className="bg-slate-900">Watched</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 font-medium text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-2.5 font-semibold text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-orange-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save Content"}
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
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
