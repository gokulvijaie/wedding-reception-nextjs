"use client";

import { useEffect } from "react";

/**
 * Watches every `.on-scroll` element and adds `.is-visible` as it enters the
 * viewport, producing the cinematic staggered reveal as the guest scrolls.
 */
export default function RevealObserver() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".on-scroll"));

    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay;
            if (delay) el.style.transitionDelay = `${delay}ms`;
            el.classList.add("is-visible");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    els.forEach((el) => io.observe(el));

    // Safety net (mainly for iOS Safari): if the observer ever fails to fire
    // for an element that's on screen, force everything visible after a few
    // seconds so no content can stay stuck at opacity:0.
    const failsafe = window.setTimeout(() => {
      els.forEach((el) => el.classList.add("is-visible"));
    }, 3500);

    return () => {
      window.clearTimeout(failsafe);
      io.disconnect();
    };
  }, []);

  return null;
}
