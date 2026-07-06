import { config } from "@/lib/config";
import ScriptName from "./ScriptName";

function FamilyCard({
  side,
  delay,
}: {
  side: typeof config.families.groom;
  delay: number;
}) {
  return (
    <div
      className="on-scroll relative flex-1 rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 px-7 py-9 text-center shadow-[0_10px_40px_-20px_rgba(26,44,91,0.35)] backdrop-blur-sm"
      data-delay={delay}
    >
      <span className="ornament">&#10086;</span>
      <h3 className="mt-2 font-script text-4xl text-[var(--navy)]"><ScriptName name={side.name} /></h3>
      <p className="mt-3 font-caps text-[0.65rem] tracking-[0.3em] text-[var(--gold-deep)]">
        {side.role.toUpperCase()}
      </p>
      <p className="mt-1 text-balance font-display text-xl text-[var(--navy-deep)]">
        {side.parents.map((p, i) => (
          <span key={i}>
            {i > 0 && <span className="text-[var(--gold)]"> &amp; </span>}
            <span className="whitespace-nowrap">{p}</span>
          </span>
        ))}
      </p>

      <div className="mx-auto my-5 flex w-2/3 items-center gap-2">
        <span className="gold-line flex-1" />
        <span className="text-[var(--gold)]">&#10047;</span>
        <span className="gold-line flex-1" />
      </div>

      <p className="font-caps text-[0.6rem] tracking-[0.3em] text-[var(--gold-deep)]">
        {side.siblingRelation.toUpperCase()}
      </p>
      <p className="mt-1 font-display text-lg italic text-[var(--navy-muted)]">
        {side.siblings.join(" · ")}
      </p>

      {side.address?.length ? (
        <>
          <div className="mx-auto my-5 flex w-1/3 items-center gap-2">
            <span className="gold-line flex-1" />
            <span className="text-[var(--gold)]">&#10047;&#65038;</span>
            <span className="gold-line flex-1" />
          </div>
          <p className="font-caps text-[0.6rem] tracking-[0.3em] text-[var(--gold-deep)]">
            ADDRESS
          </p>
          <address className="mt-1 font-display text-base not-italic leading-relaxed text-[var(--navy-deep)]">
            {side.address.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </address>
        </>
      ) : null}
    </div>
  );
}

export default function Families() {
  const { families } = config;
  return (
    <section className="relative overflow-hidden py-24">
      <picture>
        <source media="(min-width: 768px)" srcSet="/assets/families-bg-desktop-CemX6j0X.webp" />
        <img src="/assets/families-bg-Bdmrjm8V.webp" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
      </picture>
      <div className="absolute inset-0 bg-[var(--ivory)]/70" />

      <div className="relative mx-auto max-w-4xl px-6">
        <header className="mb-12 text-center">
          <p className="eyebrow on-scroll">{families.eyebrow}</p>
          <h2 className="mt-3 whitespace-pre-line font-display text-4xl font-light leading-tight text-[var(--navy)] on-scroll sm:text-5xl">
            {families.title}
          </h2>
        </header>

        <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
          <FamilyCard side={families.groom} delay={0} />
          <div className="flex items-center justify-center md:flex-col">
            <span className="font-script text-5xl text-[var(--gold)] on-scroll">&amp;</span>
          </div>
          <FamilyCard side={families.bride} delay={150} />
        </div>
      </div>
    </section>
  );
}
