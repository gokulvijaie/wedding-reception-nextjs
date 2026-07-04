"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Ambient cinematic layer: gold petals drifting down + butterflies crossing the
 * screen. Pure CSS animation, pointer-events disabled so it never blocks taps.
 * Rendered only after mount so the randomised positions never cause an SSR /
 * client hydration mismatch.
 */
export default function Atmosphere() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const petals = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 8 + Math.random() * 14,
        duration: 12 + Math.random() * 14,
        delay: -Math.random() * 24,
        drift: (Math.random() * 2 - 1) * 90,
        opacity: 0.3 + Math.random() * 0.4,
        hue: Math.random() > 0.5 ? "var(--gold-soft)" : "var(--gold)",
      })),
    []
  );

  const butterflies = useMemo(
    () =>
      Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        top: 12 + Math.random() * 60,
        scale: 0.5 + Math.random() * 0.5,
        duration: 18 + Math.random() * 16,
        delay: -Math.random() * 30,
        dir: i % 2 === 0 ? "flyLR" : "flyRL",
        flap: 0.3 + Math.random() * 0.3,
      })),
    []
  );

  if (!mounted) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5] overflow-hidden"
    >
      {petals.map((p) => (
        <span
          key={`petal-${p.id}`}
          style={
            {
              position: "absolute",
              top: "-6vh",
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              background: p.hue,
              borderRadius: "60% 0 60% 0",
              filter: "blur(0.3px)",
              "--p-drift": `${p.drift}px`,
              "--p-opacity": p.opacity,
              animation: `drift ${p.duration}s linear ${p.delay}s infinite`,
            } as React.CSSProperties
          }
        />
      ))}

      {butterflies.map((b) => (
        <span
          key={`bf-${b.id}`}
          style={{
            position: "absolute",
            top: `${b.top}%`,
            left: 0,
            animation: `${b.dir} ${b.duration}s linear ${b.delay}s infinite`,
          }}
        >
          <span
            style={{
              display: "inline-block",
              transform: `scale(${b.scale})`,
            }}
          >
            <span
              style={{
                display: "inline-block",
                animation: `flutter ${b.flap}s ease-in-out infinite`,
              }}
            >
              <Butterfly />
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}

function Butterfly() {
  return (
    <svg width="26" height="22" viewBox="0 0 26 22" fill="none">
      <path
        d="M13 11C10 3 4 1 2 4c-2 3 1 8 6 8-5 0-7 5-5 7 2 3 8 0 10-5"
        fill="var(--gold-soft)"
        opacity="0.85"
      />
      <path
        d="M13 11c3-8 9-10 11-7 2 3-1 8-6 8 5 0 7 5 5 7-2 3-8 0-10-5"
        fill="var(--gold)"
        opacity="0.85"
      />
      <line x1="13" y1="5" x2="13" y2="17" stroke="var(--navy)" strokeWidth="0.8" />
    </svg>
  );
}
