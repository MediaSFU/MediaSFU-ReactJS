import { Participant, Stream } from '../../../@types/types';
import { HeadlessOptions, HeadlessParameters, ResolvedMedia } from './headlessTypes';

/**
 * MediaSFU seeds its own grid collections with a self marker rather than a real
 * producer. Rendering it as a remote peer shows the local user twice.
 */
const SELF_PRODUCER_IDS = new Set(['youyou', 'youyouyou']);

function toMediaStream(value: any): MediaStream | null {
  if (value && typeof value.getTracks === 'function') return value as MediaStream;
  const nested = value?.stream;
  return nested && typeof nested.getTracks === 'function'
    ? (nested as MediaStream)
    : null;
}


/**
 * A stream is only renderable if it still carries a live track of that kind.
 *
 * MediaSFU keeps `localStreamVideo` assigned after the camera is switched off —
 * the track goes `enabled: false` or `readyState: 'ended'` rather than the
 * field being cleared. Returning it regardless paints a black <video> instead
 * of falling back to an audio or identity card.
 *
 * `enabled` is only meaningful for local media: the app clears it when the user
 * turns their own camera off. It is never applied to remote tracks, where
 * `muted: true` is a normal transient state before the first frame decodes.
 */
function hasRenderableTrack(
  stream: MediaStream | null,
  kind: 'video' | 'audio',
  requireEnabled: boolean
): stream is MediaStream {
  if (!stream || typeof stream.getTracks !== 'function') return false;
  try {
    return stream.getTracks().some(
      (track) =>
        track.kind === kind &&
        track.readyState === 'live' &&
        (!requireEnabled || track.enabled !== false)
    );
  } catch {
    return false;
  }
}

function collect(
  entries: (Participant | Stream)[] | undefined
): (Participant | Stream)[] {
  return Array.isArray(entries) ? entries : [];
}

function dedupe(entries: (Participant | Stream)[]): ResolvedMedia[] {
  const seen = new Set<string>();
  const resolved: ResolvedMedia[] = [];
  for (const entry of entries) {
    const producerId = (entry as any)?.producerId || '';
    if (SELF_PRODUCER_IDS.has(producerId)) continue;
    const stream = toMediaStream(entry);
    if (!hasRenderableTrack(stream, 'video', false)) continue;
    const key = producerId || stream.id || '';
    if (key && seen.has(key)) continue;
    if (key) seen.add(key);
    resolved.push({
      stream,
      producerId,
      name: (entry as any)?.name || '',
    });
  }
  return resolved;
}

export type GetRemoteVideoStreamsType = (
  options: HeadlessOptions
) => ResolvedMedia[];

/**
 * Every remote camera in the room, in render order.
 *
 * Two details make this hard to get right by hand, and both are why headless
 * integrations lose the host's video:
 *
 *  - **`oldAllStreams` matters.** During normal conference layout processing the
 *    SDK moves a stream out of `allVideoStreams` into `oldAllStreams`. Reading
 *    only `allVideoStreams` makes the host disappear mid-call.
 *  - **The self marker must go.** `allVideoStreams` is seeded with a
 *    `producerId: 'youyou'` placeholder for the local user.
 *
 * Entries are de-duplicated by `producerId`, falling back to the stream id, so a
 * stream present in both collections is returned once.
 *
 * @example
 * ```ts
 * import { getRemoteVideoStreams } from 'mediasfu-reactjs';
 *
 * const remotes = getRemoteVideoStreams({ parameters });
 * const primary = remotes[0]?.stream ?? null;
 * ```
 */
export function getRemoteVideoStreams({
  parameters,
}: HeadlessOptions): ResolvedMedia[] {
  const source: HeadlessParameters = parameters || {};
  return dedupe([
    ...collect(source.oldAllStreams),
    ...collect(source.allVideoStreams),
  ]);
}

export type GetRemoteAudioStreamsType = (
  options: HeadlessOptions
) => ResolvedMedia[];

/**
 * Every remote audio producer in the room.
 *
 * Note that for *hearing* participants you normally want
 * {@link getAudioGridComponents} instead — MediaSFU prepares its own audio
 * elements and mounting those is what actually plays sound. This helper is for
 * cases where you need the raw `MediaStream` (recording, analysis, metering).
 */
export function getRemoteAudioStreams({
  parameters,
}: HeadlessOptions): ResolvedMedia[] {
  const source: HeadlessParameters = parameters || {};
  return dedupe(collect(source.allAudioStreams));
}

export type GetLocalVideoStreamType = (
  options: HeadlessOptions
) => MediaStream | null;

/**
 * The local camera stream to render as the self-view.
 *
 * The virtual-background case is the one everyone misses: when `keepBackground`
 * is on, the stream that carries the processed frames is `virtualStream`, and
 * `localStreamVideo` still holds the raw camera. Rendering the wrong one shows
 * the user their unprocessed background. This mirrors the SDK's own grid rule.
 *
 * Returns `null` when the camera is off, so a falsy result is a truthful
 * "no self-view" rather than something to paint black.
 *
 * Note: transport state such as `videoParams` or `videoProducer` is **not**
 * renderable media and is deliberately never consulted here.
 */
export function getLocalVideoStream({
  parameters,
}: HeadlessOptions): MediaStream | null {
  const source: HeadlessParameters = parameters || {};
  if (source.keepBackground && source.virtualStream) {
    const virtual = toMediaStream(source.virtualStream);
    if (hasRenderableTrack(virtual, 'video', true)) return virtual;
  }
  const camera = toMediaStream(source.localStreamVideo);
  if (hasRenderableTrack(camera, 'video', true)) return camera;
  const combined = toMediaStream(source.localStream);
  return hasRenderableTrack(combined, 'video', true) ? combined : null;
}

export type GetLocalAudioStreamType = (
  options: HeadlessOptions
) => MediaStream | null;

/** The local microphone stream, or `null` when the mic is off. */
export function getLocalAudioStream({
  parameters,
}: HeadlessOptions): MediaStream | null {
  const source: HeadlessParameters = parameters || {};
  const mic = toMediaStream(source.localStreamAudio);
  if (hasRenderableTrack(mic, 'audio', true)) return mic;
  const combined = toMediaStream(source.localStream);
  return hasRenderableTrack(combined, 'audio', true) ? combined : null;
}

export interface ScreenShareState {
  /** The stream to render, local or remote, or `null` when nobody is sharing. */
  stream: MediaStream | null;
  /** True when the stream is this user's own screen. */
  isLocal: boolean;
  /** True when any screen share is active in the room. */
  active: boolean;
}

export type GetScreenShareStreamType = (
  options: HeadlessOptions
) => ScreenShareState;

/**
 * The active screen share, remote first.
 *
 * `remoteScreenStream` is an array in some SDK paths and a bare object in
 * others; both shapes are handled here so callers do not have to guess.
 *
 * @example
 * ```ts
 * const share = getScreenShareStream({ parameters });
 * const primary = share.stream ?? remotes[0]?.stream ?? localVideo;
 * ```
 */
export function getScreenShareStream({
  parameters,
}: HeadlessOptions): ScreenShareState {
  const source: HeadlessParameters = parameters || {};
  const remoteRaw: any = source.remoteScreenStream;
  const remote = Array.isArray(remoteRaw)
    ? toMediaStream(remoteRaw[0])
    : toMediaStream(remoteRaw);
  // Liveness matters most here. When a sharer stops, the SDK ends the track but
  // `remoteScreenStream` keeps referencing it, so a viewer that trusts the field
  // renders a dead track — a screen share that "ends" into a black stage.
  // `enabled` is not required: it is a local-only flag and never set on a
  // received screen track.
  if (hasRenderableTrack(remote, 'video', false)) {
    return { stream: remote, isLocal: false, active: true };
  }

  const local = toMediaStream(source.localStreamScreen);
  if (hasRenderableTrack(local, 'video', true)) {
    return { stream: local, isLocal: true, active: true };
  }

  return {
    stream: null,
    isLocal: false,
    active: Boolean(source.shareScreenStarted || source.shared),
  };
}

export type GetAudioGridComponentsType = (options: HeadlessOptions) => any[];

/**
 * The prepared audio elements to mount so participants are actually audible.
 *
 * Mount **all** of them. Truncating this list to the participants you happen to
 * draw on screen silently mutes everyone else — audio playback is decoupled from
 * your video layout. The usual pattern is a visually hidden container:
 *
 * @example
 * ```tsx
 * import { AudioGrid, getAudioGridComponents } from 'mediasfu-reactjs';
 *
 * <div style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}>
 *   <AudioGrid componentsToRender={getAudioGridComponents({ parameters })} />
 * </div>
 * ```
 */
export function getAudioGridComponents({ parameters }: HeadlessOptions): any[] {
  const source: HeadlessParameters = parameters || {};
  return [
    ...(Array.isArray(source.audioOnlyStreams) ? source.audioOnlyStreams : []),
    ...(Array.isArray(source.translationStreams) ? source.translationStreams : []),
  ].filter(Boolean);
}
