import { Producer, Transport } from "mediasoup-client/lib/types";
import { Socket } from "socket.io-client";
import {
  SCREEN_AUDIO_CODEC_OPTIONS,
  SCREEN_AUDIO_MEDIA_TAG,
  recallScreenAudioProducer,
  rememberScreenAudioProducer,
  shouldShareScreenAudio,
} from "./screenAudio";

export interface ScreenAudioParameters {
  socket: Socket;
  producerTransport: Transport | null;
  screenProducer?: Producer | null;
  screenAudioProducer?: Producer | null;
  supportsScreenAudio?: boolean;
  screenAudioEnabled?: boolean;
  updateScreenAudioProducer?: (producer: Producer | null) => void;
  getUpdatedAllParams: () => ScreenAudioParameters;
  [key: string]: any;
}

export interface ConnectSendTransportScreenAudioOptions {
  stream: MediaStream;
  parameters: ScreenAudioParameters;
  /** Wait before the single retry when the server has not registered the screen share yet. */
  retryDelayMs?: number;
}

export type ConnectSendTransportScreenAudioType = (
  options: ConnectSendTransportScreenAudioOptions
) => Promise<Producer | null>;

export interface DisconnectSendTransportScreenAudioOptions {
  parameters: ScreenAudioParameters;
  /** Also tell the server (the screen share continues). Not needed when the whole screen share stops. */
  notifyServer?: boolean;
}

export type DisconnectSendTransportScreenAudioType = (
  options: DisconnectSendTransportScreenAudioOptions
) => Promise<void>;

const currentScreenAudioProducer = (parameters: ScreenAudioParameters): Producer | null =>
  parameters.screenAudioProducer || recallScreenAudioProducer(parameters.socket);

const storeScreenAudioProducer = (parameters: ScreenAudioParameters, producer: Producer | null) => {
  rememberScreenAudioProducer(parameters.socket, producer);
  parameters.updateScreenAudioProducer?.(producer);
};

/**
 * Closes the screen-audio producer, if any. Safe to call when none exists.
 *
 * @example
 * ```typescript
 * await disconnectSendTransportScreenAudio({ parameters, notifyServer: true });
 * ```
 */
export const disconnectSendTransportScreenAudio: DisconnectSendTransportScreenAudioType = async ({
  parameters,
  notifyServer = false,
}) => {
  const params = parameters.getUpdatedAllParams ? parameters.getUpdatedAllParams() : parameters;
  const producer = currentScreenAudioProducer(params);
  if (!producer) return;
  try {
    if (!producer.closed) producer.close();
  } catch {
    // already closed
  }
  storeScreenAudioProducer(params, null);
  if (notifyServer) {
    try {
      params.socket?.emit("closeScreenAudioProducer");
    } catch {
      // the server also closes it with the screen share
    }
  }
};

export interface ToggleScreenAudioOptions {
  parameters: ScreenAudioParameters;
  /** Force a state; omitted = toggle. */
  paused?: boolean;
}

/**
 * Mutes or unmutes the sharer's screen audio without stopping the screen share (listeners hear silence while muted).
 * Returns the new muted state, or null when no screen audio is being shared.
 *
 * @example
 * ```typescript
 * const muted = toggleScreenAudio({ parameters });
 * ```
 */
export const toggleScreenAudio = ({ parameters, paused }: ToggleScreenAudioOptions): boolean | null => {
  const params = parameters.getUpdatedAllParams ? parameters.getUpdatedAllParams() : parameters;
  const producer = currentScreenAudioProducer(params);
  if (!producer || producer.closed) return null;
  const next = paused ?? !producer.paused;
  if (next && !producer.paused) producer.pause();
  if (!next && producer.paused) producer.resume();
  params.updateScreenAudioProducer?.(producer);
  return producer.paused;
};

const produceOnce = async (transport: Transport, track: MediaStreamTrack): Promise<Producer | null> => {
  const producer = await transport.produce({
    track,
    codecOptions: SCREEN_AUDIO_CODEC_OPTIONS,
    appData: { mediaTag: SCREEN_AUDIO_MEDIA_TAG },
    // The track belongs to the screen share stream, which stops it with the share.
    stopTracks: false,
  });
  // A rejected produce resolves without a server id: drop the local sender.
  if (!producer?.id) {
    try { producer?.close(); } catch { /* nothing to close */ }
    return null;
  }
  return producer;
};

/**
 * Publishes the audio track of a screen-share stream as a "screen-audio" producer on the existing send transport.
 * Call it after the screen video producer exists. It returns null (and the screen share continues without audio)
 * when the stream has no audio, the server does not support screen audio, or the app turned it off.
 *
 * The producer mirrors the screen producer: it pauses, resumes and closes with it, and it closes alone (telling the
 * server) when its own track ends.
 *
 * @example
 * ```typescript
 * const producer = await connectSendTransportScreenAudio({ stream: screenStream, parameters });
 * ```
 */
export const connectSendTransportScreenAudio: ConnectSendTransportScreenAudioType = async ({
  stream,
  parameters,
  retryDelayMs = 600,
}) => {
  const params = parameters.getUpdatedAllParams ? parameters.getUpdatedAllParams() : parameters;
  const track = stream?.getAudioTracks?.()[0];
  if (!track || track.readyState === "ended") return null;
  if (!shouldShareScreenAudio(params)) return null;
  const transport = params.producerTransport;
  if (!transport || transport.closed) return null;

  const existing = currentScreenAudioProducer(params);
  if (existing && !existing.closed) return existing;

  try {
    let producer = await produceOnce(transport, track);
    // The track may have ended while the first attempt was in flight.
    const trackEnded = () => (track.readyState as MediaStreamTrackState) === "ended";
    if (!producer && retryDelayMs > 0 && !trackEnded()) {
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      producer = await produceOnce(transport, track);
    }
    if (!producer) return null;

    storeScreenAudioProducer(params, producer);

    const screenProducer = params.screenProducer;
    if (screenProducer?.paused) producer.pause();
    screenProducer?.observer?.on("pause", () => {
      if (!producer!.closed) producer!.pause();
    });
    screenProducer?.observer?.on("resume", () => {
      if (!producer!.closed) producer!.resume();
    });
    screenProducer?.observer?.on("close", () => {
      void disconnectSendTransportScreenAudio({ parameters: params });
    });

    track.addEventListener("ended", () => {
      void disconnectSendTransportScreenAudio({ parameters: params, notifyServer: true });
    });
    return producer;
  } catch (error) {
    console.log("connectSendTransportScreenAudio error", error);
    return null;
  }
};
