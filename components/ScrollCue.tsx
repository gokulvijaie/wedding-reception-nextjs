"use client";

import { useEffect, useState } from "react";

/**
 * Sleek "scroll for more" indicator, fixed to the bottom-centre of the first
 * screen: a soft gold label, a downward chevron that gently bobs, and a thin
 * line that draws down and fades — signalling there's more below without
 * shouting. Fades in on load, and fades out for good once the guest scrolls.
 */
export default function ScrollCue() {
  const [shown, setShown] = useState(false); // faded in after load
  const [scrolled, setScrolled] = useState(false); // gone once user scrolls

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 1400);
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
        window.scrollTo({ top: window.innerHeight * 0.92, behavior: "smooth" })
      }
      className={`group fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-700 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <span className="font-caps text-[0.55rem] tracking-[0.35em] text-[var(--gold-deep)]">
        SCROLL
      </span>

      <svg
        width="26"
        height="40"
        viewBox="0 0 26 40"
        fill="none"
        className="overflow-visible text-[var(--gold)]"
        aria-hidden
      >
        {/* thin guide line that draws down and fades, on a loop */}
        <line
          x1="13"
          y1="0"
          x2="13"
          y2="22"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.55"
          style={{ animation: "cueLine 2.4s cubic-bezier(0.4,0,0.2,1) infinite" }}
        />

        {/* double chevron — outer faint, inner solid — bobbing downward */}
        <g style={{ animation: "cueBob 2.4s cubic-bezier(0.4,0,0.2,1) infinite" }}>
          <path
            d="M5 20 L13 28 L21 20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.35"
          />
          <path
            d="M5 26 L13 34 L21 26"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:translate-y-[3px]"
          />
        </g>
      </svg>
    </button>
  );
}
