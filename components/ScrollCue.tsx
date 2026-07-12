"use client";

import { useEffect, useState } from "react";

/**
 * "Scroll for more" indicator, fixed to the bottom-centre of the viewport so it
 * is visible on every device regardless of how tall the hero content is. A gold
 * "SCROLL" label above a bold downward chevron that bounces over a soft pulsing
 * glow. Fades in on load, and fades out once the guest starts scrolling.
 */
export default function ScrollCue() {
  const [shown, setShown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 1200);
    const onScroll = () => {
      if (window.scrollY > 40) setScrolled(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const visible = shown && !scrolled;

  return (
    <button
      type="button"
      aria-label="Scroll down for more"
      onClick={() =>
        window.scrollTo({ top: window.innerHeight * 0.9, behavior: "smooth" })
      }
      className={`group fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-1.5 transition-opacity duration-700 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <span className="rounded-full bg-[var(--ivory)]/55 px-2 py-0.5 font-caps text-[0.6rem] tracking-[0.4em] text-[var(--gold-deep)] backdrop-blur-sm">
        SCROLL
      </span>

      <span className="relative flex h-10 w-10 items-center justify-center">
        {/* pulsing glow ring behind the arrow for visibility */}
        <span
          className="absolute inset-0 rounded-full bg-[var(--gold)]/30"
          style={{ animation: "cueGlow 1.8s ease-in-out infinite" }}
        />
        {/* bouncing double chevron */}
        <svg
          width="28"
          height="32"
          viewBox="0 0 30 34"
          fill="none"
          className="relative text-[var(--gold)] drop-shadow-[0_2px_6px_rgba(201,157,78,0.6)] transition-transform duration-300 group-hover:translate-y-1"
          style={{ animation: "cueBounce 1.6s cubic-bezier(0.45,0,0.25,1) infinite" }}
          aria-hidden
        >
          <path
            d="M6 8 L15 17 L24 8"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.4"
          />
          <path
            d="M6 17 L15 26 L24 17"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}
