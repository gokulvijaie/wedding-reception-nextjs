"use client";

import { useEffect, useRef, useState } from "react";
import { config } from "@/lib/config";
import Monogram from "./Monogram";

const FRAMES = [
  "linear-gradient(160deg, #2a3a63 0%, #1a2c5b 60%, #101b3a 100%)",
  "linear-gradient(160deg, #c9a45e 0%, #a9823c 60%, #7c5e26 100%)",
  "linear-gradient(160deg, #6b88a3 0%, #44607c 60%, #2c4259 100%)",
  "linear-gradient(160deg, #3a4a73 0%, #26396b 60%, #18254a 100%)",
];

const SWIPE_THRESHOLD = 60; // px of horizontal drag needed to commit a swipe
const FLY_MS = 460; // how long the top card flies before the stack advances

// Springy rise for the card coming forward (slight overshoot = natural spring).
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
// Ease-out for the rejected card flying away.
const FLY = "cubic-bezier(0.3, 0.55, 0.4, 1)";

type Moment = (typeof config.story.moments)[number];

function CardFigure({ moment, frame }: { moment: Moment; frame: string }) {
  return (
    <figure className="relative rotate-[-2deg] rounded-sm bg-white p-3 pb-12 shadow-[0_18px_50px_-12px_rgba(26,44,91,0.45)]">
      <div
        className="relative flex aspect-[4/5] items-center justify-center overflow-hidden"
        style={{ background: moment.image ? undefined : frame }}
      >
        {moment.image ? (
          <img
            src={moment.image}
            alt={moment.caption}
            draggable={false}
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <Monogram tone="ivory" className="w-1/2 opacity-80" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
      <figcaption className="absolute inset-x-0 bottom-3 text-center font-script text-xl text-[var(--navy)]">
        {moment.caption}
      </figcaption>
    </figure>
  );
}

export default function Story() {
  const { story } = config;
  const total = story.moments.length;
  const [active, setActive] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [leaving, setLeaving] = useState<{ dir: 1 | -1 } | null>(null);
  const startX = useRef<number | null>(null);
  const leaveTimer = useRef<number | undefined>(undefined);
  const moment = story.moments[active];

  useEffect(() => () => window.clearTimeout(leaveTimer.current), []);

  /**
   * Fly the top card off in `dir`, then advance the stack. The card behind
   * rises into the main position via its transform transition.
   */
  const commit = (target: number, dir: 1 | -1) => {
    if (leaving) return;
    setDragging(false);
    setDragX(0);
    setLeaving({ dir });
    leaveTimer.current = window.setTimeout(() => {
      setActive(((target % total) + total) % total);
      setLeaving(null);
    }, FLY_MS);
  };
  const next = () => commit(active + 1, -1); // reject to the left
  const prev = () => commit(active - 1, 1); // toss back to the right

  /* ── swipe handling (pointer events cover touch + mouse) ─────────────── */
  const onPointerDown = (e: React.PointerEvent) => {
    if (leaving) return;
    startX.current = e.clientX;
    setDragging(true);
    try {
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    } catch {
      /* synthetic events may lack a real pointerId */
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || startX.current === null) return;
    setDragX(e.clientX - startX.current);
  };
  const endDrag = () => {
    if (!dragging) return;
    const dx = dragX;
    startX.current = null;
    if (dx <= -SWIPE_THRESHOLD) {
      commit(active + 1, -1);
    } else if (dx >= SWIPE_THRESHOLD) {
      commit(active - 1, 1);
    } else {
      // below threshold → spring back to centre
      setDragging(false);
      setDragX(0);
    }
  };

  return (
    <section className="relative overflow-hidden py-24">
      <picture>
        <source media="(min-width: 768px)" srcSet="/assets/story-bg-desktop-CgovZBCa.webp" />
        <img src="/assets/story-bg-desktop-CgovZBCa.webp" alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
      </picture>
      <div className="absolute inset-0 bg-[var(--ivory)]/80" />

      <div className="relative mx-auto max-w-5xl px-6">
        <header className="mb-12 text-center">
          <p className="eyebrow on-scroll">{story.eyebrow}</p>
          <h2 className="mt-3 whitespace-pre-line font-display text-4xl font-light leading-tight text-[var(--navy)] on-scroll sm:text-5xl">
            {story.title}
          </h2>
        </header>

        <div className="grid items-center gap-10 md:grid-cols-2">
          {/* Polaroid card stack — swipe the top card away */}
          <div className="on-scroll flex justify-center">
            <div
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              className="relative w-[78%] max-w-xs cursor-grab select-none active:cursor-grabbing"
              style={{ touchAction: "pan-y" }}
            >
              {/* invisible spacer gives the absolute stack its height */}
              <div className="invisible" aria-hidden>
                <CardFigure moment={story.moments[0]} frame={FRAMES[0]} />
              </div>

              {story.moments.map((m, i) => {
                const depth = (i - active + total) % total;
                const isTop = depth === 0;
                const maxDepth = total - 1;

                let transform: string;
                let transition: string;
                let opacity = 1;

                if (isTop) {
                  if (leaving) {
                    // reject: fly off with a natural tilt, fading late
                    transform = `translateX(${leaving.dir * 560}px) rotate(${leaving.dir * 28}deg)`;
                    transition = `transform ${FLY_MS + 90}ms ${FLY}, opacity 0.38s ease 0.12s`;
                    opacity = 0;
                  } else if (dragging) {
                    // follow the finger, tilting with the drag
                    transform = `translateX(${dragX}px) rotate(${dragX * 0.06}deg)`;
                    transition = "none";
                  } else {
                    // spring back to centre (also the landing state after rising)
                    transform = "translateX(0px) rotate(0deg)";
                    transition = `transform 0.55s ${SPRING}`;
                  }
                } else {
                  // stacked behind: nudged down, slightly smaller, scattered tilt
                  transform = `translateY(${depth * 13}px) scale(${1 - depth * 0.05}) rotate(${i % 2 ? 2.4 : -2.4}deg)`;
                  opacity = depth <= 2 ? 1 : 0;
                  transition =
                    depth === maxDepth
                      ? "none" // teleport invisibly to the back of the stack
                      : `transform 0.55s ${SPRING}, opacity 0.35s ease`;
                }

                return (
                  <div
                    key={i}
                    className="absolute inset-x-0 top-0"
                    style={{
                      zIndex: isTop ? 40 : 30 - depth,
                      transform,
                      transition,
                      opacity,
                      willChange: "transform",
                    }}
                  >
                    <CardFigure moment={m} frame={FRAMES[i % FRAMES.length]} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Story copy — keyed so it animates in with each slide */}
          <div className="on-scroll text-center md:text-left" data-delay={120}>
            <div
              key={active}
              style={{ animation: "storyTextIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.12s both" }}
            >
              <p className="font-caps text-xs tracking-[0.3em] text-[var(--gold-deep)]">
                {moment.date}
              </p>
              <h3 className="mt-2 font-display text-3xl font-light italic text-[var(--navy)]">
                {moment.title}
              </h3>
              <p className="mt-4 font-display text-lg leading-relaxed text-[var(--navy-muted)]">
                {moment.text}
              </p>
            </div>

            <div className="mt-8 flex items-center justify-center gap-5 md:justify-start">
              <button
                onClick={prev}
                aria-label="Previous photo"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--gold)] text-[var(--navy)] transition hover:bg-[var(--gold)] hover:text-white"
              >
                &#8592;
              </button>

              <div className="flex gap-2">
                {story.moments.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => i !== active && commit(i, i > active ? -1 : 1)}
                    aria-label={`Go to moment ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === active ? "w-6 bg-[var(--gold)]" : "w-2 bg-[var(--border)]"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                aria-label="Next photo"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--gold)] text-[var(--navy)] transition hover:bg-[var(--gold)] hover:text-white"
              >
                &#8594;
              </button>
            </div>

            <p className="mt-4 font-caps text-[0.55rem] tracking-[0.3em] text-[var(--navy-muted)]/70 md:hidden">
              SWIPE THE PHOTO TO EXPLORE
            </p>
          </div>
        </div>

        <p className="mt-12 text-center font-script text-2xl text-[var(--gold-deep)] on-scroll">
          &ldquo;{story.caption}&rdquo;
        </p>
      </div>
    </section>
  );
}
