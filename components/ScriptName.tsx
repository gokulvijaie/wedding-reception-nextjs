/**
 * Renders a name for script (Great Vibes) contexts. Great Vibes' capital "A"
 * glyph looks like an oversized lowercase "a", so an A-initial is swapped to
 * Alex Brush, whose capital A clearly reads as one.
 */
export default function ScriptName({ name }: { name: string }) {
  if (!name.startsWith("A")) return <>{name}</>;
  return (
    <>
      <span className="script-cap">A</span>
      {name.slice(1)}
    </>
  );
}
