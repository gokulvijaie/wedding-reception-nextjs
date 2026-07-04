import { config } from "@/lib/config";
import Monogram from "./Monogram";
import ScriptName from "./ScriptName";

export default function Footer() {
  const { couple, footer } = config;
  return (
    <footer className="relative overflow-hidden bg-[var(--navy)] py-16 text-center text-[var(--ivory)]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 50% 0, var(--gold) 0, transparent 55%)" }} />
      <div className="relative mx-auto max-w-md px-6">
        <Monogram tone="ivory" className="mx-auto w-24 on-scroll" />
        <h2
          className="mt-4 font-script text-[var(--gold-soft)] on-scroll"
          style={{ fontSize: "clamp(2.25rem, 12vw, 3rem)" }}
        >
          {couple.groom} &amp; <ScriptName name={couple.bride} />
        </h2>
        <div className="mx-auto my-5 flex w-48 items-center gap-3">
          <span className="gold-line flex-1" />
          <span className="text-[var(--gold)]">&#10086;</span>
          <span className="gold-line flex-1" />
        </div>
        <p className="font-script text-3xl text-[var(--gold-soft)] on-scroll">
          {footer.closing}
        </p>
        <p className="mt-3 font-display italic text-[var(--ivory)]/70 on-scroll">
          {footer.verse}
        </p>
        <p className="mt-8 font-caps text-[0.55rem] tracking-[0.3em] text-[var(--ivory)]/40">
          #{couple.hashtag.toUpperCase()}
        </p>
      </div>
    </footer>
  );
}
