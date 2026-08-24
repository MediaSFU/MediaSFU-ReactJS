import { HeadlessOptions, HeadlessParameters } from './headlessTypes';

/**
 * Explicit playback: HLS and WHEP.
 *
 * **This is deliberately not part of the media-card surface.** WebRTC media is
 * *auto-consumed* — the SDK subscribes for you, and `getRemoteVideoStreams` /
 * `getAudioGridComponents` hand you what already arrived. HLS and WHEP are the
 * opposite: nothing is consumed until you ask, because each one opens a
 * connection the room did not ask for and would otherwise pay for.
 *
 * So the API here is imperative — `attachPlayback` / `detachPlayback` — rather
 * than a reactive getter. Mixing these into the media cards would mean every
 * room silently opened an HLS or WHEP connection whether or not anything
 * rendered it.
 *
 * When to reach for which:
 *
 * | | latency | cost per viewer | use it for |
 * | --- | --- | --- | --- |
 * | WebRTC (auto) | sub-second | an SFU consumer | anyone who takes part |
 * | WHEP | sub-second | an SFU consumer | standards-based egress to non-SDK players |
 * | HLS | seconds | a CDN request | audiences too large to fan out over the SFU |
 *
 * A large passive audience on HLS is the reason this exists: it moves the
 * expensive part — media fan-out — off the SFU.
 */

export type PlaybackProtocol = 'hls' | 'whep';

export interface PlaybackSource {
  protocol: PlaybackProtocol;
  url: string;
}

/**
 * Playback URLs the server has published for this room.
 *
 * Returns nothing when the room has none — HLS and WHEP are provisioned
 * server-side, so absence means "not enabled for this room", not an error.
 */
export function getPlaybackSources({ parameters }: HeadlessOptions): PlaybackSource[] {
  const source: HeadlessParameters = parameters || {};
  const sources: PlaybackSource[] = [];
  const push = (protocol: PlaybackProtocol, url: unknown) => {
    if (typeof url === 'string' && /^https:\/\//i.test(url)) sources.push({ protocol, url });
  };
  push('hls', source.hlsUrl || source.hlsPlaybackUrl || source.playbackUrl);
  push('whep', source.whepUrl || source.whepPlaybackUrl);
  return sources;
}

/** A running playback. Always `detachPlayback` it — none of this is garbage-collected. */
export interface PlaybackHandle {
  protocol: PlaybackProtocol;
  url: string;
  /** The media, when the protocol produces one directly (WHEP). */
  stream: MediaStream | null;
  /** Release the connection, the player, and the element's source. */
  detach: () => void;
}

export interface AttachPlaybackOptions {
  /** Playback URL, or a `PlaybackSource` from `getPlaybackSources`. */
  source: string | PlaybackSource;
  /** The element to play into. Required for HLS; optional for WHEP. */
  video?: HTMLVideoElement | null;
  /** Force a protocol. Inferred from the URL when omitted. */
  protocol?: PlaybackProtocol;
  /**
   * Factory returning an hls.js instance, e.g. `() => new Hls({ lowLatencyMode: true })`.
   *
   * Required for HLS anywhere except Safari, and injected rather than imported
   * so hls.js never becomes a dependency of this SDK — most rooms never play
   * HLS, and React Native cannot use it at all.
   */
  hlsFactory?: () => any;
  /** Extra headers for the WHEP POST, e.g. an auth token. */
  headers?: Record<string, string>;
  /** ICE servers for WHEP. Defaults to the room's own when available. */
  iceServers?: RTCIceServer[];
}

function inferProtocol(url: string, explicit?: PlaybackProtocol): PlaybackProtocol {
  if (explicit) return explicit;
  return /\.m3u8(\?|$)/i.test(url) ? 'hls' : 'whep';
}

/**
 * Whether this element can genuinely play HLS from a plain `src`.
 *
 * **`canPlayType` alone is a trap.** Chrome answers `"maybe"` for
 * `application/vnd.apple.mpegurl` and then plays nothing — setting `src` there
 * produces a permanently black video with no error at all.
 *
 * The reliable signal is Media Source Extensions: where MSE exists, hls.js is
 * the right player (this is hls.js's own documented rule). Native playback is
 * only trusted where MSE is absent, which is iOS Safari — the one place hls.js
 * cannot run and native HLS genuinely works.
 */
function canPlayHlsNatively(video: HTMLVideoElement): boolean {
  const claimsSupport = typeof video.canPlayType === 'function'
    && video.canPlayType('application/vnd.apple.mpegurl') !== '';
  const hasMse = typeof MediaSource !== 'undefined'
    || typeof (globalThis as any).ManagedMediaSource !== 'undefined';
  return claimsSupport && !hasMse;
}

async function attachHls(
  url: string,
  video: HTMLVideoElement | null | undefined,
  hlsFactory?: () => any
): Promise<PlaybackHandle> {
  if (!video) throw new Error('HLS playback needs a <video> element.');

  // Prefer the injected player wherever one is available: hls.js works on every
  // browser that supports MSE, including desktop Safari, and gives one code path
  // for live-edge handling rather than two.
  if (typeof hlsFactory !== 'function' && canPlayHlsNatively(video)) {
    video.src = url;
    const play = video.play?.();
    play?.catch?.(() => {});
    return {
      protocol: 'hls',
      url,
      stream: null,
      detach: () => { video.removeAttribute('src'); video.load?.(); },
    };
  }

  if (typeof hlsFactory !== 'function') {
    throw new Error(
      'HLS needs an hlsFactory on this browser. Pass () => new Hls(...) from hls.js; '
      + 'it is not bundled with the SDK. Only iOS Safari, which has no Media Source '
      + 'Extensions, plays HLS without one — Chrome reports that it can and then '
      + 'plays nothing.'
    );
  }
  const hls = hlsFactory();
  hls.loadSource(url);
  hls.attachMedia(video);
  return {
    protocol: 'hls',
    url,
    stream: null,
    detach: () => {
      try { hls.destroy(); } catch { /* already destroyed */ }
      video.removeAttribute('src');
    },
  };
}

/**
 * WHEP: POST an SDP offer, receive an answer, play the tracks.
 *
 * Implemented directly against RTCPeerConnection rather than via a library —
 * WHEP is a small, standard exchange and a dependency here would be larger than
 * the protocol.
 */
async function attachWhep(
  url: string,
  video: HTMLVideoElement | null | undefined,
  headers: Record<string, string> = {},
  iceServers?: RTCIceServer[]
): Promise<PlaybackHandle> {
  if (typeof RTCPeerConnection === 'undefined') {
    throw new Error('WHEP playback needs WebRTC support.');
  }
  const pc = new RTCPeerConnection(iceServers?.length ? { iceServers } : undefined);
  const stream = new MediaStream();

  // recvonly: this is egress. Adding transceivers up front means the offer
  // advertises both kinds even before any track arrives.
  pc.addTransceiver('video', { direction: 'recvonly' });
  pc.addTransceiver('audio', { direction: 'recvonly' });
  pc.ontrack = (event: RTCTrackEvent) => {
    if (event.track) stream.addTrack(event.track);
    if (video && video.srcObject !== stream) {
      video.srcObject = stream;
      const play = video.play?.();
      play?.catch?.(() => {});
    }
  };

  let resourceUrl = '';
  try {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/sdp', ...headers },
      body: offer.sdp || '',
    });
    if (!response.ok) {
      throw new Error(`The WHEP endpoint refused the request (${response.status}).`);
    }
    // The Location header names the session, and DELETEing it is the only way
    // to tell the server to stop sending. Without it a closed page keeps a
    // session alive server-side.
    const location = response.headers.get('Location') || '';
    resourceUrl = location ? new URL(location, url).toString() : '';

    const answer = await response.text();
    await pc.setRemoteDescription({ type: 'answer', sdp: answer });
  } catch (error) {
    pc.close();
    throw error;
  }

  return {
    protocol: 'whep',
    url,
    stream,
    detach: () => {
      if (resourceUrl) {
        // Best-effort and deliberately unawaited: teardown often runs during
        // page unload, where waiting is not an option.
        try { void fetch(resourceUrl, { method: 'DELETE', headers }); } catch { /* ignore */ }
      }
      try { pc.close(); } catch { /* already closed */ }
      stream.getTracks().forEach((track) => track.stop());
      if (video && video.srcObject === stream) video.srcObject = null;
    },
  };
}

export type AttachPlaybackType = (options: AttachPlaybackOptions) => Promise<PlaybackHandle>;

/**
 * Start an explicit playback.
 *
 * @example
 * ```ts
 * import Hls from 'hls.js';
 *
 * const [source] = getPlaybackSources({ parameters });
 * const handle = await attachPlayback({
 *   source,
 *   video: videoRef.current,
 *   hlsFactory: () => new Hls({ lowLatencyMode: true }),
 * });
 * // later, always:
 * detachPlayback(handle);
 * ```
 */
export async function attachPlayback({
  source,
  video,
  protocol,
  hlsFactory,
  headers,
  iceServers,
}: AttachPlaybackOptions): Promise<PlaybackHandle> {
  const url = typeof source === 'string' ? source : source?.url || '';
  if (!url) throw new Error('A playback URL is required.');
  const resolved = typeof source === 'string'
    ? inferProtocol(url, protocol)
    : (protocol || source.protocol || inferProtocol(url));

  return resolved === 'hls'
    ? attachHls(url, video, hlsFactory)
    : attachWhep(url, video, headers, iceServers);
}

/** Stop a playback and release everything it holds. Safe to call twice. */
export function detachPlayback(handle: PlaybackHandle | null | undefined): void {
  if (!handle || typeof handle.detach !== 'function') return;
  try { handle.detach(); } catch { /* teardown must not throw */ }
}

/* ------------------------------------------------------------------ *
 * WHIP — the ingest counterpart
 * ------------------------------------------------------------------ */

export interface PublishWhipOptions {
  /** The WHIP endpoint. */
  url: string;
  /** The stream to publish. */
  stream: MediaStream;
  headers?: Record<string, string>;
  iceServers?: RTCIceServer[];
}

/**
 * Publish a stream to a WHIP endpoint.
 *
 * The symmetric counterpart of WHEP, and equally explicit. This is *not* how
 * you publish into a MediaSFU room — use `produceMedia` for that, which goes
 * through the room's own transport and respects its capture entitlements. WHIP
 * is for pushing to a standards-based ingest that is not this room.
 */
export async function publishWhip({
  url,
  stream,
  headers = {},
  iceServers,
}: PublishWhipOptions): Promise<PlaybackHandle> {
  if (typeof RTCPeerConnection === 'undefined') {
    throw new Error('WHIP publishing needs WebRTC support.');
  }
  if (!stream?.getTracks?.().length) throw new Error('A stream with at least one track is required.');

  const pc = new RTCPeerConnection(iceServers?.length ? { iceServers } : undefined);
  stream.getTracks().forEach((track) => pc.addTrack(track, stream));

  let resourceUrl = '';
  try {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/sdp', ...headers },
      body: offer.sdp || '',
    });
    if (!response.ok) throw new Error(`The WHIP endpoint refused the request (${response.status}).`);
    const location = response.headers.get('Location') || '';
    resourceUrl = location ? new URL(location, url).toString() : '';
    await pc.setRemoteDescription({ type: 'answer', sdp: await response.text() });
  } catch (error) {
    pc.close();
    throw error;
  }

  return {
    protocol: 'whep',
    url,
    stream,
    detach: () => {
      if (resourceUrl) {
        try { void fetch(resourceUrl, { method: 'DELETE', headers }); } catch { /* ignore */ }
      }
      try { pc.close(); } catch { /* already closed */ }
    },
  };
}
