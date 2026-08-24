import { streamSuccessVideo } from '../../../consumers/streamSuccessVideo';
import { streamSuccessAudio } from '../../../consumers/streamSuccessAudio';
import { streamSuccessScreen } from '../../../consumers/streamSuccessScreen';
import { disconnectSendTransportVideo } from '../../../consumers/disconnectSendTransportVideo';
import { disconnectSendTransportAudio } from '../../../consumers/disconnectSendTransportAudio';
import { disconnectSendTransportScreen } from '../../../consumers/disconnectSendTransportScreen';
import { HeadlessOptions, HeadlessParameters } from './headlessTypes';
import { getCurrentParams } from './getCurrentParams';
import { getRoomReadiness } from './getRoomReadiness';
import { HeadlessActionResult } from './roomActions';

export type ProducerKind = 'video' | 'audio' | 'screen';

function hasLiveTrack(stream: MediaStream | null | undefined, kind: 'video' | 'audio'): boolean {
  if (!stream || typeof stream.getTracks !== 'function') return false;
  try {
    return stream
      .getTracks()
      .some((track) => track.kind === kind && track.readyState === 'live');
  } catch {
    return false;
  }
}

/** `VidCons` allows a bare number or a {ideal,max,min} shape. */
function capOf(value: any): number {
  if (typeof value === 'number') return value;
  if (value && typeof value === 'object') {
    const candidate = value.max ?? value.ideal;
    if (typeof candidate === 'number') return candidate;
  }
  return 0;
}

export interface CaptureLimits {
  width: number;
  height: number;
  frameRate: number;
}

export interface GetCaptureLimitsOptions extends HeadlessOptions {
  /** Camera and screen share have separate ceilings. Defaults to camera. */
  kind?: ProducerKind;
}

export type GetCaptureLimitsType = (options: GetCaptureLimitsOptions) => CaptureLimits;

/**
 * The room's allowed capture ceiling — the same `vidCons` / `frameRate` that
 * `clickVideo` feeds to `getUserMedia`. Zero means "no ceiling published".
 */
export function getCaptureLimits({ parameters, kind = 'video' }: GetCaptureLimitsOptions): CaptureLimits {
  const source: HeadlessParameters = parameters || {};
  // Screen share is governed by targetWidth/targetHeight (what startShareScreen
  // passes to getDisplayMedia), not by the camera's vidCons.
  if (kind === 'screen') {
    return {
      width: Number(source.targetWidth) || 0,
      height: Number(source.targetHeight) || 0,
      frameRate: Number(source.frameRate) || 30,
    };
  }
  const vidCons: any = source.vidCons || {};
  return {
    width: capOf(vidCons.width),
    height: capOf(vidCons.height),
    frameRate: Number(source.frameRate) || 0,
  };
}

/**
 * Clamp an incoming track to the room's capture ceiling before it is published.
 *
 * This matters because the publish path here is deliberately *not* `clickVideo`.
 * `clickVideo` applies `vidCons`/`frameRate` when it calls `getUserMedia`;
 * `streamSuccessVideo` — which every produce* helper calls — never re-applies
 * them to a track it is handed. Encoding limits still apply either way
 * (`vParams`/`hParams` carry the `maxBitrate` ladder and are attached at
 * `producerTransport.produce`), so bandwidth stays capped, but *capture
 * dimensions and frame rate* would otherwise be unbounded.
 *
 * Order: try `applyConstraints` first, then verify with `getSettings`. Sources
 * such as `canvas.captureStream()` frequently reject or ignore constraints, so
 * verification is the part that actually enforces — an over-size track that
 * cannot be clamped is refused rather than published.
 */
async function enforceCaptureLimits(
  stream: MediaStream,
  parameters: HeadlessParameters,
  kind: ProducerKind,
  allowUnconstrained: boolean
): Promise<{ ok: boolean; error: string }> {
  if (kind === 'audio') return { ok: true, error: '' };
  const limits = getCaptureLimits({ parameters, kind });
  if (!limits.width && !limits.height && !limits.frameRate) return { ok: true, error: '' };

  let track: MediaStreamTrack | undefined;
  try {
    track = stream.getVideoTracks()[0];
  } catch {
    return { ok: true, error: '' };
  }
  if (!track) return { ok: true, error: '' };

  const constraints: MediaTrackConstraints = {};
  if (limits.width) constraints.width = { max: limits.width };
  if (limits.height) constraints.height = { max: limits.height };
  if (limits.frameRate) constraints.frameRate = { max: limits.frameRate };
  try {
    await track.applyConstraints(constraints);
  } catch {
    // Canvas and element captures commonly reject this; verification below decides.
  }

  let settings: MediaTrackSettings = {};
  try {
    settings = track.getSettings?.() || {};
  } catch {
    return { ok: true, error: '' };
  }
  // A source that reports nothing cannot be verified either way; let it through
  // rather than block a legitimate publish on missing metadata.
  if (!settings.width && !settings.height && !settings.frameRate) {
    return { ok: true, error: '' };
  }

  const over: string[] = [];
  if (limits.width && settings.width && settings.width > limits.width) {
    over.push(`width ${settings.width} > ${limits.width}`);
  }
  if (limits.height && settings.height && settings.height > limits.height) {
    over.push(`height ${settings.height} > ${limits.height}`);
  }
  if (limits.frameRate && settings.frameRate && settings.frameRate > limits.frameRate + 1) {
    over.push(`frameRate ${Math.round(settings.frameRate)} > ${limits.frameRate}`);
  }
  if (over.length === 0) return { ok: true, error: '' };
  if (allowUnconstrained) return { ok: true, error: '' };

  return {
    ok: false,
    error: `This source exceeds the room's capture allowance (${over.join(', ')}). `
      + 'Reduce the source size or frame rate before publishing.',
  };
}

export interface ProduceMediaOptions extends HeadlessOptions {
  /** The stream to publish. Must carry at least one live track of the right kind. */
  stream: MediaStream;
  /** What to publish it as. */
  kind: ProducerKind;
  /**
   * Publish even when the source exceeds the room's `vidCons`/`frameRate`
   * ceiling and cannot be clamped. Off by default: the ceiling is a room
   * entitlement, so bypassing it must be a deliberate, visible choice.
   */
  allowUnconstrained?: boolean;
}

export type ProduceMediaType = (
  options: ProduceMediaOptions
) => Promise<HeadlessActionResult>;

/**
 * Publish **any** MediaStream to the room — not just the camera or microphone.
 *
 * `clickVideo` / `clickAudio` call `getUserMedia` internally, so they can only
 * ever publish a real device. Anything else — a `<canvas>` capture, a `<video>`
 * element playing a file, a Web Audio destination, a processed or synthesised
 * track, a virtual camera — previously required monkey-patching
 * `navigator.mediaDevices.getUserMedia` around the call, which is racy and
 * leaks if the control throws. This publishes your stream directly.
 *
 * The stream stays yours: stop its tracks when you are done, or call
 * {@link stopProducing} to tear the producer down first.
 *
 * @example Publish a canvas as your camera
 * ```ts
 * import { produceMedia } from 'mediasfu-reactjs';
 *
 * const canvas = document.querySelector('canvas')!;
 * const stream = canvas.captureStream(30);
 * await produceMedia({ parameters, stream, kind: 'video' });
 * ```
 *
 * @example Publish a video file's audio and video
 * ```ts
 * const el = document.querySelector('video')!;
 * const stream = (el as any).captureStream();
 * await produceMedia({ parameters, stream, kind: 'video' });
 * await produceMedia({ parameters, stream, kind: 'audio' });
 * ```
 */
export async function produceMedia({
  parameters,
  stream,
  kind,
  allowUnconstrained = false,
}: ProduceMediaOptions): Promise<HeadlessActionResult> {
  try {
    const live = getCurrentParams({ parameters });
    const readiness = getRoomReadiness({ parameters: live });
    if (!readiness.ready) return { ok: false, error: readiness.reason };

    const trackKind = kind === 'audio' ? 'audio' : 'video';
    if (!hasLiveTrack(stream, trackKind)) {
      return {
        ok: false,
        error: `The stream has no live ${trackKind} track to publish.`,
      };
    }

    // The room's capture ceiling is an entitlement, and this path bypasses
    // clickVideo, which is where the SDK normally applies it.
    const limited = await enforceCaptureLimits(stream, live, kind, allowUnconstrained);
    if (!limited.ok) return limited;

    if (kind === 'audio') {
      await streamSuccessAudio({ stream, parameters: live as any });
    } else if (kind === 'screen') {
      await streamSuccessScreen({ stream, parameters: live as any });
    } else {
      await streamSuccessVideo({ stream, parameters: live as any });
    }
    return { ok: true, error: '' };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'The media could not be published.' };
  }
}

export interface StopProducingOptions extends HeadlessOptions {
  kind: ProducerKind;
}

export type StopProducingType = (
  options: StopProducingOptions
) => Promise<HeadlessActionResult>;

/**
 * Tear down one of your producers without touching the others.
 *
 * `clickVideo`/`clickAudio` toggle capture *and* transport together. When you
 * published a custom stream you usually want to stop only the transport and
 * keep owning the stream (to swap sources without a visible gap, for example).
 *
 * @example Swap the published camera for a canvas without dropping the call
 * ```ts
 * await stopProducing({ parameters, kind: 'video' });
 * await produceMedia({ parameters, stream: canvasStream, kind: 'video' });
 * ```
 */
export async function stopProducing({
  parameters,
  kind,
}: StopProducingOptions): Promise<HeadlessActionResult> {
  try {
    const live = getCurrentParams({ parameters });
    if (kind === 'audio') {
      await disconnectSendTransportAudio({ parameters: live as any });
    } else if (kind === 'screen') {
      await disconnectSendTransportScreen({ parameters: live as any });
    } else {
      await disconnectSendTransportVideo({ parameters: live as any });
    }
    return { ok: true, error: '' };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'The producer could not be stopped.' };
  }
}

export interface ProduceCanvasOptions extends HeadlessOptions {
  canvas: HTMLCanvasElement;
  /** Capture frame rate. Defaults to 30. */
  frameRate?: number;
  /** Publish as the camera (default) or as a screen share. */
  as?: 'video' | 'screen';
}

export type ProduceCanvasType = (
  options: ProduceCanvasOptions
) => Promise<HeadlessActionResult & { stream: MediaStream | null }>;

/**
 * Publish a `<canvas>` as video — slides, a whiteboard, a game, a generated
 * overlay, a test pattern.
 *
 * Returns the captured stream so you can stop its tracks when finished.
 *
 * @example
 * ```ts
 * const { ok, stream } = await produceCanvas({ parameters, canvas, frameRate: 15 });
 * // later
 * stream?.getTracks().forEach((track) => track.stop());
 * ```
 */
export async function produceCanvas({
  parameters,
  canvas,
  frameRate = 30,
  as = 'video',
}: ProduceCanvasOptions): Promise<HeadlessActionResult & { stream: MediaStream | null }> {
  try {
    if (!canvas || typeof (canvas as any).captureStream !== 'function') {
      return {
        ok: false,
        error: 'This canvas cannot be captured in the current browser.',
        stream: null,
      };
    }
    const stream: MediaStream = (canvas as any).captureStream(frameRate);
    const result = await produceMedia({ parameters, stream, kind: as });
    if (!result.ok) {
      stream.getTracks().forEach((track) => track.stop());
      return { ...result, stream: null };
    }
    return { ...result, stream };
  } catch (error: any) {
    return {
      ok: false,
      error: error?.message || 'The canvas could not be published.',
      stream: null,
    };
  }
}

export interface ProduceElementOptions extends HeadlessOptions {
  /** A playing `<video>` or `<audio>` element. */
  element: HTMLMediaElement;
  /** Publish the video track. Defaults to true for `<video>`. */
  withVideo?: boolean;
  /** Publish the audio track. Defaults to true. */
  withAudio?: boolean;
}

export type ProduceElementType = (
  options: ProduceElementOptions
) => Promise<HeadlessActionResult & { stream: MediaStream | null }>;

/**
 * Publish a playing `<video>` or `<audio>` element — media co-watching, a
 * pre-recorded intro, background music, an HLS or MP4 source.
 *
 * The element must actually be playing: a paused element captures no frames, and
 * browsers block autoplay with audio until the user has interacted with the page.
 *
 * @example
 * ```ts
 * const el = document.querySelector('video')!;
 * await el.play();
 * await produceElement({ parameters, element: el });
 * ```
 */
export async function produceElement({
  parameters,
  element,
  withVideo,
  withAudio = true,
}: ProduceElementOptions): Promise<HeadlessActionResult & { stream: MediaStream | null }> {
  try {
    const capture =
      (element as any)?.captureStream || (element as any)?.mozCaptureStream;
    if (typeof capture !== 'function') {
      return {
        ok: false,
        error: 'This element cannot be captured in the current browser.',
        stream: null,
      };
    }
    const stream: MediaStream = capture.call(element);
    const wantsVideo = withVideo ?? hasLiveTrack(stream, 'video');

    const results: HeadlessActionResult[] = [];
    if (wantsVideo && hasLiveTrack(stream, 'video')) {
      results.push(await produceMedia({ parameters, stream, kind: 'video' }));
    }
    if (withAudio && hasLiveTrack(stream, 'audio')) {
      results.push(await produceMedia({ parameters, stream, kind: 'audio' }));
    }
    if (results.length === 0) {
      return { ok: false, error: 'The element has no live tracks yet.', stream: null };
    }
    const failure = results.find((result) => !result.ok);
    if (failure) return { ...failure, stream };
    return { ok: true, error: '', stream };
  } catch (error: any) {
    return {
      ok: false,
      error: error?.message || 'The element could not be published.',
      stream: null,
    };
  }
}

export interface ProduceDisplayOptions extends HeadlessOptions {
  /** Passed to `getDisplayMedia`. Defaults to `{ video: true }`. */
  constraints?: DisplayMediaStreamOptions;
  /** Also publish the captured system/tab audio when the user shares it. */
  withAudio?: boolean;
}

export type ProduceDisplayType = (
  options: ProduceDisplayOptions
) => Promise<HeadlessActionResult & { stream: MediaStream | null }>;

/**
 * Start a screen share from a headless surface.
 *
 * `getDisplayMedia` must be called from a user gesture, so invoke this directly
 * in a click handler — not after an `await`.
 *
 * @example
 * ```tsx
 * <button onClick={() => produceDisplay({ parameters })}>Share screen</button>
 * ```
 */
export async function produceDisplay({
  parameters,
  constraints = { video: true },
  withAudio = false,
}: ProduceDisplayOptions): Promise<HeadlessActionResult & { stream: MediaStream | null }> {
  try {
    const mediaDevices: any =
      (parameters as HeadlessParameters)?.mediaDevices ||
      (typeof navigator !== 'undefined' ? navigator.mediaDevices : null);
    if (!mediaDevices || typeof mediaDevices.getDisplayMedia !== 'function') {
      return {
        ok: false,
        error: 'Screen capture is unavailable in this browser.',
        stream: null,
      };
    }
    const stream: MediaStream = await mediaDevices.getDisplayMedia({
      ...constraints,
      ...(withAudio ? { audio: true } : {}),
    });
    const result = await produceMedia({ parameters, stream, kind: 'screen' });
    if (!result.ok) {
      stream.getTracks().forEach((track) => track.stop());
      return { ...result, stream: null };
    }
    if (withAudio && hasLiveTrack(stream, 'audio')) {
      await produceMedia({ parameters, stream, kind: 'audio' });
    }
    return { ...result, stream };
  } catch (error: any) {
    // A user dismissing the picker rejects here; that is not an error worth shouting about.
    const name = error?.name || '';
    if (name === 'NotAllowedError' || name === 'AbortError') {
      return { ok: false, error: 'Screen sharing was cancelled.', stream: null };
    }
    return {
      ok: false,
      error: error?.message || 'The screen could not be shared.',
      stream: null,
    };
  }
}

export interface ReplaceProducerTrackOptions extends HeadlessOptions {
  /** The replacement track. Its kind decides which producer is swapped. */
  track: MediaStreamTrack;
}

export type ReplaceProducerTrackType = (
  options: ReplaceProducerTrackOptions
) => Promise<HeadlessActionResult>;

/**
 * Swap the track on a live producer without renegotiating.
 *
 * This is the seamless path for switching camera, applying or removing a
 * background effect, or moving between media sources: remote participants see
 * no interruption, because the producer and its transport stay up.
 *
 * @example
 * ```ts
 * const processed = applyBackgroundBlur(cameraTrack);
 * await replaceProducerTrack({ parameters, track: processed });
 * ```
 */
export async function replaceProducerTrack({
  parameters,
  track,
}: ReplaceProducerTrackOptions): Promise<HeadlessActionResult> {
  try {
    if (!track || track.readyState !== 'live') {
      return { ok: false, error: 'The replacement track is not live.' };
    }
    const live = getCurrentParams({ parameters });
    const producer =
      track.kind === 'audio'
        ? live.audioProducer || live.localAudioProducer
        : live.videoProducer || live.localVideoProducer;
    if (!producer || typeof producer.replaceTrack !== 'function') {
      return {
        ok: false,
        error: `There is no live ${track.kind} producer to replace.`,
      };
    }
    await producer.replaceTrack({ track });
    return { ok: true, error: '' };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'The track could not be replaced.' };
  }
}
