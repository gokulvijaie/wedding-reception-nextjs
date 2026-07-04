"use client";

import { useCallback, useRef, useState } from "react";
import { config } from "@/lib/config";

type Status = "idle" | "sending" | "done" | "error";

export default function RSVP() {
  const { rsvp } = config;
  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [name, setName] = useState("");
  const [guests, setGuests] = useState("1");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const confettiHost = useRef<HTMLDivElement | null>(null);

  const burst = useCallback(() => {
    const host = confettiHost.current;
    if (!host) return;
    const colors = ["#c99d4e", "#dcc188", "#1a2c5b", "#99bdd3", "#fdfbf7"];
    for (let i = 0; i < 80; i++) {
      const p = document.createElement("span");
      const size = 6 + Math.random() * 8;
      p.style.cssText = `position:absolute;top:40%;left:50%;width:${size}px;height:${
        size * 0.6
      }px;background:${colors[i % colors.length]};border-radius:2px;pointer-events:none;`;
      host.appendChild(p);
      const angle = Math.random() * Math.PI * 2;
      const dist = 120 + Math.random() * 260;
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist - 120;
      p.animate(
        [
          { transform: "translate(-50%,-50%) rotate(0deg)", opacity: 1 },
          {
            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${
              Math.random() * 720
            }deg)`,
            opacity: 0,
          },
        ],
        { duration: 1400 + Math.random() * 900, easing: "cubic-bezier(0.1,0.7,0.2,1)" }
      ).onfinish = () => p.remove();
    }
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!attending) {
      setError("Please let us know if you'll be attending.");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, attending, guests, message }),
      });
      if (!res.ok) throw new Error("save failed");
      setStatus("done");
      if (attending === "yes") burst();
    } catch {
      setStatus("error");
      setError("Could not send RSVP. Please try again.");
    }
  };

  return (
    <section id="rsvp" className="relative overflow-hidden py-24">
      <picture>
        <source media="(min-width: 768px)" srcSet="/assets/rsvp-bg-desktop-DWfTKjol.webp" />
        <img src="/assets/rsvp-bg-I-N3en4m.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
      </picture>
      <div className="absolute inset-0 bg-[var(--ivory)]/80" />

      <div ref={confettiHost} className="pointer-events-none absolute inset-0 z-20" />

      <div className="relative z-10 mx-auto max-w-lg px-6 text-center">
        <p className="eyebrow on-scroll">{rsvp.eyebrow}</p>
        <h2 className="mt-3 font-display text-3xl font-light italic leading-snug text-[var(--navy)] on-scroll sm:text-4xl">
          {rsvp.title}
        </h2>
        <p className="mt-2 font-display text-lg text-[var(--navy-muted)] on-scroll">
          {rsvp.subtitle}
        </p>

        {status === "done" ? (
          <div className="mt-10 rounded-2xl border border-[var(--gold)]/40 bg-[var(--card)] px-8 py-12 shadow-lg on-scroll">
            <div className="font-script text-5xl text-[var(--gold)]">Thank you!</div>
            <p className="mt-4 font-display text-xl text-[var(--navy)]">
              {attending === "yes"
                ? "Your presence will make our day complete. We can't wait to celebrate with you!"
                : "We'll miss you dearly — thank you for letting us know. You'll be in our hearts."}
            </p>
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="mt-10 space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--card)]/90 px-7 py-8 text-left shadow-[0_20px_60px_-30px_rgba(26,44,91,0.5)] backdrop-blur on-scroll"
          >
            <div>
              <label className="mb-2 block font-caps text-[0.6rem] tracking-[0.3em] text-[var(--gold-deep)]">
                FULL NAME
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-lg border border-[var(--border)] bg-white/70 px-4 py-3 font-display text-lg text-[var(--navy)] outline-none transition focus:border-[var(--gold)]"
              />
            </div>

            <div>
              <span className="mb-2 block font-caps text-[0.6rem] tracking-[0.3em] text-[var(--gold-deep)]">
                WILL YOU BE ATTENDING?
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAttending("yes")}
                  className={`rounded-lg border px-3 py-3 font-display text-base transition ${
                    attending === "yes"
                      ? "border-[var(--gold)] bg-[var(--gold)] text-white"
                      : "border-[var(--border)] bg-white/60 text-[var(--navy)] hover:border-[var(--gold)]"
                  }`}
                >
                  Joyfully Accept
                </button>
                <button
                  type="button"
                  onClick={() => setAttending("no")}
                  className={`rounded-lg border px-3 py-3 font-display text-base transition ${
                    attending === "no"
                      ? "border-[var(--navy)] bg-[var(--navy)] text-white"
                      : "border-[var(--border)] bg-white/60 text-[var(--navy)] hover:border-[var(--navy)]"
                  }`}
                >
                  Regretfully Decline
                </button>
              </div>
            </div>

            {attending === "yes" && (
              <div>
                <label className="mb-2 block font-caps text-[0.6rem] tracking-[0.3em] text-[var(--gold-deep)]">
                  NO. OF GUESTS ATTENDING
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-white/70 px-4 py-3 font-display text-lg text-[var(--navy)] outline-none focus:border-[var(--gold)]"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "guest" : "guests"}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="mb-2 block font-caps text-[0.6rem] tracking-[0.3em] text-[var(--gold-deep)]">
                A MESSAGE FOR THE COUPLE
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Share your wishes…"
                className="w-full resize-none rounded-lg border border-[var(--border)] bg-white/70 px-4 py-3 font-display text-lg text-[var(--navy)] outline-none transition focus:border-[var(--gold)]"
              />
            </div>

            {error && (
              <p className="text-center font-display text-base text-[#c0392b]">{error}</p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-full bg-[var(--navy)] py-4 font-caps text-sm tracking-[0.3em] text-[var(--ivory)] transition hover:bg-[var(--gold)] hover:text-[var(--navy)] disabled:opacity-60"
            >
              {status === "sending" ? "SENDING…" : "SEND WISHES"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
