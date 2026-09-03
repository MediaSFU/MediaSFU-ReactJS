/**
 * Shared memoisation comparator for the cards that render on the meeting stage.
 *
 * One card instance exists per participant, so these are the most-instanced
 * components in the SDK. Without memoisation, any state change anywhere in the
 * meeting shell re-renders every tile.
 *
 * Two props need special handling and are why a plain shallow compare is not
 * enough:
 *
 * - `parameters` is a live getter bag whose identity changes constantly by
 *   design. Every read inside a card goes through `getCurrentParams()` or
 *   `getUpdatedAllParams()`, which return fresh state even from a closure
 *   captured several renders ago, so comparing its identity would defeat
 *   memoisation while buying nothing.
 * - `audioDecibels` is rebuilt upstream on every tick. Comparing it by identity
 *   would re-render every tile once a second; only the loudness for this card's
 *   own participant can change what it draws. Note that the video card receives
 *   an array here while the audio card receives a single entry, so both shapes
 *   are handled.
 */

interface AudioDecibelEntry {
  name?: string;
  averageLoudness?: number;
}

/** Props excluded from the shallow pass because they are handled explicitly. */
const HANDLED_SEPARATELY = new Set(['parameters', 'audioDecibels']);

/** Loudness for one participant, or undefined when there is no entry for them. */
const loudnessFor = (source: unknown, name: string | undefined): number | undefined => {
  if (!source || !name) return undefined;

  if (Array.isArray(source)) {
    const match = (source as AudioDecibelEntry[]).find((entry) => entry?.name === name);
    return match?.averageLoudness;
  }

  if (typeof source === 'object') {
    const single = source as AudioDecibelEntry;
    // A single entry carries no name on some call sites; treat it as this
    // card's own reading, which is how the audio card already reads it.
    if (single.name === undefined || single.name === name) {
      return single.averageLoudness;
    }
  }

  return undefined;
};

/** The participant name a card identifies itself by. */
const nameOf = (props: Record<string, unknown>): string | undefined => {
  const participant = props.participant as { name?: string } | null | undefined;
  return participant?.name ?? (props.name as string | undefined);
};

/**
 * Returns true when a stage card can skip re-rendering.
 *
 * Everything other than the two props above is compared by identity. A caller
 * passing inline JSX or a fresh object literal for a slot prop opts that card
 * out of memoisation, which is the correct and safe outcome.
 */
export function stageCardPropsEqual<P extends object>(
  prev: Readonly<P>,
  next: Readonly<P>
): boolean {
  const a = prev as unknown as Record<string, unknown>;
  const b = next as unknown as Record<string, unknown>;

  const prevKeys = Object.keys(a);
  if (prevKeys.length !== Object.keys(b).length) return false;

  for (const key of prevKeys) {
    if (HANDLED_SEPARATELY.has(key)) continue;
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (a[key] !== b[key]) return false;
  }

  return loudnessFor(a.audioDecibels, nameOf(a)) === loudnessFor(b.audioDecibels, nameOf(b));
}

export default stageCardPropsEqual;
