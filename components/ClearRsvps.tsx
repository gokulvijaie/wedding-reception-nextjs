"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Small destructive control on /messages: clears all stored RSVPs and visitor
 * analytics after an explicit confirm step. Forwards the ?key=… from the URL
 * so it works when RSVP_VIEW_KEY protection is enabled.
 */
export default function ClearRsvps() {
  const [arm, setArm] = useState(false);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const clear = async () => {
    setBusy(true);
    try {
      const key = new URLSearchParams(window.location.search).get("key");
      const res = await fetch(
        `/api/rsvp${key ? `?key=${encodeURIComponent(key)}` : ""}`,
        { method: "DELETE" }
      );
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
      setArm(false);
    }
  };

  if (!arm) {
    return (
      <button
        onClick={() => setArm(true)}
        className="font-caps text-[0.55rem] tracking-[0.2em] text-[var(--navy-muted)]/70 underline-offset-4 transition hover:text-[#c0392b] hover:underline"
      >
        RESET
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-3">
      <span className="font-caps text-[0.55rem] tracking-[0.15em] text-[#c0392b]">
        DELETE ALL RSVPS &amp; VISITOR DATA?
      </span>
      <button
        onClick={clear}
        disabled={busy}
        className="rounded-full border border-[#c0392b] px-3 py-1 font-caps text-[0.55rem] tracking-[0.15em] text-[#c0392b] transition hover:bg-[#c0392b] hover:text-white disabled:opacity-50"
      >
        {busy ? "CLEARING…" : "YES, CLEAR"}
      </button>
      <button
        onClick={() => setArm(false)}
        disabled={busy}
        className="font-caps text-[0.55rem] tracking-[0.15em] text-[var(--navy-muted)] underline-offset-4 hover:underline"
      >
        CANCEL
      </button>
    </span>
  );
}
