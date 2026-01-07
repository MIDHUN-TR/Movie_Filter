"use client";

import { useState } from "react";

const navItems = [
  "Home",
  "Search",
  "Pending",
  "Watched",
  "Watching",
  "Series",
  "Movies",
  "TV Shows",
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-orange-600 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:px-6">

        {/* Brand */}
        <h1 className="text-lg md:text-2xl font-bold text-white tracking-wide">
          🎬 Movie Filter App
        </h1>

        {/* Desktop Nav */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm md:text-base text-white font-medium">
            {navItems.map((item) => (
              <li
                key={item}
                className="cursor-pointer hover:text-black hover:bg-white/25 px-3 py-1 rounded-md transition"
              >
                {item}
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/20 transition"
          aria-label="Toggle navigation"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {/* Simple hamburger / close icon using spans */}
          <div className="space-y-1">
            <span
              className={`block h-[2px] w-6 bg-white transition-transform ${
                isOpen ? "translate-y-[5px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-6 bg-white transition-opacity ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-[2px] w-6 bg-white transition-transform ${
                isOpen ? "-translate-y-[5px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <nav className="md:hidden border-t border-orange-500/60 bg-orange-600/95">
          <ul className="flex flex-col px-4 py-3 gap-1 text-white text-sm">
            {navItems.map((item) => (
              <li
                key={item}
                className="cursor-pointer rounded-lg px-3 py-2 hover:bg-white/20 transition"
              >
                {item}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
