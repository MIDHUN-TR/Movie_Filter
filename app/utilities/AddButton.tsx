"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "./ImageUpload";

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
  const [seasonEpisodes, setSeasonEpisodes] = useState<{ episodes: number; name: string }[]>([]);

  const addSeason = () => {
    setSeasonEpisodes(prev => [...prev, { episodes: 1, name: "" }]); // Default 1 episode, empty name
  };

  const removeSeason = () => {
    setSeasonEpisodes(prev => prev.slice(0, -1)); // Remove last season
  };

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
    setRuntime("");
    setSeasonEpisodes([]);
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
      } else if (isSeriesLike) {
        payload.numberOfSeasons = seasonEpisodes.length;
        payload.seasons = seasonEpisodes.map((seasonData, index) => ({
            seasonNumber: index + 1,
            name: seasonData.name.trim() !== "" ? seasonData.name.trim() : "",
            numberOfEpisodes: seasonData.episodes || 1,
            watchedEpisodes: 0
        }));
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
        className="group relative overflow-hidden rounded-2xl bg-[#3A0CA3] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#3A0CA3]/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#3A0CA3]/30 active:scale-95"
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
        <div className="absolute inset-0 -z-0 bg-gradient-to-r from-[#3A0CA3] to-[#25086b] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </button>

      {/* Modal Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all duration-300"
          onClick={() => setOpen(false)}
        >
          {/* Modal Content */}
          <div
            className="relative mx-4 w-full max-w-lg animate-[slideUp_0.3s_ease-out] rounded-3xl border border-white/10 bg-[#0a0a0a]/95 p-8 shadow-2xl backdrop-blur-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative gradient */}
            <div className="absolute -top-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-[#3A0CA3] to-transparent" />

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
                      ? "bg-[#3A0CA3]/20 text-white ring-2 ring-[#3A0CA3]"
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
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-[#3A0CA3]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#3A0CA3]/20"
                />
                <ImageUpload
                  value={posterImage}
                  onChange={(url) => setPosterImage(url)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Genres (comma separated)"
                    value={genres}
                    onChange={(e) => setGenres(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-[#3A0CA3]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#3A0CA3]/20"
                  />
                  <input
                    type="text"
                    placeholder="Cast (comma separated)"
                    value={cast}
                    onChange={(e) => setCast(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-[#3A0CA3]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#3A0CA3]/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Original Language"
                    value={originalLanguage}
                    onChange={(e) => setOriginalLanguage(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-[#3A0CA3]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#3A0CA3]/20"
                  />
                  <input
                    type="text"
                    placeholder="Country of Origin"
                    value={countryOfOrigin}
                    onChange={(e) => setCountryOfOrigin(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-[#3A0CA3]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#3A0CA3]/20"
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
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all duration-200 focus:border-[#3A0CA3]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#3A0CA3]/20"
                    />
                  </div>
                  <input
                    type="number"
                    placeholder="Runtime (minutes)"
                    value={runtime}
                    onChange={(e) => setRuntime(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-[#3A0CA3]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#3A0CA3]/20"
                  />
                </div>
              )}

              {/* Series/Anime/TV Fields */}
              {isSeriesLike && (
                <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                    <div>
                      <h4 className="text-white font-medium">Seasons ({seasonEpisodes.length})</h4>
                      <p className="text-xs text-slate-400">Add or remove seasons manually</p>
                    </div>
                    <div className="flex gap-2">
                       <button
                        type="button"
                        onClick={removeSeason}
                        disabled={seasonEpisodes.length === 0}
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
                  
                  {seasonEpisodes.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 pl-4 border-l-2 border-white/5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {seasonEpisodes.map((season, idx) => (
                        <div key={`season-${idx}`} className={`grid gap-3 ${type === "anime" ? "grid-cols-2" : "grid-cols-1"}`}>
                           {type === "anime" && (
                               <div className="relative">
                                   <label className="text-[10px] text-slate-500 absolute -top-2 left-2 bg-[#0a0a0a] px-1 rounded">Season {idx + 1} Name</label>
                                   <input
                                     type="text"
                                     placeholder="e.g. Final Season Part 2"
                                     value={season.name}
                                     onChange={(e) => {
                                       const newEps = [...seasonEpisodes];
                                       newEps[idx].name = e.target.value;
                                       setSeasonEpisodes(newEps);
                                     }}
                                     className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-[#3A0CA3]/50 focus:ring-1 focus:ring-[#3A0CA3]/20"
                                   />
                               </div>
                           )}
                           
                           <div className="relative">
                               <label className="text-[10px] text-slate-500 absolute -top-2 left-2 bg-[#0a0a0a] px-1 rounded">{type === "anime" ? "Episodes" : `Season ${idx + 1}`}</label>
                               <input
                                 type="number"
                                 placeholder="Episodes"
                                 value={season.episodes || ""}
                                 onChange={(e) => {
                                   const val = parseInt(e.target.value, 10);
                                   const newEps = [...seasonEpisodes];
                                   newEps[idx].episodes = isNaN(val) ? 0 : val;
                                   setSeasonEpisodes(newEps);
                                 }}
                                 className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-[#3A0CA3]/50 focus:ring-1 focus:ring-[#3A0CA3]/20"
                               />
                           </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Watching State */}
              <div>
                <select
                  value={watchingState}
                  onChange={(e) => setWatchingState(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-[#3A0CA3]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#3A0CA3]/20 appearance-none cursor-pointer"
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
                className="rounded-xl bg-[#3A0CA3] px-6 py-2.5 font-semibold text-white shadow-lg shadow-[#3A0CA3]/25 transition-all duration-200 hover:shadow-xl hover:shadow-[#3A0CA3]/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
