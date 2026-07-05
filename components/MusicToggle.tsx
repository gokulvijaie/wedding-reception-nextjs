"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Floating background-music control, styled after the reference site: a gold
 * circular button fixed in the corner that toggles a looping track. Autoplay is
 * attempted on load and again on the first interaction (browsers block
 * unprompted audio). Drop a licensed track at /public/assets/music.mp3.
 */
export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // Use the in-DOM <audio> element (rendered below) rather than `new Audio()`
    // — several Android Chrome versions only play reliably from a real element.
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.35;

    // Keep the button icon in sync even if playback stops for any reason.
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    const start = () => {
      audio.play().catch(() => {
        /* still blocked — the corner button remains as the manual fallback */
      });
    };

    // Try immediately (desktop), then start on the first real user gesture.
    // Android Chrome / iOS only allow audio from inside a gesture handler, so
    // call play() directly and cover taps, touches and scrolls.
    start();
    const onFirstInteract = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      start();
      remove();
    };
    const remove = () => {
      window.removeEventListener("pointerdown", onFirstInteract);
      window.removeEventListener("touchstart", onFirstInteract);
      window.removeEventListener("click", onFirstInteract);
    };
    window.addEventListener("pointerdown", onFirstInteract);
    window.addEventListener("touchstart", onFirstInteract, { passive: true });
    window.addEventListener("click", onFirstInteract);

    return () => {
      audio.pause();
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
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
      <audio ref={audioRef} src="/assets/music.mp3" loop preload="auto" playsInline />
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
