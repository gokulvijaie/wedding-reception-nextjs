/**
 * Ornamental gold crest with a Ganesha symbol at its centre, drawn in SVG so it
 * scales cleanly everywhere it appears.
 */
export default function Monogram({
  className = "",
  tone = "navy",
}: {
  className?: string;
  tone?: "navy" | "ivory";
}) {
  const ganesha =
    tone === "ivory" ? "/assets/ganesha-ivory.png" : "/assets/ganesha-navy.png";

  // Laurel leaves along the lower arc of the oval.
  const cx = 100;
  const cy = 102;
  const rx = 70;
  const ry = 82;
  // Round to fixed precision so the server and client render byte-identical
  // values (raw Math.cos/sin differ in the last float digit across runtimes,
  // which would otherwise trigger a hydration mismatch).
  const r2 = (n: number) => Math.round(n * 100) / 100;
  const leaf = (tDeg: number, key: string) => {
    const t = (tDeg * Math.PI) / 180;
    const px = r2(cx + (rx + 4) * Math.cos(t));
    const py = r2(cy + (ry + 4) * Math.sin(t));
    const rot = tDeg + 90;
    return (
      <ellipse
        key={key}
        cx={px}
        cy={py}
        rx={8}
        ry={3}
        fill="var(--gold)"
        transform={`rotate(${rot} ${px} ${py})`}
      />
    );
  };
  const arc: number[] = [];
  for (let d = 20; d <= 160; d += 11) arc.push(d);

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Ganesha symbol">
      {/* outer + inner oval frame */}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="var(--gold)" strokeWidth="2.2" />
      <ellipse cx={cx} cy={cy} rx={rx - 6} ry={ry - 6} fill="none" stroke="var(--gold-soft)" strokeWidth="1" />

      {/* top + bottom flourishes */}
      <path d="M100 8 l7 12 -7 6 -7-6z" fill="var(--gold)" />
      <circle cx="100" cy="8" r="2.4" fill="var(--gold-deep)" />
      {arc.map((d, i) => leaf(d, `l${i}`))}

      {/* small sprig of leaves dead-centre bottom */}
      <path d="M88 176 q12 -8 24 0" fill="none" stroke="var(--gold)" strokeWidth="1.2" />
      <path d="M100 178 l5 -7 M100 178 l-5 -7 M100 178 l8 -2 M100 178 l-8 -2" stroke="var(--gold)" strokeWidth="1.2" />

      {/* Ganesha symbol */}
      <image
        href={ganesha}
        x="61.5"
        y="50"
        width="77"
        height="100"
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
}
