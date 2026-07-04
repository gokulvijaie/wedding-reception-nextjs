import { config } from "@/lib/config";

export default function Schedule() {
  const { schedule } = config;
  return (
    <section className="relative overflow-hidden py-24">
      <picture>
        <source media="(min-width: 768px)" srcSet="/assets/schedule-bg-desktop-DLqqgvTI.webp" />
        <img src="/assets/schedule-bg-CrjkodkA.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
      </picture>
      <div className="absolute inset-0 bg-[var(--navy)]/55" />

      <div className="relative mx-auto max-w-3xl px-6 text-center text-[var(--ivory)]">
        <p className="eyebrow on-scroll" style={{ color: "var(--gold-soft)" }}>
          {schedule.eyebrow}
        </p>
        <h2 className="mt-3 whitespace-pre-line font-display text-4xl font-light leading-tight on-scroll sm:text-5xl">
          {schedule.title}
        </h2>

        <div className="mt-12 space-y-6">
          {schedule.items.map((item, i) => (
            <div
              key={item.title}
              className="on-scroll mx-auto flex max-w-xl items-center gap-5 rounded-2xl border border-[var(--gold)]/40 bg-white/10 px-6 py-5 text-left backdrop-blur-md"
              data-delay={i * 130}
            >
              <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full border border-[var(--gold-soft)]/60 bg-[var(--navy)]/40">
                <span className="font-display text-lg font-medium text-[var(--gold-soft)]">
                  {item.time.split(" ")[0]}
                </span>
                <span className="font-caps text-[0.55rem] tracking-widest text-[var(--ivory)]/70">
                  {item.time.split(" ")[1]}
                </span>
              </div>
              <div>
                <h3 className="font-display text-2xl text-[var(--gold-soft)]">{item.title}</h3>
                <p className="font-display italic text-[var(--ivory)]/80">{item.subtitle}</p>
                <p className="mt-1 font-caps text-[0.6rem] tracking-[0.2em] text-[var(--ivory)]/60">
                  {item.place.toUpperCase()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
