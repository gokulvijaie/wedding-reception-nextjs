"use client";

import { useEffect } from "react";

/**
 * Pings /api/track once per browser session so the dashboard can record unique
 * visitors (deduped server-side by IP + device). Fire-and-forget; failures are
 * silently ignored so they never affect the page.
 */
export default function VisitTracker() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("v_tracked")) return;
      sessionStorage.setItem("v_tracked", "1");
    } catch {
      /* private mode — just track anyway */
    }
    fetch("/api/track").catch(() => {});
  }, []);

  return null;
}
