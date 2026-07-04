import Link from "next/link";
import { readRsvps } from "@/lib/rsvpStore";
import { readVisits } from "@/lib/visitStore";
import { config } from "@/lib/config";
import ClearRsvps from "@/components/ClearRsvps";

export const dynamic = "force-dynamic";

function deviceLabel(ua: string): string {
  if (!ua) return "Unknown device";
  const mobile = /Mobile|Android|iPhone|iPad|iPod/i.test(ua);
  const os = /Windows/i.test(ua)
    ? "Windows"
    : /iPhone|iPad|iPod/i.test(ua)
      ? "iOS"
      : /Mac OS X|Macintosh/i.test(ua)
        ? "macOS"
        : /Android/i.test(ua)
          ? "Android"
          : /Linux/i.test(ua)
            ? "Linux"
            : "Unknown OS";
  const browser = /Edg/i.test(ua)
    ? "Edge"
    : /OPR|Opera/i.test(ua)
      ? "Opera"
      : /Chrome/i.test(ua)
        ? "Chrome"
        : /Firefox/i.test(ua)
          ? "Firefox"
          : /Safari/i.test(ua)
            ? "Safari"
            : "Browser";
  return `${browser} · ${os} · ${mobile ? "Mobile" : "Desktop"}`;
}

export const metadata = {
  title: "Messages",
  robots: { index: false, follow: false },
};

function fmt(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const requiredKey = process.env.RSVP_VIEW_KEY;

  // Optional protection: if RSVP_VIEW_KEY is set, require ?key=… to match.
  if (requiredKey && sp.key !== requiredKey) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--ivory)] px-6 text-center">
        <div>
          <p className="eyebrow">Messages</p>
          <h1 className="mt-3 font-display text-3xl text-[var(--navy)]">This page is private</h1>
          <p className="mt-2 font-display text-lg text-[var(--navy-muted)]">
            Add the access key to the URL: <code>/messages?key=…</code>
          </p>
        </div>
      </main>
    );
  }

  const rsvps = readRsvps().slice().reverse(); // newest first
  const yes = rsvps.filter((r) => r.attending === "yes");
  const no = rsvps.filter((r) => r.attending === "no");
  const guestTotal = yes.reduce((s, r) => s + (parseInt(r.guests || "1", 10) || 1), 0);

  const stats = [
    { label: "Total RSVPs", value: rsvps.length },
    { label: "Attending", value: yes.length },
    { label: "Guests", value: guestTotal },
    { label: "Declined", value: no.length },
  ];

  // ── Visitor analytics ──────────────────────────────────────────────────
  const visits = readVisits();
  const totalViews = visits.reduce((s, v) => s + (v.hits || 1), 0);
  const countryCounts = new Map<string, number>();
  for (const v of visits) {
    const c = v.country || "Unknown";
    countryCounts.set(c, (countryCounts.get(c) || 0) + 1);
  }
  const topCountries = [...countryCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  const recentVisitors = visits
    .slice()
    .sort((a, b) => (a.lastSeen < b.lastSeen ? 1 : -1))
    .slice(0, 8);

  const visitorStats = [
    { label: "Unique Visitors", value: visits.length },
    { label: "Page Views", value: totalViews },
    { label: "Countries", value: countryCounts.size },
  ];

  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-14">
      <div className="mx-auto max-w-2xl">
        <header className="text-center">
          <p className="eyebrow">{config.couple.groom} &amp; {config.couple.bride}</p>
          <h1 className="mt-2 font-script text-5xl text-[var(--navy)]">Messages</h1>
          <div className="mx-auto mt-4 flex w-40 items-center gap-3">
            <span className="gold-line flex-1" />
            <span className="text-[var(--gold)]">&#10047;</span>
            <span className="gold-line flex-1" />
          </div>
        </header>

        {/* summary */}
        <div className="mx-auto mt-8 grid max-w-lg grid-cols-4 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-2 py-4 text-center"
            >
              <div className="font-display text-3xl font-light text-[var(--navy)]">{s.value}</div>
              <div className="mt-1 font-caps text-[0.55rem] tracking-[0.2em] text-[var(--gold-deep)]">
                {s.label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>

        {(rsvps.length > 0 || visits.length > 0) && (
          <div className="mt-3 text-right">
            <ClearRsvps />
          </div>
        )}

        {/* list */}
        <div className="mt-7 space-y-4">
          {rsvps.length === 0 && (
            <p className="py-10 text-center font-display text-xl italic text-[var(--navy-muted)]">
              No RSVPs yet. Responses will appear here as guests reply.
            </p>
          )}

          {rsvps.map((r, i) => (
            <article
              key={i}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-6 py-5 shadow-[0_10px_30px_-22px_rgba(26,44,91,0.5)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl text-[var(--navy)]">{r.name}</h2>
                  <p className="font-caps text-[0.55rem] tracking-[0.2em] text-[var(--navy-muted)]">
                    {fmt(r.at)}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 font-caps text-[0.55rem] tracking-[0.2em] ${
                    r.attending === "yes"
                      ? "bg-[var(--gold)]/20 text-[var(--gold-deep)]"
                      : "bg-[var(--navy)]/10 text-[var(--navy-muted)]"
                  }`}
                >
                  {r.attending === "yes" ? `ATTENDING · ${r.guests || "1"}` : "DECLINED"}
                </span>
              </div>
              {r.message && (
                <p className="mt-3 font-display text-lg italic leading-relaxed text-[var(--navy-deep)]">
                  &ldquo;{r.message}&rdquo;
                </p>
              )}
            </article>
          ))}
        </div>

        {/* ── Visitor analytics ─────────────────────────────────────────── */}
        <section className="mt-16">
          <header className="text-center">
            <p className="eyebrow">WHO&apos;S BEEN LOOKING</p>
            <h2 className="mt-2 font-script text-4xl text-[var(--navy)]">Visitor Analytics</h2>
          </header>

          <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-3">
            {visitorStats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-2 py-4 text-center"
              >
                <div className="font-display text-3xl font-light text-[var(--navy)]">{s.value}</div>
                <div className="mt-1 font-caps text-[0.5rem] tracking-[0.18em] text-[var(--gold-deep)]">
                  {s.label.toUpperCase()}
                </div>
              </div>
            ))}
          </div>

          {visits.length === 0 ? (
            <p className="mt-8 text-center font-display text-lg italic text-[var(--navy-muted)]">
              No visits recorded yet.
            </p>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {/* top countries */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-6 py-5">
                <h3 className="font-caps text-[0.6rem] tracking-[0.25em] text-[var(--gold-deep)]">
                  TOP LOCATIONS
                </h3>
                <ul className="mt-3 space-y-2">
                  {topCountries.map(([country, n]) => (
                    <li key={country} className="flex items-center justify-between">
                      <span className="font-display text-lg text-[var(--navy)]">{country}</span>
                      <span className="font-display text-lg text-[var(--gold-deep)]">{n}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* recent visitors */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-6 py-5">
                <h3 className="font-caps text-[0.6rem] tracking-[0.25em] text-[var(--gold-deep)]">
                  RECENT VISITORS
                </h3>
                <ul className="mt-3 space-y-3">
                  {recentVisitors.map((v) => (
                    <li key={v.id} className="border-b border-[var(--border)]/60 pb-2 last:border-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-base text-[var(--navy)]">
                          {[v.city, v.country].filter(Boolean).join(", ") || "Unknown location"}
                        </span>
                        <span className="font-caps text-[0.5rem] tracking-[0.15em] text-[var(--navy-muted)]">
                          {fmt(v.lastSeen)}
                        </span>
                      </div>
                      <div className="font-caps text-[0.5rem] tracking-[0.12em] text-[var(--navy-muted)]">
                        {deviceLabel(v.userAgent)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="font-caps text-xs tracking-[0.25em] text-[var(--gold-deep)] underline-offset-4 hover:underline"
          >
            &larr; BACK TO INVITATION
          </Link>
        </div>
      </div>
    </main>
  );
}
