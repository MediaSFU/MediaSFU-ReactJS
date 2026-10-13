/**
 * Send-side serialisation.
 *
 * The media server keeps one producer transport per socket. When two media actions (microphone and camera turned on
 * together, a rejoin while a toggle is in flight) each ask for a send transport, the second `createWebRtcTransport`
 * replaces the first on the server: both client transports then send `transport-connect` to the same server
 * transport, the second fails ("connect() already called") and the client's uplink goes silent. Likewise two
 * concurrent produces of the same kind create two producers where the server accepts one.
 *
 * These helpers make later callers wait for the creation (or produce) already in flight and reuse its result.
 */

// Keyed by the socket object: one creation per socket, released as soon as it settles.
const pendingCreations = new WeakMap<object, Promise<void>>();

/** The send-transport creation in flight for this socket, if any. */
export const pendingSendTransportCreation = (socket: object | null | undefined): Promise<void> | undefined =>
  (socket ? pendingCreations.get(socket) : undefined);

/** Runs `create` as the only send-transport creation for this socket until it settles. */
export const trackSendTransportCreation = (socket: object | null | undefined, create: () => Promise<void>): Promise<void> => {
  if (!socket) return create();
  const running = create();
  pendingCreations.set(socket, running);
  const release = () => {
    if (pendingCreations.get(socket) === running) pendingCreations.delete(socket);
  };
  running.then(release, release);
  return running;
};

interface ClosableLike {
  closed?: boolean;
}

/** True for an existing, open transport or producer. */
export const isOpen = (item: ClosableLike | null | undefined): boolean => Boolean(item && !item.closed);

// Keyed by transport, then by what is produced (audio, video, screen).
const pendingProduces = new WeakMap<object, Map<string, Promise<unknown>>>();

/**
 * Produces once per transport and key at a time. A caller that arrives while the same produce is in flight gets that
 * producer (`joined: true`) instead of creating a second one.
 */
export const produceOnce = async <T>(
  transport: object,
  key: string,
  produce: () => Promise<T>,
): Promise<{ producer: T; joined: boolean }> => {
  let byKey = pendingProduces.get(transport);
  if (!byKey) {
    byKey = new Map();
    pendingProduces.set(transport, byKey);
  }
  const inFlight = byKey.get(key) as Promise<T> | undefined;
  if (inFlight) return { producer: await inFlight, joined: true };
  const running = produce();
  byKey.set(key, running);
  try {
    return { producer: await running, joined: false };
  } finally {
    if (byKey.get(key) === running) byKey.delete(key);
  }
};
