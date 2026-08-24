import { SelfieSegmentation } from '@mediapipe/selfie_segmentation';
import { HeadlessOptions } from './headlessTypes';
import { getCurrentParams } from './getCurrentParams';
import { getLocalVideoStream } from './getMediaStreams';
import { HeadlessActionResult } from './roomActions';

const MEDIAPIPE_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation';

/**
 * One running background session. Kept module-level because the pipeline owns
 * real resources (a MediaPipe instance, a RAF loop, an offscreen canvas) that
 * must be torn down exactly once, and because a second call should replace the
 * first rather than stack another loop on the same camera.
 */
interface BackgroundSession {
  stop: () => void;
  stream: MediaStream;
  sourceTrack: MediaStreamTrack | null;
}
let session: BackgroundSession | null = null;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    // Backgrounds are usually served cross-origin; without this the canvas is
    // tainted and captureStream() throws a SecurityError instead of producing
    // frames — a failure that looks like "virtual background silently does nothing".
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('The background image could not be loaded.'));
    image.src = src;
  });
}

export interface ApplyVirtualBackgroundOptions extends HeadlessOptions {
  /**
   * Background image URL, or a ready `HTMLImageElement` / `HTMLCanvasElement`.
   * Pass `null` to segment the person onto a transparent background.
   */
  image: string | HTMLImageElement | HTMLCanvasElement | null;
  /** Capture frame rate for the processed stream. Defaults to 30. */
  frameRate?: number;
  /** MediaPipe model: 0 = general, 1 = landscape (faster). Defaults to 1. */
  modelSelection?: 0 | 1;
  /**
   * Replace the live producer's track so remote viewers see the background
   * immediately. Defaults to true; set false to preview locally first.
   */
  publish?: boolean;
  /**
   * Where to load the MediaPipe model and wasm from. Defaults to the jsDelivr
   * CDN. Point this at a self-hosted copy of
   * `node_modules/@mediapipe/selfie_segmentation` for offline or air-gapped
   * deployments, or where a Content-Security-Policy forbids the CDN.
   * A trailing slash is added if missing.
   */
  assetPath?: string;
}

export type ApplyVirtualBackgroundType = (
  options: ApplyVirtualBackgroundOptions
) => Promise<HeadlessActionResult & { stream: MediaStream | null }>;

/**
 * Apply a virtual background headlessly — no modal, no DOM of your own.
 *
 * The SDK's own background support lives inside `BackgroundModal`, whose apply
 * path is bound to that component's refs (a preview `<video>` and a `<canvas>`)
 * and is driven by `autoClickBackground` / `isBackgroundModalVisible`. A
 * `returnUI={false}` surface therefore had no way to turn a background on
 * without mounting the modal off-screen and simulating a click.
 *
 * This runs the same MediaPipe pipeline the modal uses — identical compositing:
 * draw the segmentation mask, retain the person with `source-in`, then paint
 * the replacement behind them with `destination-over` — against an offscreen
 * video and canvas it creates and owns.
 *
 * It also keeps the SDK's own state honest (`virtualStream`, `processedStream`,
 * `keepBackground`), so `getLocalVideoStream` keeps returning the right
 * self-view without the caller choosing. Callers should not select the
 * processed stream themselves.
 *
 * The camera must already be on: this processes `localStreamVideo`, it does not
 * acquire one.
 *
 * @example
 * ```ts
 * await applyVirtualBackground({ parameters, image: '/backgrounds/office.jpg' });
 * await clearVirtualBackground({ parameters });
 * ```
 */
export async function applyVirtualBackground({
  parameters,
  image,
  frameRate = 30,
  modelSelection = 1,
  publish = true,
  assetPath = MEDIAPIPE_CDN,
}: ApplyVirtualBackgroundOptions): Promise<HeadlessActionResult & { stream: MediaStream | null }> {
  const live = getCurrentParams({ parameters });
  if (live.audioOnlyRoom) {
    return { ok: false, error: 'You cannot use a background in an audio-only event.', stream: null };
  }
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return { ok: false, error: 'Virtual backgrounds require a browser environment.', stream: null };
  }

  // Always process the *raw* camera. Reading through getLocalVideoStream would
  // feed an already-processed stream back through segmentation once a
  // background is running, compounding artefacts on every change.
  const camera = (live.localStreamVideo as MediaStream | null)
    || getLocalVideoStream({ parameters: live });
  const sourceTrack = camera?.getVideoTracks?.()[0] || null;
  if (!sourceTrack || sourceTrack.readyState !== 'live') {
    return { ok: false, error: 'Turn your camera on before applying a background.', stream: null };
  }

  // Replacing an existing session must not leave the old loop running.
  if (session) { session.stop(); session = null; }

  try {
    const settings = sourceTrack.getSettings ? sourceTrack.getSettings() : {};
    const width = Number(settings.width) || 640;
    const height = Number(settings.height) || 360;

    const backgroundImage = typeof image === 'string' ? await loadImage(image) : image;

    const video = document.createElement('video');
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    video.srcObject = new MediaStream([sourceTrack]);
    await video.play().catch(() => {});

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('This browser cannot composite a background.');

    const base = assetPath.endsWith('/') ? assetPath.slice(0, -1) : assetPath;
    const segmentation = new SelfieSegmentation({
      locateFile: (file: string) => `${base}/${file}`,
    });
    segmentation.setOptions({ modelSelection, selfieMode: false });
    await segmentation.initialize();

    // Same compositing as the SDK's modal, so the result is visually identical.
    segmentation.onResults((results: any) => {
      try {
        if (!canvas.width || !canvas.height) return;
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-in';
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'destination-over';
        if (backgroundImage) {
          const pattern = ctx.createPattern(backgroundImage as CanvasImageSource, 'repeat');
          ctx.fillStyle = pattern || 'transparent';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.restore();
      } catch {
        // A dropped frame must never kill the loop.
      }
    });

    let stopped = false;
    let frameHandle = 0;
    const pump = async () => {
      if (stopped) return;
      try {
        if (video.readyState >= 2) await segmentation.send({ image: video });
      } catch {
        // Ignore a single failed frame; the next one is already queued.
      }
      frameHandle = window.requestAnimationFrame(() => { void pump(); });
    };
    void pump();

    const processed: MediaStream = (canvas as any).captureStream(frameRate);
    if (!processed?.getVideoTracks?.().length) {
      throw new Error('The processed background stream produced no video track.');
    }

    const stop = () => {
      if (stopped) return;
      stopped = true;
      window.cancelAnimationFrame(frameHandle);
      try { segmentation.close(); } catch { /* already closed */ }
      processed.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    };
    session = { stop, stream: processed, sourceTrack };

    // Keep the SDK's own view of the world correct, so getLocalVideoStream and
    // getVirtualBackgroundState stay accurate without the caller intervening.
    live.updateVirtualStream?.(processed);
    live.updateProcessedStream?.(processed);
    live.updateKeepBackground?.(true);

    if (publish) {
      const producer = live.videoProducer || live.localVideoProducer;
      const track = processed.getVideoTracks()[0];
      if (producer && typeof producer.replaceTrack === 'function' && track) {
        // replaceTrack avoids renegotiation, so remote viewers see the
        // background appear without the call visibly reconnecting.
        await producer.replaceTrack({ track });
      }
    }

    return { ok: true, error: '', stream: processed };
  } catch (error: any) {
    if (session) { session.stop(); session = null; }
    return {
      ok: false,
      error: error?.message || 'The virtual background could not be applied.',
      stream: null,
    };
  }
}

export type ClearVirtualBackgroundType = (
  options: HeadlessOptions
) => Promise<HeadlessActionResult>;

/**
 * Remove the virtual background and go back to the raw camera.
 *
 * Restores the original camera track on the live producer before tearing the
 * pipeline down, so viewers transition straight from processed to raw rather
 * than through a frozen or black frame.
 */
export async function clearVirtualBackground({
  parameters,
}: HeadlessOptions): Promise<HeadlessActionResult> {
  const live = getCurrentParams({ parameters });
  const active = session;
  if (!active) {
    live.updateKeepBackground?.(false);
    return { ok: true, error: '' };
  }
  try {
    const producer = live.videoProducer || live.localVideoProducer;
    const original = active.sourceTrack;
    if (producer && typeof producer.replaceTrack === 'function'
      && original && original.readyState === 'live') {
      await producer.replaceTrack({ track: original });
    }
    active.stop();
    session = null;
    live.updateVirtualStream?.(null);
    live.updateProcessedStream?.(null);
    live.updateKeepBackground?.(false);
    return { ok: true, error: '' };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'The virtual background could not be cleared.' };
  }
}

/** True while a headless background pipeline is running in this tab. */
export function isVirtualBackgroundRunning(): boolean {
  return session !== null;
}
