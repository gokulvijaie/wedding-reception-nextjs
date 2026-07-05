"use client";

import { useEffect, useState } from "react";
import { config } from "@/lib/config";
import Monogram from "./Monogram";
import ScratchCard from "./ScratchCard";
import ScriptName from "./ScriptName";

export default function Hero() {
  const { couple, hero, scratch } = config;
  const [y, setY] = useState(0);

  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-14">
      {/* Watercolor arch backdrop with slow ken-burns + gentle parallax */}
      <div className="absolute inset-0" style={{ transform: `translateY(${y * 0.18}px)` }}>
        <picture>
          <source media="(min-width: 768px)" srcSet="/assets/hero-bg-desktop-DVXVxfCH.webp" />
          <img
            src="/assets/hero-bg-BoJZa16A.webp"
            alt=""
            className="h-full w-full object-cover"
            style={{ animation: "kenburns 20s ease-in-out infinite alternate" }}
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--ivory)]/10 via-transparent to-[var(--ivory)]" />
      </div>

      {/* Foreground */}
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
        {/* Monogram */}
        <div className="reveal" style={{ animationDelay: "0.15s" }}>
          <Monogram className="mx-auto w-24 drop-shadow-[0_8px_24px_rgba(26,44,91,0.2)] sm:w-32" />
        </div>

        {/* Names — fluid size so the script never touches the screen edges */}
        <h1
          className="mt-5 font-script leading-[1.05] text-[var(--navy)] reveal"
          style={{ animationDelay: "0.4s", fontSize: "clamp(2.75rem, 15vw, 7rem)" }}
        >
          {couple.groom}
          <span className="mx-[0.06em] align-middle font-script text-[0.4em] italic text-[var(--gold)]">
            weds
          </span>
          <ScriptName name={couple.bride} />
        </h1>

        {/* Heart · eyebrow · heart */}
        <div className="mt-6 ornament reveal" style={{ animationDelay: "0.6s" }}>
          &#10084;&#65038;
        </div>
        <p className="mt-3 eyebrow reveal" style={{ animationDelay: "0.7s" }}>
          {hero.eyebrow}
        </p>
        <div className="mt-3 ornament reveal" style={{ animationDelay: "0.8s" }}>
          &#10084;&#65038;
        </div>

        {/* Scratch-to-reveal card */}
        <div className="mt-8 w-full max-w-md reveal" style={{ animationDelay: "0.95s" }}>
          <ScratchCard />
        </div>

        {/* Thank you */}
        <p
          className="mt-8 font-display text-xl italic text-[var(--navy-deep)] reveal sm:text-2xl"
          style={{ animationDelay: "1.1s" }}
        >
          {scratch.thankYou}
        </p>
      </div>
    </section>
  );
}
