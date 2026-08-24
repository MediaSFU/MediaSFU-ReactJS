import { HeadlessOptions, HeadlessParameters } from './headlessTypes';

export type GetCurrentParamsType = (
  options: HeadlessOptions
) => HeadlessParameters;

/**
 * Read the freshest parameter bag **without** triggering a republish.
 *
 * `parameters.getUpdatedAllParams()` looks like a getter but is not one: it
 * reassigns `sourceParameters` and calls `updateSourceParameters` as a side
 * effect. Calling it from a React event handler or a polling loop therefore
 * re-enters your own update path, which at best causes a render storm and at
 * worst locks the tab before `getUserMedia` resolves.
 *
 * MediaSFU components now publish a pure `getCurrentParams()` on the bag; this
 * helper uses it when present and otherwise returns the bag you already hold.
 * It never calls `getUpdatedAllParams()` and never throws.
 *
 * @example
 * ```ts
 * import { getCurrentParams } from 'mediasfu-reactjs';
 *
 * // Safe inside a click handler — no re-entrant publish.
 * const live = getCurrentParams({ parameters: sourceParameters.current });
 * await live.clickVideo({ parameters: live });
 * ```
 */
export function getCurrentParams({
  parameters,
}: HeadlessOptions): HeadlessParameters {
  const source = parameters || {};
  if (typeof source.getCurrentParams === 'function') {
    try {
      const refreshed = source.getCurrentParams();
      if (refreshed && typeof refreshed === 'object') return refreshed;
    } catch {
      // Fall through to the bag the caller already holds.
    }
  }
  return source;
}

export default getCurrentParams;
