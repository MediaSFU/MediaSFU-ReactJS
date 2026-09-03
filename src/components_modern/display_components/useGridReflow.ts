/**
 * Animates grid cells to their new positions instead of letting them snap.
 *
 * When someone joins or leaves a call, or you page through participants, the
 * grid geometry changes and every tile lands somewhere new. Without this the
 * change is instantaneous — the single most-seen and least-designed moment in
 * a meeting UI.
 *
 * This is a FLIP pass: after the DOM has been updated, each cell is measured,
 * compared with where it was, and given an inverted transform that is then
 * released on the next frame. The browser animates `transform` only, so the
 * whole thing stays on the compositor and never triggers layout — which matters
 * a great deal when every one of these cells contains a live video surface.
 *
 * Cells are matched by the `data-mediasfu-cell` attribute, which carries the
 * same key the grid already uses. When a caller supplies each card with a
 * stable key, tiles are tracked across the re-layout; when they don't, the key
 * falls back to the cell position and tiles cross-fade in place instead.
 */

import { useEffect, useLayoutEffect, useRef } from 'react';

/** Position of one cell, in container-relative coordinates. */
interface CellBox {
  left: number;
  top: number;
}

export interface GridReflowOptions {
  /** Duration of the glide, in milliseconds. */
  duration?: number;
  /** Easing for the glide. */
  easing?: string;
  /** Duration of the entrance for cells that were not there before. */
  enterDuration?: number;
}

const CELL_SELECTOR = '[data-mediasfu-cell]';
const GRID_SELECTOR = '[data-mediasfu-grid]';

/**
 * Cells belonging to this grid, excluding any nested grid's own cells.
 *
 * Meetings render more than one grid at a time, and a descendant selector alone
 * would measure the inner grid's tiles against the outer grid's origin.
 */
const ownCells = (container: HTMLElement): HTMLElement[] =>
  Array.from(container.querySelectorAll<HTMLElement>(CELL_SELECTOR)).filter(
    (node) => node.closest(GRID_SELECTOR) === container
  );

/** Movement below this many pixels is not worth animating. */
const MOVEMENT_EPSILON = 0.5;

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * @param containerRef  The grid wrapper holding the cells.
 * @param signature     A value that changes whenever the layout changes —
 *                      typically rows, columns and participant count. The
 *                      measure pass only runs when this changes, so an ordinary
 *                      re-render costs nothing.
 * @param enabled       Set false to opt out entirely.
 */
export function useGridReflow(
  containerRef: React.RefObject<HTMLElement | null>,
  signature: string,
  enabled: boolean,
  options: GridReflowOptions = {}
): void {
  const {
    duration = 320,
    easing = 'cubic-bezier(0.16, 1, 0.3, 1)',
    enterDuration = 260,
  } = options;

  const previous = useRef<Map<string, CellBox>>(new Map());
  const frame = useRef<number | null>(null);

  // Keep the snapshot honest across container resizes. A window resize moves
  // every cell without changing the signature, and animating from those stale
  // positions on the next join would send tiles flying from the wrong place.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return undefined;

    const observer = new ResizeObserver(() => {
      previous.current = measure(container);
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, [containerRef]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const next = measure(container);

    if (!enabled || prefersReducedMotion()) {
      previous.current = next;
      return undefined;
    }

    const before = previous.current;
    previous.current = next;

    // Nothing to animate from on the very first pass.
    if (before.size === 0) return undefined;

    const cells = ownCells(container);
    const moved: Array<{ node: HTMLElement; dx: number; dy: number }> = [];
    const entered: HTMLElement[] = [];

    cells.forEach((node) => {
      const key = node.dataset.mediasfuCell;
      if (!key) return;

      const now = next.get(key);
      const then = before.get(key);

      if (!now) return;

      if (!then) {
        entered.push(node);
        return;
      }

      const dx = then.left - now.left;
      const dy = then.top - now.top;

      if (Math.abs(dx) > MOVEMENT_EPSILON || Math.abs(dy) > MOVEMENT_EPSILON) {
        moved.push({ node, dx, dy });
      }
    });

    if (moved.length === 0 && entered.length === 0) return undefined;

    // Invert: put everything back where it was, with no transition, so the
    // frame the user sees is identical to the one before the re-layout.
    moved.forEach(({ node, dx, dy }) => {
      node.style.transition = 'none';
      node.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    });

    entered.forEach((node) => {
      node.style.transition = 'none';
      node.style.opacity = '0';
      node.style.transform = 'scale(0.92)';
    });

    // Play: release on the next frame so the browser has committed the
    // inverted state first.
    frame.current = requestAnimationFrame(() => {
      moved.forEach(({ node }) => {
        node.style.transition = `transform ${duration}ms ${easing}`;
        node.style.transform = '';
      });

      entered.forEach((node) => {
        node.style.transition = `opacity ${enterDuration}ms ease-out, transform ${enterDuration}ms ${easing}`;
        node.style.opacity = '';
        node.style.transform = '';
      });
    });

    return () => {
      if (frame.current !== null) {
        cancelAnimationFrame(frame.current);
        frame.current = null;
      }
    };
    // `signature` is the whole point: measuring on every render would force a
    // layout each time, which is exactly what this is meant to avoid.
  }, [signature, enabled, duration, easing, enterDuration]);
}

/** Reads every cell's position relative to the container. */
function measure(container: HTMLElement): Map<string, CellBox> {
  const boxes = new Map<string, CellBox>();
  const origin = container.getBoundingClientRect();

  ownCells(container).forEach((node) => {
    const key = node.dataset.mediasfuCell;
    if (!key) return;
    const rect = node.getBoundingClientRect();
    boxes.set(key, { left: rect.left - origin.left, top: rect.top - origin.top });
  });

  return boxes;
}

export default useGridReflow;
