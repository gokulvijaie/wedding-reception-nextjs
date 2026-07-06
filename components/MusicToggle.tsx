"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Floating background-music control with platform-specific startup:
 *
 *  ┌─────────┬────────────────────────────────────────────────────────────┐
 *  │ iOS     │ Safari blocks ALL audio autoplay (even muted). Playback    │
 *  │         │ can only begin inside a user-gesture handler, so we do     │
 *  │         │ nothing on load and start on the first tap.                │
 *  ├─────────┼────────────────────────────────────────────────────────────┤
 *  │ Android │ Chrome ALLOWS muted autoplay. We start the track muted in  │
 *  │         │ the background, so the first tap only has to unmute —      │
 *  │         │ music is instant instead of starting from a cold buffer.   │
 *  ├─────────┼────────────────────────────────────────────────────────────┤
 *  │ Desktop │ Audible autoplay is usually permitted — play immediately,  │
 *  │         │ with the gesture unlock as fallback if the browser blocks. │
 *  └─────────┴────────────────────────────────────────────────────────────┘
 *
 * All paths share one gesture "unlock" that retries on every tap until
 * play() actually resolves (a single failed attempt must never give up).
 */
type Platform = "ios" | "android" | "desktop";

function detectPlatform(): Platform {
  const ua = navigator.userAgent || "";
  const isIOS =
    /iP(hone|ad|od)/.test(ua) ||
    // iPadOS 13+ masquerades as "Macintosh" but is a touch device
    (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  if (isIOS) return "ios";
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // In-DOM <audio> element (rendered below) rather than `new Audio()` —
    // several Android Chrome versions only play reliably from a real element.
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.35;

    // "playing" means AUDIBLE (not paused and not muted). volumechange fires
    // on mute/unmute so the icon stays correct on the Android muted path.
    const sync = () => setPlaying(!audio.paused && !audio.muted);
    audio.addEventListener("play", sync);
    audio.addEventListener("pause", sync);
    audio.addEventListener("volumechange", sync);

    const platform = detectPlatform();
    let warmupTimer: number | undefined;

    /* ── ANDROID ─────────────────────────────────────────────────────────
       Start muted (allowed) after a short delay so the 3.3 MB track doesn't
       compete with images on first load. First tap below just unmutes. */
    if (platform === "android") {
      audio.muted = true;
      warmupTimer = window.setTimeout(() => {
        audio.play().catch(() => {
          /* if even muted autoplay is blocked, the tap fallback handles it */
        });
      }, 2000);
    }

    /* ── DESKTOP ─────────────────────────────────────────────────────────
       Try audible autoplay right away. */
    if (platform === "desktop") {
      audio.muted = false;
      audio.play().catch(() => {});
    }

    /* ── iOS ─────────────────────────────────────────────────────────────
       Intentionally nothing on load: WebKit only permits playback started
       synchronously inside the gesture handler below. */

    /* ── shared first-gesture unlock ─────────────────────────────────────
       Unmute + play, retrying on EVERY gesture until play() resolves.
       Android: resolves instantly (already rolling muted) → just unmutes.
       iOS: starts playback fresh inside the gesture. */
    const events = ["touchend", "pointerup", "click", "keydown"] as const;
    const removeAll = () =>
      events.forEach((e) => document.removeEventListener(e, unlock));
    const unlock = () => {
      if (startedRef.current) return;
      audio.muted = false;
      audio
        .play()
        .then(() => {
          startedRef.current = true;
          removeAll();
        })
        .catch(() => {
          /* not yet — keep listening; the next tap retries */
        });
    };
    events.forEach((e) => document.addEventListener(e, unlock, { passive: true }));

    return () => {
      if (warmupTimer) window.clearTimeout(warmupTimer);
      audio.pause();
      audio.removeEventListener("play", sync);
      audio.removeEventListener("pause", sync);
      audio.removeEventListener("volumechange", sync);
      removeAll();
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused && !audio.muted) {
      audio.pause(); // audible → stop
    } else {
      audio.muted = false;
      audio.play().catch(() => {});
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={playing ? "Mute music" : "Play music"}
      title={playing ? "Mute music" : "Play music"}
      className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--gold)] bg-[var(--ivory-soft)]/90 text-[var(--navy)] shadow-lg backdrop-blur transition hover:scale-105"
    >
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} src="/assets/music.mp3" loop preload="none" playsInline />
      {/* soft pulse ring while playing */}
      {playing && (
        <span
          className="absolute inset-0 rounded-full border border-[var(--gold)]"
          style={{ animation: "pulseSoft 2.2s ease-in-out infinite" }}
        />
      )}

      {playing ? (
        <svg width="20" height="20" viewBox="0 0 24 24">
          <rect x="3.5" y="9" width="2.6" height="6" rx="1" fill="currentColor">
            <animate attributeName="height" values="6;15;6" dur="0.9s" repeatCount="indefinite" />
            <animate attributeName="y" values="9;4.5;9" dur="0.9s" repeatCount="indefinite" />
          </rect>
          <rect x="8.7" y="6" width="2.6" height="12" rx="1" fill="currentColor">
            <animate attributeName="height" values="12;4;12" dur="0.9s" begin="0.2s" repeatCount="indefinite" />
            <animate attributeName="y" values="6;10;6" dur="0.9s" begin="0.2s" repeatCount="indefinite" />
          </rect>
          <rect x="13.9" y="7.5" width="2.6" height="9" rx="1" fill="currentColor">
            <animate attributeName="height" values="9;16;9" dur="0.9s" begin="0.35s" repeatCount="indefinite" />
            <animate attributeName="y" values="7.5;4;7.5" dur="0.9s" begin="0.35s" repeatCount="indefinite" />
          </rect>
          <rect x="19.1" y="9" width="2.6" height="6" rx="1" fill="currentColor">
            <animate attributeName="height" values="6;13;6" dur="0.9s" begin="0.15s" repeatCount="indefinite" />
            <animate attributeName="y" values="9;5.5;9" dur="0.9s" begin="0.15s" repeatCount="indefinite" />
          </rect>
        </svg>
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 17.5a3 3 0 1 1-2-2.83V6l11-2.4v9.9a3 3 0 1 1-2-2.83V6.6L9 8.05v9.45z" />
        </svg>
      )}
    </button>
  );
}
