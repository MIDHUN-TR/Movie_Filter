"use client"
import { useState } from "react";

export default function Modal() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("movie");

  const isMovie = type === "movie";
  const isSeriesLike = ["series", "anime", "tv"].includes(type);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-white rounded-2xl bg-amber-600 px-6 py-2"
      >
        Add
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold">Add Content</h2>

            {/* TYPE */}
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="movie">Movie</option>
              <option value="series">Series</option>
              <option value="anime">Anime</option>
              <option value="tv">TV Show</option>
            </select>

            {/* COMMON FIELDS */}
            <input placeholder="Title" className="input" />
            <input placeholder="Poster Image URL" className="input" />
            <input placeholder="Genres" className="input" />
            <input placeholder="Cast" className="input" />
            <input placeholder="Original Language" className="input" />
            <input placeholder="Country of Origin" className="input" />

            {/* MOVIE ONLY */}
            {isMovie && (
              <>
                <input type="date" className="input" />
                <input placeholder="Runtime (minutes)" className="input" />
              </>
            )}

            {/* SERIES / ANIME / TV */}
            {isSeriesLike && (
              <>
                <input placeholder="No. of Seasons" className="input" />
                <input placeholder="No. of Episodes" className="input" />
                <input
                  placeholder="Watched Episodes"
                  className="input"
                  disabled
                />
                <input
                  placeholder="Completed"
                  className="input"
                  disabled
                />
              </>
            )}

            {/* ACTIONS */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-amber-600 text-white rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
