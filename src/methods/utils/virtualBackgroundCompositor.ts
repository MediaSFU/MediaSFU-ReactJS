export interface CompositeVirtualBackgroundFrameOptions {
  ctx: CanvasRenderingContext2D;
  segmentationMask: CanvasImageSource;
  sourceImage: CanvasImageSource;
  backgroundImage?: CanvasImageSource | null;
  width: number;
  height: number;
  repeatPattern?: "repeat" | "repeat-x" | "repeat-y" | "no-repeat";
  blurFallbackPixels?: number;
}

/** Stable room-state value used by every UI surface for background blur. */
export const VIRTUAL_BACKGROUND_BLUR = "blur";
export const DEFAULT_BACKGROUND_BLUR_PIXELS = 16;

export function isVirtualBackgroundBlur(value: unknown): boolean {
  return value === VIRTUAL_BACKGROUND_BLUR;
}

/** Preserve the segmented person, then paint the replacement behind them. */
export function compositeVirtualBackgroundFrame({
  ctx,
  segmentationMask,
  sourceImage,
  backgroundImage = null,
  width,
  height,
  repeatPattern = "repeat",
  blurFallbackPixels = 0,
}: CompositeVirtualBackgroundFrameOptions): void {
  const previousFilter = ctx.filter;
  ctx.save();
  try {
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(segmentationMask, 0, 0, width, height);

    ctx.globalCompositeOperation = "source-in";
    ctx.drawImage(sourceImage, 0, 0, width, height);

    ctx.globalCompositeOperation = "destination-over";
    if (backgroundImage) {
      const pattern = ctx.createPattern(backgroundImage, repeatPattern);
      ctx.fillStyle = pattern || "transparent";
      ctx.fillRect(0, 0, width, height);
    } else if (blurFallbackPixels > 0) {
      ctx.filter = `blur(${blurFallbackPixels}px)`;
      // Draw beyond the visible bounds so the blur kernel does not expose a
      // transparent/black fringe around the processed frame.
      const bleed = Math.max(2, blurFallbackPixels * 2);
      ctx.drawImage(
        sourceImage,
        -bleed,
        -bleed,
        width + bleed * 2,
        height + bleed * 2,
      );
    }
  } finally {
    ctx.filter = previousFilter || "none";
    ctx.globalCompositeOperation = "source-over";
    ctx.restore();
  }
}
