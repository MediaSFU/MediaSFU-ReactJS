export type AudioProcessingOptions = {
  echoCancellation?: boolean;
  noiseSuppression?: boolean;
  autoGainControl?: boolean;
};

export function audioProcessingConstraints(options?: AudioProcessingOptions): MediaTrackConstraints {
  const result: MediaTrackConstraints = {};
  if (options === undefined) return result;
  if (!options || typeof options !== 'object' || Array.isArray(options)) throw new TypeError('Invalid audioProcessing');
  for (const key of Object.keys(options)) {
    if (!['echoCancellation', 'noiseSuppression', 'autoGainControl'].includes(key)) throw new TypeError('Unsupported audioProcessing option');
    const value = options[key as keyof AudioProcessingOptions];
    if (value !== undefined && typeof value !== 'boolean') throw new TypeError('Audio processing options must be boolean');
    if (value !== undefined) result[key as keyof AudioProcessingOptions] = value;
  }
  return result;
}

// applyConstraints replaces the constraint set: merge to retain device and
// capture choices unrelated to the three processing preferences.
export async function applyAudioProcessing(track: MediaStreamTrack, options?: AudioProcessingOptions): Promise<void> {
  const selected = audioProcessingConstraints(options);
  if (!Object.keys(selected).length) return;
  await track.applyConstraints({ ...track.getConstraints(), ...selected });
}
