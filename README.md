# Gokul weds Amritha — Cinematic Wedding Reception Invitation

A mobile-first, cinematic digital wedding invitation built with **Next.js (App Router) + Tailwind CSS v4**.

## Features

- Cinematic hero with watercolor arch, parallax + ken-burns, animated G|A monogram
- Live countdown to the wedding date
- Floating gold petals + butterflies ambient layer
- Optional background music toggle
- Families section, scroll-revealed
- "Our Story" polaroid carousel
- Reception schedule timeline
- Wedding Temple & Reception detail cards with **Get Directions** map links
- RSVP form with Joyfully Accept / Regretfully Decline + confetti celebration
- Smooth scroll-reveal animations throughout, reduced-motion friendly

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production
```

## Make it yours

Everything is driven from one file: **`lib/config.ts`** — names, date, venues,
family, schedule, story copy and map links.

- **Date** — set `weddingDateISO` (the countdown reads from it).
- **Your photos** — drop images into `public/assets/story/` and point each
  `story.moments[].image` at them (e.g. `"/assets/story/01.jpg"`). Until then,
  elegant monogram placeholders are shown.
- **Background music** — add `public/assets/music.mp3`; the toggle appears
  automatically.
- **RSVP delivery** — `components/RSVP.tsx` currently simulates a submit. Wire
  the `submit` handler to your API route, Google Form, or an email service.

## Notes

The decorative background artwork and the G|A monogram are reused to match the
reference theme. The original couple's personal storyboard photographs are **not**
included — replace the placeholders with your own images as described above.

## Theme

Ivory `#faf6ee` · Deep Navy `#1a2c5b` · Gold `#c99d4e` — Cormorant Garamond,
Cormorant SC & Great Vibes.
