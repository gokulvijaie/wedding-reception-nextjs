import { NextResponse } from "next/server";
import { addRsvp, clearRsvps, readRsvps, type Rsvp } from "@/lib/rsvpStore";
import { clearVisits } from "@/lib/visitStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name ?? "").trim();
    const attending =
      body?.attending === "yes" ? "yes" : body?.attending === "no" ? "no" : null;

    if (!name || !attending) {
      return NextResponse.json({ error: "Missing name or attendance." }, { status: 400 });
    }

    const entry: Rsvp = {
      name: name.slice(0, 120),
      attending,
      guests: attending === "yes" ? String(body?.guests ?? "1").slice(0, 4) : undefined,
      message: String(body?.message ?? "").slice(0, 1000),
      at: new Date().toISOString(),
    };

    addRsvp(entry);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not save RSVP." }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ rsvps: readRsvps() });
}

// Clears all stored RSVPs and visitor analytics. If RSVP_VIEW_KEY is
// configured, the same key must be supplied (?key=…) — matching the
// /messages page protection.
export async function DELETE(req: Request) {
  const requiredKey = process.env.RSVP_VIEW_KEY;
  if (requiredKey) {
    const key = new URL(req.url).searchParams.get("key");
    if (key !== requiredKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  clearRsvps();
  clearVisits();
  return NextResponse.json({ ok: true });
}
