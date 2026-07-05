"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Ambient cinematic layer: gold petals drifting down + butterflies crossing the
 * screen. Uses the Web Animations API with concrete keyframe values (rather than
 * CSS keyframes that reference CSS variables) because iOS Safari / WebKit does
 * not reliably animate var() inside @keyframes — that left the petals frozen on
 * iPhones. Rendered only after mount to avoid an SSR hydration mismatch, and
 * skipped entirely when the user prefers reduced motion.
 */
export default function Atmosphere() {
  // Only gate on mount (to avoid an SSR hydration mismatch). We intentionally do
  // NOT skip on prefers-reduced-motion: iOS reports reduced-motion whenever Low
  // Power Mode is on, which was silently disabling the whole ambient layer on
  // many iPhones. These are decorative, WAAPI-driven, and pointer-events-none.
  const [enabled, setEnabled] = useState(false);
  useEffect(() => setEnabled(true), []);

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
        dir: (i % 2 === 0 ? "lr" : "rl") as "lr" | "rl",
        flap: 0.3 + Math.random() * 0.3,
      })),
    []
  );

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      {petals.map((p) => (
        <Petal key={`petal-${p.id}`} {...p} />
      ))}
      {butterflies.map((b) => (
        <FlyingButterfly key={`bf-${b.id}`} {...b} />
      ))}
    </div>
  );
}

function Petal(p: {
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
  hue: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const startY = -80;
    const endY = window.innerHeight + 140;
    // Every keyframe carries a transform (some WebKit versions mis-interpolate
    // transform when only a subset of keyframes define it).
    const at = (t: number) => ({
      offset: t,
      transform: `translate(${(p.drift * t).toFixed(1)}px, ${(
        startY +
        (endY - startY) * t
      ).toFixed(1)}px) rotate(${Math.round(360 * t)}deg)`,
      opacity: t === 0 || t === 1 ? 0 : p.opacity,
    });
    const anim = el.animate([at(0), at(0.12), at(0.88), at(1)], {
      duration: p.duration * 1000,
      delay: p.delay * 1000, // negative → starts mid-flight
      iterations: Infinity,
      easing: "linear",
    });
    return () => anim.cancel();
  }, [p.duration, p.delay, p.drift, p.opacity]);

  return (
    <span
      ref={ref}
      style={{
        position: "absolute",
        top: 0,
        left: `${p.left}%`,
        width: p.size,
        height: p.size,
        background: p.hue,
        borderRadius: "60% 0 60% 0",
        filter: "blur(0.3px)",
        opacity: 0,
      }}
    />
  );
}

function FlyingButterfly(b: {
  top: number;
  scale: number;
  duration: number;
  delay: number;
  dir: "lr" | "rl";
  flap: number;
}) {
  const flyRef = useRef<HTMLSpanElement>(null);
  const flutRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const startX = b.dir === "lr" ? -70 : w + 70;
    const endX = b.dir === "lr" ? w + 70 : -70;
    const endY = -h * 0.08;
    const at = (t: number) => ({
      offset: t,
      transform: `translate(${(startX + (endX - startX) * t).toFixed(1)}px, ${(
        endY * t
      ).toFixed(1)}px)`,
      opacity: t === 0 || t === 1 ? 0 : 0.8,
    });

    const fly = flyRef.current?.animate([at(0), at(0.08), at(0.92), at(1)], {
      duration: b.duration * 1000,
      delay: b.delay * 1000,
      iterations: Infinity,
      easing: "linear",
    });

    const flutter = flutRef.current?.animate(
      [{ transform: "scaleX(1)" }, { transform: "scaleX(0.4)" }, { transform: "scaleX(1)" }],
      { duration: b.flap * 1000, iterations: Infinity, easing: "ease-in-out" }
    );

    return () => {
      fly?.cancel();
      flutter?.cancel();
    };
  }, [b.dir, b.duration, b.delay, b.flap]);

  return (
    <span ref={flyRef} style={{ position: "absolute", top: `${b.top}%`, left: 0, opacity: 0 }}>
      <span
        style={{
          display: "inline-block",
          transform: `scale(${b.scale})${b.dir === "rl" ? " scaleX(-1)" : ""}`,
        }}
      >
        <span ref={flutRef} style={{ display: "inline-block" }}>
          <Butterfly />
        </span>
      </span>
    </span>
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
