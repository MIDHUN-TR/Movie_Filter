"use client";
import Modal from "./AddButton";

interface HeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export default function Header({ searchQuery, onSearchChange }: HeaderProps) {
    return (
        <div className="w-full py-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                {/* Search Bar */}
                <div className="relative w-full max-w-xl group">
                    {/* Glow effect on focus */}
                    <div className="absolute -inset-0.5 rounded-2xl bg-[#3A0CA3] opacity-0 blur-md transition-all duration-300 group-focus-within:opacity-40" />

                    <div className="relative flex items-center">
                        <svg
                            className="absolute left-4 h-5 w-5 text-slate-400 transition-colors duration-200 group-focus-within:text-[#3A0CA3]"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="search"
                            name="search"
                            id="search"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="h-14 w-full rounded-2xl border border-white/5 bg-[#050505] pl-12 pr-12 text-white backdrop-blur-sm placeholder:text-slate-500 transition-all duration-300 focus:border-[#3A0CA3]/50 focus:bg-[#050505] focus:outline-none focus:ring-2 focus:ring-[#3A0CA3]/30"
                            placeholder="Search movies, series, anime..."
                        />
                        {/* Clear button */}
                        {searchQuery && (
                            <button
                                onClick={() => onSearchChange("")}
                                className="absolute right-4 flex items-center justify-center h-6 w-6 rounded-full bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white transition-all duration-200"
                                aria-label="Clear search"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                        {/* Keyboard shortcut hint — hidden when search has text */}
                        {!searchQuery && (
                            <div className="absolute right-4 hidden items-center gap-1 sm:flex">
                                <kbd className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-500">
                                    ⌘K
                                </kbd>
                            </div>
                        )}
                    </div>
                </div>

                {/* Add Button */}
                <Modal />
            </div>
        </div>
    );
}