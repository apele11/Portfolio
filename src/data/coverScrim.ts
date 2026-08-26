/**
 * The scrim over a project cover on the home grid.
 *
 * The desktop composition lays white type across the left of the cover, so the
 * text is legible only if whatever is underneath it is dark. A text-shadow
 * alone does not survive a bright cover — three of the covers here have areas
 * that measure 1.00:1 against white, which is white on white.
 *
 * Two numbers describe the ramp, because those are the two things worth
 * tuning: how dark it gets, and how much of the cover it touches. The shape
 * between them is fixed — full strength across the text, then a quick fall to
 * nothing — and is deliberately not exposed. An earlier hand-written gradient
 * faded gradually from 30% to 72%, which spent its coverage in the middle of
 * the artwork while going *thin* exactly where the subtitle ends; holding
 * strength to the text edge and dropping fast measured better on every cover
 * while touching a third less of the image.
 */

/** Alpha at the left edge. */
export const DEFAULT_SCRIM_STRENGTH = 0.82;

/** Fraction of the cover's width at which the scrim reaches zero. */
export const DEFAULT_SCRIM_WIDTH = 0.5;

/**
 * Stops as (position, multiplier) pairs — position is a fraction of the ramp's
 * width, multiplier a fraction of its strength. Hold, then fall.
 */
const SHAPE: readonly [number, number][] = [
  [0, 1],
  [0.68, 0.9],
  [0.84, 0.68],
  [1, 0],
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * A number from Firestore, clamped to a usable range. Anything absent or
 * non-numeric falls back — the field is optional on every document, and most
 * projects never set it.
 */
export function toScrimNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value)
    ? clamp(value, 0, 1)
    : fallback;
}

/**
 * The `linear-gradient(...)` for a cover.
 *
 * A width of 0 disables the scrim rather than emitting a zero-width gradient —
 * a cover dark enough not to need one should not pay for a paint.
 */
export function coverScrimGradient(
  strength = DEFAULT_SCRIM_STRENGTH,
  width = DEFAULT_SCRIM_WIDTH
): string | undefined {
  const a = clamp(strength, 0, 1);
  const w = clamp(width, 0, 1);
  if (a === 0 || w === 0) return undefined;

  const stops = SHAPE.map(([position, multiplier]) => {
    const alpha = Number((a * multiplier).toFixed(3));
    const offset = Number((w * position * 100).toFixed(2));
    return `rgba(0,0,0,${alpha}) ${offset}%`;
  });

  return `linear-gradient(to right, ${stops.join(", ")})`;
}
