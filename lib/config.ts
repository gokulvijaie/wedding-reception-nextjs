// ─────────────────────────────────────────────────────────────────────────────
// All invitation content lives here. Edit this single file to personalise the
// site — names, dates, venues, schedule, family and story copy.
// ─────────────────────────────────────────────────────────────────────────────

export const config = {
  couple: {
    groom: "Gokul",
    bride: "Amritha",
    hashtag: "GokulWedsAmritha",
    initials: { left: "G", right: "A" },
  },

  // ISO date-time of the celebration (used by the countdown + schema).
  weddingDateISO: "2026-08-31T16:30:00+05:30",

  hero: {
    eyebrow: "WE ARE GETTING MARRIED",
    line1: "Two hearts.",
    line2: "One promise.",
    tagline: "Some chapters are written by destiny.",
    location: "MALA, KERALA",
    dateLabel: "31st August 2026",
  },

  // Interactive scratch-to-reveal card shown just below the hero.
  scratch: {
    eyebrow: "WE ARE GETTING MARRIED",
    hint: "SCRATCH TO REVEAL",
    hintSub: "our special day",
    revealLabel: "OUR SPECIAL DAY",
    thankYou: "Thank you for being a part of our special day.",
  },

  countdown: {
    eyebrow: "THE COUNTDOWN BEGINS",
    title: "Until our forever begins",
    subtitle: "Every journey led us here",
  },

  families: {
    eyebrow: "LOVE & FAMILY",
    title: "Raised with love,\nunited by destiny",
    // TODO: replace the placeholder parent / sibling names below.
    groom: {
      name: "Gokul",
      role: "Son of",
      parents: ["Vijayan Thareparambil", "Sheena M D"],
      siblings: ["Rahul Vijayan"],
      siblingRelation: "Brother of",
    },
    bride: {
      name: "Amritha",
      role: "Daughter of",
      parents: ["Baby Chiyadi", "Nisha Baby"],
      siblings: ["Arjun Baby"],
      siblingRelation: "Sister of",
    },
  },

  story: {
    eyebrow: "OUR STORY",
    title: "We wrote our story.\nNow comes forever",
    caption: "The beginning of our favourite chapter",
    // All 15 photos live in /public/assets/story/ (01–15.webp) — swap the
    // `image` paths below to feature different ones.
    moments: [
      {
        date: "Where it began",
        title: "The day it all began",
        text: "It started with a meeting arranged by our families.",
        caption: "From that first conversation",
        image: "/assets/story/where-it-began.webp" as string | null,
      },
      {
        date: "A special moment",
        title: "The gift she gave",
        text: "Then she gave me a gift — a small moment that felt very special.",
        caption: "A small gift, a big memory",
        image: "/assets/story/she-proposed.webp" as string | null,
      },
      {
        date: "Connection",
        title: "From miles apart to forever close",
        text: "Slowly, the awkward smiles became comfortable moments.",
        caption: "Every journey led us here",
        image: "/assets/story/connection.webp" as string | null,
      },
      {
        date: "Trust & Love",
        title: "From adventures to forever",
        text: "From our first meeting to our engagement — our forever begins.",
        caption: "Our best adventure begins now",
        image: "/assets/story/trust-love.webp" as string | null,
      },
    ],
  },

  engagement: {
    eyebrow: "CAPTURED MOMENTS",
    title: "Engagement\nMemories",
    subtitle: "A glimpse into the moments that led us here.",
    caption: "Forever starts with a yes",
    // Short silent clips shown as the first gallery tiles (muted autoplay loop).
    clips: [
      { src: "/assets/engagement/ring.mp4", caption: "The ring" },
      { src: "/assets/engagement/amritha-intro.mp4", caption: "Amritha" },
    ] as { src: string; caption: string }[],
    // Featured highlight film — click-to-play with sound + controls.
    film: {
      src: "/assets/engagement/engagement-film.mp4",
      poster: "/assets/engagement/engagement-film-poster.webp",
      caption: "Our engagement film",
    } as { src: string; poster: string; caption: string } | null,
    // Photos live in /public/assets/engagement/. Reorder or recaption freely;
    // set `image` to null to show an elegant monogram placeholder instead.
    photos: [
      { image: "/assets/engagement/01.webp" as string | null, caption: "A day to remember" },
      { image: "/assets/engagement/02.webp" as string | null, caption: "Surrounded by love" },
      { image: "/assets/engagement/03.webp" as string | null, caption: "Hearts full of joy" },
      { image: "/assets/engagement/04.webp" as string | null, caption: "With our families" },
      { image: "/assets/engagement/07.webp" as string | null, caption: "Moments to treasure" },
      { image: "/assets/engagement/08.webp" as string | null, caption: "Forever begins" },
    ],
  },

  schedule: {
    eyebrow: "EVENTS YOU'LL BE JOINING",
    title: "A celebration of\nlove & togetherness",
    items: [
      {
        time: "4:30 PM",
        title: "Reception",
        subtitle: "Welcome & blessings",
        place: "St. Stanislaus Parish Hall,First Floor",
      },
      {
        time: "5:00 PM",
        title: "Dinner",
        subtitle: "Celebration & feast",
        place: "St. Stanislaus Parish Hall,Ground Floor ",
      },
    ],
  },

  reception: {
    eyebrow: "WILL YOU JOIN US?",
    label: "Wedding Reception",
    title: "Reception",
    date: "31st August 2026",
    time: "4:30 PM – 8:00 PM",
    venue: "St. Stanislaus Parish Hall",
    address: "Mala Town, Kerala",
    note: "Celebrate this new chapter with us.",
    mapUrl: "https://maps.app.goo.gl/YiehE8HDWjAeuMhm8",
    // Self-hosted satellite map (Esri World Imagery + place labels via Leaflet)
    // pinned to the venue's exact coordinates (10.2431116, 76.2645739). Keyless
    // and same-origin so it always frames cleanly. The "Open in Google Maps"
    // link below the map still uses mapUrl for turn-by-turn directions.
    mapEmbed: "/venue-map.html",
  },

  rsvp: {
    eyebrow: "WILL YOU BE ATTENDING?",
    title: "Your presence will make our day complete.",
    subtitle: "Please let us know if you'll be attending.",
  },

  footer: {
    closing: "together forever",
    verse: "Two hearts. One promise.",
  },
};

export type SiteConfig = typeof config;
