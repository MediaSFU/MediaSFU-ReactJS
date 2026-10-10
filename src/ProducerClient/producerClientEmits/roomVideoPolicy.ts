/**
 * Camera-only policy. Screen-sharing and audio encodings are unchanged.
 * Server capacity wins over a hint; recording does not increase camera bitrate.
 */
export interface CameraEncodingPolicy {
  simulcastOff?: boolean;
  roomCapacity?: number;
}

export function cameraSimulcastOff(
  eventType: string,
  capacity: number | undefined,
  options: CameraEncodingPolicy = {},
): boolean {
  const roomCapacity = capacity ?? options.roomCapacity;
  return options.simulcastOff === true || eventType === 'chat' || roomCapacity === 2;
}

type CameraEncoding = {
  rid?: string;
  scaleResolutionDownBy?: number;
  scalabilityMode?: string;
};

/** Mutate only the fresh room preset, preserving its original-preset lineage. */
export function applyCameraEncodingPolicy<T extends { encodings: CameraEncoding[] }>(
  params: T,
  singleEncoding: boolean,
): T {
  if (!singleEncoding || !params.encodings.length) return params;
  // Presets conventionally put the full-resolution layer last. Do not assume
  // that order for custom presets; select the least downscaled encoding.
  const full = params.encodings.reduce((best, encoding) =>
    (encoding.scaleResolutionDownBy ?? 1) <= (best.scaleResolutionDownBy ?? 1)
      ? encoding : best);
  const encoding = { ...full, scaleResolutionDownBy: 1 };
  delete encoding.rid;
  if (encoding.scalabilityMode) encoding.scalabilityMode = 'L1T3';
  params.encodings = [encoding];
  return params;
}
