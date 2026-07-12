"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { config } from "@/lib/config";

export default function ScratchCard() {
  const { scratch, reception } = config;
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const moveCount = useRef(0);
  const [revealed, setRevealed] = useState(false);

  /* ── paint the navy "scratch" overlay ─────────────────────────────────── */
  const paintOverlay = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    // Card not laid out yet (0 size) — bail; the ResizeObserver will re-fire
    // and repaint once it has real dimensions (e.g. after fonts load).
    if (w === 0 || h === 0) return;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";

    // navy gradient
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#22386b");
    g.addColorStop(0.5, "#1a2c5b");
    g.addColorStop(1, "#13224a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // starfield
    for (let i = 0; i < 90; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = Math.random() * 1.6 + 0.3;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle =
        Math.random() > 0.7
          ? `rgba(201,157,78,${0.4 + Math.random() * 0.5})`
          : `rgba(255,255,255,${0.3 + Math.random() * 0.5})`;
      ctx.fill();
    }

    // hint text
    ctx.textAlign = "center";
    ctx.fillStyle = "#dcc188";
    ctx.font = "600 18px 'Cormorant SC', Georgia, serif";
    ctx.fillText(`✦   ${scratch.hint}   ✦`, w / 2, h / 2 - 4);
    ctx.fillStyle = "rgba(250,246,238,0.8)";
    ctx.font = "italic 17px 'Cormorant Garamond', Georgia, serif";
    ctx.fillText(scratch.hintSub, w / 2, h / 2 + 22);
  }, [scratch.hint, scratch.hintSub]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const repaint = () => {
      if (!revealed) paintOverlay();
    };

    // Paint now, again next frame, and once the web fonts finish loading — the
    // card's height depends on the revealed (font-rendered) content, so its size
    // settles after fonts load.
    repaint();
    const raf = requestAnimationFrame(repaint);
    document.fonts?.ready.then(repaint).catch(() => {});

    // Repaint whenever the card actually changes size (the reliable trigger).
    const ro = new ResizeObserver(repaint);
    ro.observe(wrap);

    window.addEventListener("resize", repaint);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", repaint);
    };
  }, [paintOverlay, revealed]);

  /* ── full-screen confetti shower on reveal ────────────────────────────── */
  const burst = useCallback(() => {
    if (typeof document === "undefined") return;

    const host = document.createElement("div");
    host.style.cssText =
      "position:fixed;inset:0;pointer-events:none;z-index:60;overflow:hidden";
    document.body.appendChild(host);

    const colors = ["#1a2c5b", "#c99d4e", "#dcc188", "#ffffff", "#99bdd3", "#c0a062"];
    const W = window.innerWidth;
    const H = window.innerHeight;
    const count = Math.min(180, Math.max(80, Math.round(W / 8)));

    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      const w = 6 + Math.random() * 8;
      const round = Math.random() > 0.6;
      const h = round ? w : 9 + Math.random() * 10;
      p.style.cssText =
        `position:absolute;top:-8vh;left:${Math.random() * 100}%;width:${w}px;height:${h}px;` +
        `background:${colors[i % colors.length]};border-radius:${round ? "50%" : "1px"};` +
        `opacity:0;will-change:transform,opacity`;
      host.appendChild(p);

      const xDrift = (Math.random() * 2 - 1) * 160;
      const rot = Math.random() * 1080 - 540;
      const dur = 2600 + Math.random() * 2400;
      const delay = Math.random() * 700;

      p.animate(
        [
          { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
          {
            transform: `translate(${xDrift * 0.6}px, ${H * 0.6}px) rotate(${rot * 0.6}deg)`,
            opacity: 1,
            offset: 0.7,
          },
          {
            transform: `translate(${xDrift}px, ${H + 140}px) rotate(${rot}deg)`,
            opacity: 0,
          },
        ],
        { duration: dur, delay, easing: "cubic-bezier(0.25,0.6,0.45,1)", fill: "forwards" }
      ).onfinish = () => p.remove();
    }

    setTimeout(() => host.remove(), 6500);
  }, []);

  /* ── scratch interaction ──────────────────────────────────────────────── */
  const erase = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();
  };

  const checkProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height } = canvas;
    const step = 16; // sample sparsely for performance
    try {
      const data = ctx.getImageData(0, 0, width, height).data;
      let clear = 0;
      let total = 0;
      for (let i = 3; i < data.length; i += 4 * step) {
        total++;
        if (data[i] === 0) clear++;
      }
      if (clear / total > 0.3) reveal();
    } catch {
      /* getImageData can throw if tainted — ignore */
    }
  };

  const reveal = useCallback(() => {
    if (revealed) return;
    setRevealed(true);
    burst();
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.transition = "opacity 0.7s ease";
      canvas.style.opacity = "0";
    }
  }, [revealed, burst]);

  const onDown = (e: React.PointerEvent) => {
    if (revealed) return;
    drawing.current = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    erase(e.clientX, e.clientY);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drawing.current || revealed) return;
    erase(e.clientX, e.clientY);
    moveCount.current++;
    if (moveCount.current % 14 === 0) checkProgress();
  };
  const onUp = () => {
    drawing.current = false;
    checkProgress();
  };

  return (
    <div className="w-full">
        {/* scratch card — height driven by the revealed content so nothing
            gets cramped when the venue text wraps */}
        <div
          ref={wrapRef}
          className="relative mx-auto w-full overflow-hidden rounded-2xl border border-[var(--gold)]/40 shadow-[0_20px_60px_-25px_rgba(26,44,91,0.6)]"
        >
          {/* revealed content underneath (in normal flow → sets the height) */}
          <div className="flex min-h-[15rem] flex-col items-center justify-center bg-gradient-to-br from-[var(--ivory-soft)] via-[#fbf3e3] to-[#f3e7cd] px-6 py-10 text-center">
            <p className="font-caps text-xs tracking-[0.32em] text-[var(--gold-deep)] sm:text-sm">
              {scratch.revealLabel}
            </p>
            <div className="my-4 flex items-center gap-2.5">
              <span className="gold-line w-12" />
              <span className="text-[var(--gold)]">&#10047;&#65038;</span>
              <span className="gold-line w-12" />
            </div>
            <p className="font-display text-3xl font-semibold leading-tight text-[var(--navy-deep)] sm:text-4xl">
              {reception.date}
            </p>
            <p className="mt-1.5 font-display text-xl tracking-wide text-[var(--gold-deep)] sm:text-2xl">
              {reception.time}
            </p>
            <p className="mt-5 max-w-[22rem] font-display text-lg italic leading-relaxed text-[var(--navy-muted)] sm:text-xl">
              {reception.venue},<br />
              {reception.address}
            </p>
          </div>

          {/* scratch canvas */}
          <canvas
            ref={canvasRef}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerLeave={onUp}
            className={`absolute inset-0 z-10 h-full w-full ${
              revealed ? "pointer-events-none" : "cursor-grab touch-none"
            }`}
          />
        </div>
    </div>
  );
}
