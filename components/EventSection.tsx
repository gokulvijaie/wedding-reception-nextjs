type Event = {
  eyebrow: string;
  label: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapUrl: string;
  mapEmbed?: string;
  verse?: string;
  verseRef?: string;
  note?: string;
};

export default function EventSection({
  event,
  bgMobile,
  bgDesktop,
  overlay = "dark",
  flip = false,
}: {
  event: Event;
  bgMobile: string;
  bgDesktop: string;
  overlay?: "dark" | "light";
  flip?: boolean;
}) {
  const dark = overlay === "dark";
  const text = dark ? "text-[var(--ivory)]" : "text-[var(--navy)]";

  return (
    <section className="relative overflow-hidden py-24">
      <picture>
        <source media="(min-width: 768px)" srcSet={bgDesktop} />
        <img
          src={bgMobile}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ animation: "kenburns 20s ease-in-out infinite alternate" }}
        />
      </picture>
      <div
        className={`absolute inset-0 ${
          dark ? "bg-[var(--navy)]/65" : "bg-[var(--ivory)]/75"
        }`}
      />

      <div className={`relative mx-auto max-w-2xl px-6 text-center ${text}`}>
        <p className="eyebrow on-scroll" style={{ color: "var(--gold-soft)" }}>
          {event.eyebrow}
        </p>

        <div className="mx-auto mt-6 max-w-md rounded-2xl border border-[var(--gold)]/40 bg-white/10 px-8 py-10 backdrop-blur-md on-scroll">
          <p className="font-caps text-[0.65rem] tracking-[0.35em] text-[var(--gold-soft)]">
            {event.label.toUpperCase()}
          </p>
          <h2 className="mt-3 font-script text-5xl text-[var(--gold-soft)]">
            {event.title}
          </h2>

          <div className="my-6 flex items-center justify-center gap-3">
            <span className="gold-line w-12" />
            <span className="text-[var(--gold)]">&#10047;</span>
            <span className="gold-line w-12" />
          </div>

          <div className="space-y-1 font-display text-xl">
            <p>{event.date}</p>
            <p className="text-[var(--gold-soft)]">{event.time}</p>
          </div>

          <p className="mt-5 font-display text-2xl font-light italic">{event.venue}</p>
          <p className="mt-1 font-display text-base opacity-80">{event.address}</p>

          {event.verse && (
            <blockquote className="mt-6 font-display text-lg italic leading-relaxed opacity-90">
              &ldquo;{event.verse}&rdquo;
              <footer className="mt-2 font-caps text-[0.6rem] tracking-[0.3em] text-[var(--gold-soft)]">
                {event.verseRef}
              </footer>
            </blockquote>
          )}

          {event.note && (
            <p className="mt-5 font-display text-lg italic text-[var(--gold-soft)]">
              {event.note}
            </p>
          )}

          {event.mapEmbed && (
            <div className="mt-7 overflow-hidden rounded-2xl border border-[var(--gold-soft)]/60 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.6)]">
              <iframe
                src={event.mapEmbed}
                title={`Map to ${event.venue}`}
                className="h-56 w-full sm:h-64"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          )}

          <a
            href={event.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--gold-soft)] bg-[var(--gold)]/20 px-6 py-3 font-caps text-xs tracking-[0.25em] text-[var(--ivory)] shadow-[0_8px_24px_-12px_rgba(0,0,0,0.5)] transition hover:bg-[var(--gold)] hover:text-[var(--navy)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
            </svg>
            OPEN IN GOOGLE MAPS
          </a>
        </div>
      </div>
    </section>
  );
}
