/**
 * Viewers who are part of a session without joining the room.
 *
 * **Why this exists.** Joining a MediaSFU room auto-consumes WebRTC: the SDK
 * creates consumers from the server's `newProducer` events, unconditionally —
 * there is no receive-nothing mode. For a large passive audience watching over
 * HLS that is pure waste: transports, consumers and layout churn for media they
 * will never render. Joining and then pausing the consumers is worse than it
 * looks, because the layout pass keeps resuming them.
 *
 * So an HLS viewer does not join at all. They hold a *viewer session* instead —
 * enough to be counted, to raise a hand, and to be told when the host approves —
 * and they only perform a real SDK join at the moment they reach the floor.
 *
 * How that session is stored is deliberately not decided here. The transport,
 * lifecycle and state machine are the SDK's business; issuing playback URLs and
 * tracking presence belong to whatever backend you run. You supply a
 * `ViewerSessionProvider`; this drives it. Same reasoning as `hlsFactory`: the
 * SDK owns the mechanism, the app owns the dependency.
 */

export type ViewerSessionPhase =
  | 'idle'
  | 'joining'
  | 'watching'
  | 'requested'
  | 'approved'
  | 'left'
  | 'error';

export interface ViewerSessionIdentity {
  /** Opaque id for this viewer, issued by the provider. */
  viewerId: string;
  /** The room being watched. */
  roomName: string;
  /** Where to play from. Absent until the provider issues one. */
  playbackUrl?: string;
  /** 'hls' or 'whep'; inferred from the URL when omitted. */
  protocol?: 'hls' | 'whep';
  /** Anything the provider needs handed back on later calls. */
  token?: string;
  [key: string]: any;
}

export interface ViewerSessionStatus {
  /** True once the host has approved this viewer for the floor. */
  approved: boolean;
  /** True while a request is outstanding. */
  pending?: boolean;
  /** Free-text reason when a request was refused. */
  reason?: string;
  /** Provider may refresh the playback URL (signed URLs expire). */
  playbackUrl?: string;
}

/**
 * What your backend has to do. Only `join` is required — a provider that just
 * hands back a playback URL is a valid provider, it simply cannot support
 * promotion.
 */
export interface ViewerSessionProvider {
  join(options: {
    roomName: string;
    displayName?: string;
    signal?: AbortSignal;
  }): Promise<ViewerSessionIdentity>;
  /** Keep the viewer counted as present. */
  heartbeat?(options: { session: ViewerSessionIdentity; signal?: AbortSignal }): Promise<void>;
  /** Raise a hand for the floor. */
  requestPromotion?(options: { session: ViewerSessionIdentity; signal?: AbortSignal }): Promise<void>;
  /** Has the host decided yet? */
  poll?(options: { session: ViewerSessionIdentity; signal?: AbortSignal }): Promise<ViewerSessionStatus>;
  /** Release the session. */
  leave?(options: { session: ViewerSessionIdentity }): Promise<void>;
}

export interface ViewerSessionSnapshot {
  phase: ViewerSessionPhase;
  session: ViewerSessionIdentity | null;
  status: ViewerSessionStatus | null;
  error: string;
  /** True when the provider can accept a promotion request at all. */
  canRequestPromotion: boolean;
}

export interface CreateViewerSessionOptions {
  provider: ViewerSessionProvider;
  roomName: string;
  displayName?: string;
  /** Poll interval for approval, ms. Defaults to 5000. */
  pollIntervalMs?: number;
  /** Heartbeat interval, ms. Defaults to 30000. Ignored without a heartbeat. */
  heartbeatIntervalMs?: number;
  /** Called on every state change. */
  onChange?: (snapshot: ViewerSessionSnapshot) => void;
}

export interface ViewerSessionHandle {
  /** Current state, readable at any time. */
  getSnapshot: () => ViewerSessionSnapshot;
  /** Register with the provider and begin watching. */
  start: () => Promise<ViewerSessionSnapshot>;
  /** Raise a hand for the floor. */
  requestPromotion: () => Promise<ViewerSessionSnapshot>;
  /** Stop everything and release the session. */
  stop: () => Promise<void>;
}

const MIN_INTERVAL_MS = 1000;

/**
 * Drive a viewer session.
 *
 * Deliberately framework-agnostic — no hooks, no observables — so the same
 * implementation serves React, Vue and Angular. Wrap it in whatever your
 * framework prefers.
 *
 * @example
 * ```ts
 * const viewer = createViewerSession({
 *   provider: myProvider,
 *   roomName,
 *   onChange: (snapshot) => setState(snapshot),
 * });
 * await viewer.start();                     // watching over HLS, never joined
 * await viewer.requestPromotion();          // hand raised
 * // when snapshot.phase === 'approved', perform a real SDK join.
 * ```
 */
export function createViewerSession({
  provider,
  roomName,
  displayName,
  pollIntervalMs = 5000,
  heartbeatIntervalMs = 30000,
  onChange,
}: CreateViewerSessionOptions): ViewerSessionHandle {
  let snapshot: ViewerSessionSnapshot = {
    phase: 'idle',
    session: null,
    status: null,
    error: '',
    canRequestPromotion: typeof provider?.requestPromotion === 'function',
  };
  let pollTimer: any = null;
  let heartbeatTimer: any = null;
  let stopped = false;

  const emit = (next: Partial<ViewerSessionSnapshot>) => {
    snapshot = { ...snapshot, ...next };
    try {
      onChange?.(snapshot);
    } catch {
      // A consumer's observer must never break the session.
    }
  };

  const clearTimers = () => {
    if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
    if (heartbeatTimer) { clearInterval(heartbeatTimer); heartbeatTimer = null; }
  };

  const startTimers = () => {
    clearTimers();
    if (typeof provider.poll === 'function') {
      pollTimer = setInterval(async () => {
        if (stopped || !snapshot.session) return;
        try {
          const status = await provider.poll!({ session: snapshot.session });
          if (stopped) return;
          // A refreshed URL matters: signed playback URLs expire mid-session,
          // and a silently dead player looks like a broken stream.
          const session = status?.playbackUrl
            ? { ...snapshot.session, playbackUrl: status.playbackUrl }
            : snapshot.session;
          emit({
            status,
            session,
            phase: status?.approved ? 'approved' : snapshot.phase === 'requested' ? 'requested' : 'watching',
          });
          // Once approved there is nothing left to poll for.
          if (status?.approved) clearTimers();
        } catch {
          // Transient poll failures are normal; the session is not lost.
        }
      }, Math.max(MIN_INTERVAL_MS, pollIntervalMs));
    }
    if (typeof provider.heartbeat === 'function') {
      heartbeatTimer = setInterval(() => {
        if (stopped || !snapshot.session) return;
        Promise.resolve(provider.heartbeat!({ session: snapshot.session })).catch(() => {});
      }, Math.max(MIN_INTERVAL_MS, heartbeatIntervalMs));
    }
  };

  return {
    getSnapshot: () => snapshot,

    async start() {
      if (snapshot.phase !== 'idle' && snapshot.phase !== 'left' && snapshot.phase !== 'error') {
        return snapshot;
      }
      stopped = false;
      emit({ phase: 'joining', error: '' });
      try {
        const session = await provider.join({ roomName, displayName });
        if (stopped) return snapshot;
        if (!session?.viewerId) throw new Error('The viewer session provider returned no viewerId.');
        emit({ phase: 'watching', session, error: '' });
        startTimers();
      } catch (error: any) {
        emit({ phase: 'error', error: error?.message || 'The viewer session could not start.' });
      }
      return snapshot;
    },

    async requestPromotion() {
      if (!snapshot.session) {
        emit({ error: 'Start the viewer session before requesting the floor.' });
        return snapshot;
      }
      if (typeof provider.requestPromotion !== 'function') {
        emit({ error: 'This viewer session provider does not support promotion.' });
        return snapshot;
      }
      try {
        await provider.requestPromotion({ session: snapshot.session });
        emit({ phase: 'requested', error: '' });
      } catch (error: any) {
        emit({ error: error?.message || 'The request could not be sent.' });
      }
      return snapshot;
    },

    async stop() {
      stopped = true;
      clearTimers();
      const session = snapshot.session;
      emit({ phase: 'left' });
      if (session && typeof provider.leave === 'function') {
        // Best-effort: teardown often runs during unload.
        try { await provider.leave({ session }); } catch { /* ignore */ }
      }
    },
  };
}
