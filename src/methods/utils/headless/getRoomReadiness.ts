import { HeadlessOptions, RoomReadiness } from './headlessTypes';

export type GetRoomReadinessType = (options: HeadlessOptions) => RoomReadiness;

/**
 * Is the room actually usable yet?
 *
 * Headless consumers repeatedly re-derive this same predicate and each one picks
 * a slightly different subset, so a control fires before the transport exists
 * and fails silently. The five conditions below are the real gate: a room name,
 * a member identity, server-side validation, a connected emittable socket, and a
 * loaded mediasoup device.
 *
 * `reason` is safe to show a user — it names what is still pending, never an
 * endpoint, credential, or internal identifier.
 *
 * @example
 * ```ts
 * import { getRoomReadiness } from 'mediasfu-reactjs';
 *
 * const { ready, reason } = getRoomReadiness({ parameters });
 * if (!ready) return <p>{reason}</p>;
 * ```
 */
export function getRoomReadiness({ parameters }: HeadlessOptions): RoomReadiness {
  const source = parameters || {};
  if (!source.roomName) {
    return { ready: false, reason: 'Waiting for the room name.' };
  }
  if (!source.member) {
    return { ready: false, reason: 'Waiting for the participant identity.' };
  }
  if (source.validated !== true) {
    return { ready: false, reason: 'Waiting for MediaSFU to validate the room.' };
  }
  const socket = source.socket;
  if (!socket || socket.connected !== true) {
    return { ready: false, reason: 'Connecting to the MediaSFU room.' };
  }
  if (typeof socket.emit !== 'function') {
    return { ready: false, reason: 'The room signal is not ready yet.' };
  }
  if (source.device?.loaded !== true) {
    return { ready: false, reason: 'Waiting for the MediaSFU media device.' };
  }
  return { ready: true, reason: '' };
}

export default getRoomReadiness;
