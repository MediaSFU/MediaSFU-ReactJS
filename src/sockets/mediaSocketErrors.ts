/**
 * Media socket connection errors.
 *
 * A media node that refuses a handshake emits `connection-rejected { reason, stage }` just before it closes the socket
 * (media admission v2). `connectSocket` turns that, and every other way a connection can fail, into a
 * `MediaSocketConnectError` that says what happened, when and whether trying again can help.
 */

/** Reasons a media node sends with `connection-rejected`. */
export type MediaConnectionRejectionReason =
  | 'invalid-credentials'
  | 'meeting-minutes-unavailable'
  | 'api-check-failed'
  | 'invalid-request'
  | 'rejected-before-connection-success';

/**
 * Where the attempt stopped:
 * - `before-open`: the transport never opened (offline, DNS, TLS, firewall, server down);
 * - `after-open`: the transport opened but closed or errored before `connection-success`;
 * - `rejected`: the server refused the handshake and said why (`reason`);
 * - `timeout`: nothing settled in time.
 */
export type MediaSocketConnectPhase = 'before-open' | 'after-open' | 'rejected' | 'timeout';

export const MEDIA_CONNECTION_REJECTION_REASONS: readonly MediaConnectionRejectionReason[] = [
  'invalid-credentials',
  'meeting-minutes-unavailable',
  'api-check-failed',
  'invalid-request',
  'rejected-before-connection-success',
];

/** Rejections that will fail the same way if retried with the same credentials. */
const PERMANENT_REJECTIONS = new Set<string>(['invalid-credentials', 'meeting-minutes-unavailable', 'invalid-request']);

export interface MediaSocketConnectErrorDetails {
  phase: MediaSocketConnectPhase;
  /** Rejection reason from the server (phase `rejected`), else undefined. */
  reason?: MediaConnectionRejectionReason;
  /** Server-side admission stage from `connection-rejected`, e.g. `api-check-rejected`. */
  stage?: string;
  /** Milliseconds from the start of the attempt to the failure. */
  elapsedMs: number;
  /** `navigator.onLine` when available. `false` points at the device's network, not the server. */
  online?: boolean;
  /** Underlying transport error or disconnect reason, e.g. `websocket error`, `io server disconnect`. */
  transportError?: string;
  /** Socket link the attempt targeted. */
  link?: string;
}

export class MediaSocketConnectError extends Error implements MediaSocketConnectErrorDetails {
  readonly phase: MediaSocketConnectPhase;
  readonly reason?: MediaConnectionRejectionReason;
  readonly stage?: string;
  readonly elapsedMs: number;
  readonly online?: boolean;
  readonly transportError?: string;
  readonly link?: string;
  /** False when retrying with the same credentials cannot succeed (bad credentials, no minutes, bad request). */
  readonly retryable: boolean;

  constructor(details: MediaSocketConnectErrorDetails) {
    super(formatMediaSocketError(details));
    Object.setPrototypeOf(this, MediaSocketConnectError.prototype);
    this.name = 'MediaSocketConnectError';
    this.phase = details.phase;
    this.reason = details.reason;
    this.stage = details.stage;
    this.elapsedMs = details.elapsedMs;
    this.online = details.online;
    this.transportError = details.transportError;
    this.link = details.link;
    this.retryable = !(details.phase === 'rejected' && details.reason && PERMANENT_REJECTIONS.has(details.reason));
  }
}

/** Maps any reason string from the server onto a known reason (unknown values become `rejected-before-connection-success`). */
export const normalizeRejectionReason = (reason: unknown): MediaConnectionRejectionReason =>
  (MEDIA_CONNECTION_REJECTION_REASONS as readonly string[]).includes(String(reason))
    ? (reason as MediaConnectionRejectionReason)
    : 'rejected-before-connection-success';

/** `navigator.onLine` where it exists (browsers, some React Native runtimes), else undefined. */
export const currentOnlineState = (): boolean | undefined => {
  try {
    const nav = (globalThis as { navigator?: { onLine?: unknown } }).navigator;
    return typeof nav?.onLine === 'boolean' ? nav.onLine : undefined;
  } catch {
    return undefined;
  }
};

/** Technical one-liner for logs; keeps the historic "Error connecting to media socket:" prefix for transport failures. */
export function formatMediaSocketError(details: MediaSocketConnectErrorDetails): string {
  const facts = [`phase: ${details.phase}`, `after ${Math.max(0, Math.round(details.elapsedMs))} ms`];
  if (details.online !== undefined) facts.push(`online: ${details.online}`);
  if (details.stage) facts.push(`stage: ${details.stage}`);
  const tail = ` (${facts.join(', ')})`;
  switch (details.phase) {
    case 'rejected':
      return `Media server rejected the connection: ${details.reason || 'rejected-before-connection-success'}${tail}`;
    case 'timeout':
      return `Timed out connecting to media socket${tail}`;
    case 'after-open':
      return `Media socket closed before the room was ready: ${details.transportError || 'unknown'}${tail}`;
    default:
      return `Error connecting to media socket: ${details.transportError || 'unknown'}${tail}`;
  }
}

export const isMediaSocketConnectError = (error: unknown): error is MediaSocketConnectError =>
  error instanceof MediaSocketConnectError ||
  (typeof error === 'object' && error !== null && (error as { name?: unknown }).name === 'MediaSocketConnectError');

/** False only for rejections that cannot succeed on retry with the same credentials. */
export const isRetryableMediaSocketError = (error: unknown): boolean =>
  !isMediaSocketConnectError(error) || error.retryable;

/** A sentence suitable for an end user (alert/toast). Falls back to `fallback` for unknown errors. */
export function describeMediaSocketError(
  error: unknown,
  fallback = 'Unable to connect. Check your credentials and try again.',
): string {
  if (!isMediaSocketConnectError(error)) return fallback;
  if (error.phase === 'rejected') {
    switch (error.reason) {
      case 'invalid-credentials':
        return 'The room did not accept these credentials. Check the room ID and your access, or rejoin the room.';
      case 'meeting-minutes-unavailable':
        return 'This room cannot start because its account has no meeting minutes left. Contact the room host.';
      case 'invalid-request':
        return 'The connection request was incomplete or invalid. Check the room details and try again.';
      case 'api-check-failed':
        return 'The media server could not verify this room right now. Please try again shortly.';
      default:
        return 'The media server closed the connection before the room was ready. Please try again.';
    }
  }
  if (error.online === false) return 'You appear to be offline. Check your internet connection and try again.';
  if (error.phase === 'before-open') {
    return 'Could not reach the media server. Check your network or firewall and try again.';
  }
  if (error.phase === 'timeout') return 'Connecting to the media server timed out. Please try again.';
  return 'The media server closed the connection before the room was ready. Please try again.';
}
