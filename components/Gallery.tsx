"use client";

import { useCallback, useEffect, useState } from "react";
import { config } from "@/lib/config";
import Monogram from "./Monogram";

// Placeholder gradients used until real photos are dropped in.
const FRAMES = [
  "linear-gradient(155deg, #2a3a63, #1a2c5b 60%, #101b3a)",
  "linear-gradient(155deg, #c9a45e, #a9823c 60%, #7c5e26)",
  "linear-gradient(155deg, #6b88a3, #44607c 60%, #2c4259)",
  "linear-gradient(155deg, #3a4a73, #26396b 60%, #18254a)",
  "linear-gradient(155deg, #b88a4a, #8f6a32 60%, #5e4520)",
  "linear-gradient(155deg, #4a5d86, #324871 60%, #1f3050)",
];

// Per-tile sizing for a gentle mosaic (some tiles taller / wider).
export default function Gallery() {
  const { engagement, couple } = config;
  const photos = engagement.photos;
  const [open, setOpen] = useState<number | null>(null);

  const hasImage = (i: number) => !!photos[i]?.image;
  const realIndexes = photos.map((p, i) => (p.image ? i : -1)).filter((i) => i >= 0);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: number) => {
      setOpen((cur) => {
        if (cur === null || realIndexes.length === 0) return cur;
        const pos = realIndexes.indexOf(cur);
        const next = (pos + dir + realIndexes.length) % realIndexes.length;
        return realIndexes[next];
      });
    },
    [realIndexes]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  return (
    <section className="relative overflow-hidden py-24">
      <picture>
        <source media="(min-width: 768px)" srcSet="/assets/story-bg-desktop-CgovZBCa.webp" />
        <img src="/assets/story-bg-desktop-CgovZBCa.webp" alt="" className="absolute inset-0 h-full w-full object-cover opacity-15" />
      </picture>
      <div className="absolute inset-0 bg-[var(--ivory)]/85" />

      <div className="relative mx-auto max-w-4xl px-6">
        <header className="mb-12 text-center">
          <p className="eyebrow on-scroll">{engagement.eyebrow}</p>
          <h2 className="mt-3 whitespace-pre-line font-display text-4xl font-light leading-tight text-[var(--navy)] on-scroll sm:text-5xl">
            {engagement.title}
          </h2>
          <div className="mx-auto mt-4 flex w-44 items-center gap-3 on-scroll">
            <span className="gold-line flex-1" />
            <span className="text-[var(--gold)]">&#10047;</span>
            <span className="gold-line flex-1" />
          </div>
          <p className="mt-4 font-display text-lg italic text-[var(--navy-muted)] on-scroll">
            {engagement.subtitle}
          </p>
        </header>

        {/* Featured highlight film — click to play, with sound + controls */}
        {engagement.film && (
          <figure className="mb-12 on-scroll">
            <div className="overflow-hidden rounded-2xl border border-[var(--gold)]/40 shadow-[0_18px_50px_-24px_rgba(26,44,91,0.6)]">
              <video
                src={engagement.film.src}
                poster={engagement.film.poster}
                className="block h-auto w-full bg-black"
                controls
                muted
                playsInline
                preload="none"
              />
            </div>
            <figcaption className="mt-3 text-center font-script text-2xl text-[var(--gold-deep)]">
              {engagement.film.caption}
            </figcaption>
          </figure>
        )}

        {/* Masonry: each photo keeps its natural aspect ratio (fully visible,
            no cropping) and flows into responsive columns. */}
        <div className="columns-2 gap-3 sm:gap-4 lg:columns-3">
          {engagement.clips.map((clip) => (
            <div
              key={clip.src}
              className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl border border-[var(--gold)]/40 shadow-[0_12px_30px_-18px_rgba(26,44,91,0.5)] on-scroll sm:mb-4"
            >
              <video
                ref={(el) => {
                  if (el) el.muted = true;
                }}
                src={clip.src}
                className="block h-auto w-full"
                muted
                autoPlay
                loop
                playsInline
                preload="metadata"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 pb-2 pt-8 text-left">
                <span className="font-script text-lg text-[var(--ivory)]">
                  {clip.caption}
                </span>
              </span>
            </div>
          ))}
          {photos.map((photo, i) => {
            const clickable = hasImage(i);
            return (
              <button
                key={i}
                type="button"
                onClick={() => clickable && setOpen(i)}
                className={`group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl border border-[var(--gold)]/40 shadow-[0_12px_30px_-18px_rgba(26,44,91,0.5)] on-scroll sm:mb-4 ${
                  clickable ? "cursor-zoom-in" : "cursor-default"
                }`}
                data-delay={(i % 3) * 90}
                aria-label={clickable ? `View photo: ${photo.caption}` : photo.caption}
              >
                {photo.image ? (
                  <img
                    src={photo.image}
                    alt={photo.caption}
                    loading="lazy"
                    className="block h-auto w-full transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                ) : (
                  <span
                    className="flex aspect-[3/4] w-full items-center justify-center"
                    style={{ background: FRAMES[i % FRAMES.length] }}
                  >
                    <Monogram tone="ivory" className="w-1/2 max-w-[88px] opacity-80" />
                  </span>
                )}

                {/* caption overlay */}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 pb-2 pt-8 text-left">
                  <span className="font-script text-lg text-[var(--ivory)]">{photo.caption}</span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-12 text-center font-script text-2xl text-[var(--gold-deep)] on-scroll">
          &ldquo;{engagement.caption}&rdquo;
        </p>
      </div>

      {/* Lightbox */}
      {open !== null && photos[open]?.image && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          style={{ animation: "fadeIn 0.3s ease" }}
          onClick={close}
        >
          <button
            onClick={close}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--gold)] text-[var(--ivory)] transition hover:bg-[var(--gold)] hover:text-[var(--navy)]"
          >
            &#10005;
          </button>

          {realIndexes.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); step(-1); }}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--gold)] text-[var(--ivory)] transition hover:bg-[var(--gold)] hover:text-[var(--navy)]"
              >
                &#8592;
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); step(1); }}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--gold)] text-[var(--ivory)] transition hover:bg-[var(--gold)] hover:text-[var(--navy)]"
              >
                &#8594;
              </button>
            </>
          )}

          <figure className="max-h-[88vh] max-w-[92vw]" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[open].image as string}
              alt={photos[open].caption}
              className="mx-auto max-h-[80vh] rounded-lg object-contain shadow-2xl"
              style={{ animation: "scaleIn 0.35s cubic-bezier(0.16,1,0.3,1)" }}
            />
            <figcaption className="mt-4 text-center font-script text-2xl text-[var(--gold-soft)]">
              {photos[open].caption}
            </figcaption>
          </figure>
        </div>
      )}

      <span className="sr-only">{couple.groom} &amp; {couple.bride} engagement gallery</span>
    </section>
  );
}
