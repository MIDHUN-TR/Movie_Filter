"use client";

import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-[#050505] shadow-md border-b border-[#3A0CA3]/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:px-6">

        {/* Brand */}
        <h1 className="text-lg md:text-2xl font-bold text-white tracking-wide">
          🎬 Movie Filter App
        </h1>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-[#3A0CA3]/20 transition"
          aria-label="Toggle navigation"
          onClick={() => setIsOpen((prev) => !prev)}
        >
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
    </header>
  );
}
