export interface EmbeddedControlFractionsOptions {
  containerHeightFraction?: number;
  controlViewportFraction?: number;
  showControls?: boolean;
}

/**
 * MainAspect is sized inside the embedded room, while SubAspect is sized from
 * the viewport. Convert the control strip into the embedded room's coordinate
 * system so the two siblings exactly fill, and never overlap, their container.
 */
export function resolveEmbeddedControlFractions({
  containerHeightFraction = 1,
  controlViewportFraction = 0,
  showControls = true,
}: EmbeddedControlFractionsOptions) {
  const boundary = Math.max(0, Number(containerHeightFraction) || 0);
  if (!showControls || boundary === 0) {
    return {
      mainFraction: boundary === 0 ? 0 : 1,
      subViewportFraction: 0,
    };
  }

  const subViewportFraction = Math.min(
    boundary,
    Math.max(0, Number(controlViewportFraction) || 0),
  );

  return {
    mainFraction: Math.max(0, 1 - (subViewportFraction / boundary)),
    subViewportFraction,
  };
}
