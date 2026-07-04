import { NextResponse } from "next/server";
import crypto from "crypto";
import { readVisits, writeVisits, type Visit } from "@/lib/visitStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Best-effort client IP from common proxy headers. */
function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    ""
  );
}

function isPrivate(ip: string): boolean {
  if (!ip) return true;
  return (
    ip === "::1" ||
    ip === "localhost" ||
    ip.startsWith("127.") ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
    ip.startsWith("::ffff:127.") ||
    ip.startsWith("fc") ||
    ip.startsWith("fd")
  );
}

// Pass an empty `ip` to resolve the *caller's* (server's) own public IP —
// used when the request carries only a local/private address (e.g. localhost).
async function geolocate(ip: string): Promise<Partial<Visit>> {
  try {
    const r = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      cache: "no-store",
    });
    const j = await r.json();
    if (j && j.success) {
      return { country: j.country, city: j.city, region: j.region };
    }
  } catch {
    /* geolocation is best-effort */
  }
  return {};
}

export async function GET(request: Request) {
  const ip = clientIp(request);
  const ua = request.headers.get("user-agent") || "";
  const id = crypto
    .createHash("sha256")
    .update(`${ip}|${ua}`)
    .digest("hex")
    .slice(0, 32);
  const now = new Date().toISOString();

  const all = readVisits();
  const existing = all.find((v) => v.id === id);

  // Already seen this device+IP — bump the counter, no duplicate row, no
  // repeated geolocation lookup.
  if (existing) {
    existing.lastSeen = now;
    existing.hits += 1;
    writeVisits(all);
    return NextResponse.json({ ok: true, unique: false });
  }

  // For a local/private IP (e.g. running on localhost) there is no public IP to
  // look up, so resolve the server's own public IP location instead of showing
  // "Local". Fall back to "Local" only if the lookup fails entirely.
  let geo = isPrivate(ip) ? await geolocate("") : await geolocate(ip);
  if (!geo.country) {
    geo = { country: "Local", city: "Local", region: "" };
  }

  const visit: Visit = {
    id,
    ip: ip || "unknown",
    userAgent: ua,
    country: geo.country,
    city: geo.city,
    region: geo.region,
    firstSeen: now,
    lastSeen: now,
    hits: 1,
  };
  all.push(visit);
  writeVisits(all);

  return NextResponse.json({ ok: true, unique: true });
}
