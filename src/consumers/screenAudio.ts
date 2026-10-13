import { Producer } from "mediasoup-client/lib/types";
import { Participant } from "../@types/types";

/**
 * Screen audio: the audio of a shared tab, window or screen, published as its own producer tagged
 * `appData.mediaTag === "screen-audio"`. It belongs to the screen share (starts, pauses, resumes and stops with it),
 * never to the sharer's microphone, so it never marks the sharer as speaking.
 *
 * A client only publishes it when the media server says so in the join response (`supportsScreenAudio`), so new
 * clients keep today's video-only screen share on older servers.
 */
export const SCREEN_AUDIO_MEDIA_TAG = "screen-audio";

/** Opus settings for shared media (music, video soundtracks) rather than voice. */
export const SCREEN_AUDIO_CODEC_OPTIONS = {
  opusStereo: true,
  opusDtx: false,
  opusFec: true,
  opusMaxAverageBitrate: 128000,
};

// Producer ids are globally unique, so one registry serves every room instance on the page.
const screenAudioProducerIds = new Set<string>();

/** Records a producer announced by the server as screen audio (`mediaTag: "screen-audio"`). */
export const markScreenAudioProducer = (producerId?: string | null, mediaTag?: string | null): void => {
  if (producerId && mediaTag === SCREEN_AUDIO_MEDIA_TAG) screenAudioProducerIds.add(producerId);
};

export const forgetScreenAudioProducer = (producerId?: string | null): void => {
  if (producerId) screenAudioProducerIds.delete(producerId);
};

export interface IsScreenAudioProducerOptions {
  producerId: string;
  participants?: Participant[];
  appData?: Record<string, unknown> | null;
}

/** True when the producer is screen audio, by server tag, consumer appData or the sharer's `ScreenAudioID`. */
export const isScreenAudioProducer = ({ producerId, participants = [], appData }: IsScreenAudioProducerOptions): boolean => {
  if (!producerId) return false;
  if (screenAudioProducerIds.has(producerId)) return true;
  if (appData?.mediaTag === SCREEN_AUDIO_MEDIA_TAG) return true;
  return participants.some((participant) => participant?.ScreenAudioID === producerId);
};

/**
 * How a screen share treats audio: `ask` (default) shows a choice before the browser's picker, `always` requests audio
 * without asking, `never` shares video only.
 */
export type ScreenAudioMode = "ask" | "always" | "never";

export interface ScreenAudioSettings {
  supportsScreenAudio?: boolean;
  screenAudioEnabled?: boolean;
  screenAudioMode?: ScreenAudioMode;
}

/** Screen audio is requested only when the server supports it and the app has not turned it off. */
export const shouldShareScreenAudio = ({ supportsScreenAudio, screenAudioEnabled, screenAudioMode }: ScreenAudioSettings): boolean =>
  supportsScreenAudio === true && screenAudioEnabled !== false && screenAudioMode !== "never";

/**
 * Whether this browser can capture the audio of a shared tab or screen. Chromium desktop browsers (Chrome, Edge,
 * Opera, Brave) can; Firefox, Safari and mobile browsers return video only.
 */
export const canCaptureDisplayAudio = (nav: Partial<Navigator> | undefined = typeof navigator !== "undefined" ? navigator : undefined): boolean => {
  if (!nav) return false;
  const ua = String(nav.userAgent || "");
  if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) return false;
  const brands: string[] = ((nav as any).userAgentData?.brands || []).map((entry: { brand?: string }) => String(entry?.brand || ""));
  if (brands.some((brand) => /Chromium|Google Chrome|Microsoft Edge|Opera|Brave/i.test(brand))) return true;
  return /(Chrome|Chromium|Edg)\//.test(ua) && !/Firefox|FxiOS|OPiOS/.test(ua);
};

/** The user's answer to "share audio too?": `audio`, `video` (screen only) or `null` (cancelled). */
export type ScreenAudioChoice = "audio" | "video" | null;

/** Mutes or unmutes the sharer's screen audio without stopping the screen share. Returns the new paused state. */
export const setScreenAudioPaused = (producer: Producer | null | undefined, paused: boolean): boolean => {
  if (!producer || producer.closed) return false;
  if (paused && !producer.paused) producer.pause();
  if (!paused && producer.paused) producer.resume();
  return producer.paused;
};

export interface DisplayMediaOptionsInput {
  targetWidth: number;
  targetHeight: number;
  withAudio: boolean;
}

/**
 * Options for `getDisplayMedia`. With audio, the browser's picker shows its own "share audio" choice, which is the
 * user's consent; browsers that cannot capture display audio (Firefox, Safari) return a video-only stream.
 */
export const buildDisplayMediaOptions = ({ targetWidth, targetHeight, withAudio }: DisplayMediaOptionsInput) => {
  const options: Record<string, unknown> = {
    video: { width: targetWidth, height: targetHeight, frameRate: 30 },
    audio: withAudio
      ? { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
      : false,
  };
  if (withAudio) {
    // Chromium hints; other browsers ignore unknown members.
    options.systemAudio = "include";
    options.suppressLocalAudioPlayback = false;
  }
  return options as DisplayMediaStreamOptions;
};

// Fallback holder for apps whose parameters have no `screenAudioProducer` state.
const producersBySocket = new WeakMap<object, Producer>();

export const rememberScreenAudioProducer = (socket: object | null | undefined, producer: Producer | null): void => {
  if (!socket) return;
  if (producer) producersBySocket.set(socket, producer);
  else producersBySocket.delete(socket);
};

export const recallScreenAudioProducer = (socket: object | null | undefined): Producer | null =>
  (socket && producersBySocket.get(socket)) || null;

/** Sets the listening volume (0..1) of every screen-audio player on the page. */
export const setScreenAudioVolume = (volume: number, root: ParentNode | null = typeof document !== "undefined" ? document : null): void => {
  if (!root) return;
  const value = Math.min(1, Math.max(0, Number.isFinite(volume) ? volume : 1));
  root.querySelectorAll<HTMLAudioElement>('audio[data-screen-audio="true"]').forEach((element) => {
    element.volume = value;
  });
};
