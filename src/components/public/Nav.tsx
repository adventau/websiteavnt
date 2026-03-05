// src/components/public/Nav.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface NavProps {
  brand: string;
  logoUrl?: string | null;
}

const links = [
  { label: "Metrics", href: "#metrics" },
  { label: "About", href: "#about" },
  { label: "Games", href: "#games" },
  { label: "Team", href: "#team" },
  { label: "Network", href: "#network" },
];

export default function Nav({ brand, logoUrl }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-strong shadow-lg shadow-purple-900/20" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          {logoUrl ? (
            <Image src={logoUrl} alt={brand} width={32} height={32} className="rounded" />
          ) : (
            <div className="w-8 h-8 rounded bg-avnt-purple flex items-center justify-center">
              <span className="font-display text-white font-bold text-sm">A</span>
            </div>
          )}
          <span className="font-display font-bold text-xl text-avnt-text group-hover:text-avnt-purple-light transition-colors">
            {brand}
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-avnt-muted hover:text-avnt-text transition-colors text-sm font-medium"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-avnt-muted hover:text-avnt-text"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass-strong border-t border-avnt-border px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-avnt-muted hover:text-avnt-text transition-colors text-sm font-medium py-2"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
