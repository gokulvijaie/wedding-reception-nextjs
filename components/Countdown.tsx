"use client";

import { useEffect, useState } from "react";
import { config } from "@/lib/config";

function diff(target: number) {
  const now = Date.now();
  let d = Math.max(0, target - now);
  const days = Math.floor(d / 86400000);
  d -= days * 86400000;
  const hours = Math.floor(d / 3600000);
  d -= hours * 3600000;
  const minutes = Math.floor(d / 60000);
  d -= minutes * 60000;
  const seconds = Math.floor(d / 1000);
  return { days, hours, minutes, seconds };
}

export default function Countdown() {
  const target = new Date(config.weddingDateISO).getTime();
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setT(diff(target));
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units = [
    { label: "Days", value: t?.days },
    { label: "Hours", value: t?.hours },
    { label: "Minutes", value: t?.minutes },
    { label: "Seconds", value: t?.seconds },
  ];

  return (
    <section className="relative bg-[var(--navy)] py-20 text-[var(--ivory)]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, var(--gold) 0, transparent 40%), radial-gradient(circle at 80% 70%, var(--gold) 0, transparent 40%)" }} />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <p className="eyebrow on-scroll" style={{ color: "var(--gold-soft)" }}>
          {config.countdown.eyebrow}
        </p>
        <h2 className="mt-3 font-script text-4xl text-[var(--gold-soft)] on-scroll sm:text-5xl">
          {config.countdown.title}
        </h2>
        <p className="mt-2 font-display text-lg italic text-[var(--ivory)]/70 on-scroll">
          {config.countdown.subtitle}
        </p>

        <div className="mx-auto mt-10 grid max-w-md grid-cols-4 gap-3 sm:gap-5">
          {units.map((u, i) => (
            <div
              key={u.label}
              className="on-scroll rounded-xl border border-[var(--gold)]/30 bg-white/5 px-1 py-4 backdrop-blur-sm sm:py-6"
              data-delay={i * 90}
            >
              <div className="font-display text-4xl font-light tabular-nums text-[var(--gold-soft)] sm:text-6xl">
                {u.value === undefined ? "--" : String(u.value).padStart(2, "0")}
              </div>
              <div className="mt-1 font-caps text-[0.6rem] tracking-[0.25em] text-[var(--ivory)]/60 sm:text-xs">
                {u.label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
