import { confirmExit } from '../../exitMethods/confirmExit';
import { sendMessage } from '../../messageMethods/sendMessage';
import { HeadlessOptions, HeadlessParameters } from './headlessTypes';
import { getCurrentParams } from './getCurrentParams';
import { getRoomReadiness } from './getRoomReadiness';

export interface HeadlessActionResult {
  ok: boolean;
  /** Empty when `ok`; otherwise a short, user-safe explanation. */
  error: string;
}

/**
 * Prefer `localSocket` when it is usable, matching how the SDK routes chat.
 * Falls back to the primary room socket.
 */
function usableSocket(parameters: HeadlessParameters): any {
  return (
    [parameters?.localSocket, parameters?.socket].find(
      (socket) => socket?.connected === true && typeof socket.emit === 'function'
    ) || null
  );
}

export interface LeaveRoomOptions extends HeadlessOptions {
  /** Ban the member on the way out. Requires host privileges. */
  ban?: boolean;
  /** Whether a host exit should end the room for everyone. Defaults to true. */
  endRoomOnHostExit?: boolean;
}

export type LeaveRoomType = (
  options: LeaveRoomOptions
) => Promise<HeadlessActionResult>;

/**
 * Leave the room from a headless surface.
 *
 * Without this you have to pull `socket`, `localSocket`, `member` and `roomName`
 * off the bag yourself and hand them to `confirmExit` — four chances to pass a
 * stale value, and a silent no-op when you do.
 *
 * Never throws: a failed exit comes back as `{ ok: false, error }` so a Leave
 * button can report why rather than appearing to work.
 *
 * @example
 * ```ts
 * import { leaveRoom } from 'mediasfu-reactjs';
 *
 * const result = await leaveRoom({
 *   parameters: sourceParameters.current,
 *   endRoomOnHostExit: false,
 * });
 * if (!result.ok) setNotice(result.error);
 * ```
 */
export async function leaveRoom({
  parameters,
  ban = false,
  endRoomOnHostExit = true,
}: LeaveRoomOptions): Promise<HeadlessActionResult> {
  try {
    const live = getCurrentParams({ parameters });
    const socket = live?.socket;
    if (!socket || typeof socket.emit !== 'function') {
      return {
        ok: false,
        error: 'Room exit is unavailable until the signaling connection is ready.',
      };
    }
    if (!live?.member || !live?.roomName) {
      return { ok: false, error: 'Room exit is unavailable until the room is joined.' };
    }
    await confirmExit({
      socket,
      localSocket: live.localSocket,
      member: live.member,
      roomName: live.roomName,
      ban,
      endRoomOnHostExit,
    });
    return { ok: true, error: '' };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'The room exit request failed.' };
  }
}

export interface SendChatMessageOptions extends HeadlessOptions {
  message: string;
  /** Specific recipients. Empty (default) sends to the group. */
  receivers?: string[];
  /** Send to everyone. Defaults to true when `receivers` is empty. */
  group?: boolean;
}

export type SendChatMessageType = (
  options: SendChatMessageOptions
) => Promise<HeadlessActionResult>;

/**
 * Send a chat message from a headless surface.
 *
 * `sendMessage` takes eleven fields that all have to be lifted off the bag in
 * the right combination; this resolves them for you, including the
 * `localSocket`-before-`socket` preference the SDK uses for chat.
 *
 * @example
 * ```ts
 * import { sendChatMessage } from 'mediasfu-reactjs';
 *
 * await sendChatMessage({ parameters, message: 'Hello everyone' });
 * await sendChatMessage({ parameters, message: 'Just you', receivers: ['Paul'] });
 * ```
 */
export async function sendChatMessage({
  parameters,
  message,
  receivers = [],
  group,
}: SendChatMessageOptions): Promise<HeadlessActionResult> {
  try {
    const trimmed = String(message ?? '').trim();
    if (!trimmed) return { ok: false, error: 'The message is empty.' };

    const live = getCurrentParams({ parameters });
    const socket = usableSocket(live);
    if (!socket) {
      return { ok: false, error: 'Chat is unavailable until the room connection is ready.' };
    }
    if (!live?.roomName) {
      return { ok: false, error: 'Chat is unavailable until the room is joined.' };
    }

    await sendMessage({
      member: live.member || '',
      islevel: live.islevel || '1',
      showAlert: live.showAlert,
      coHostResponsibility: live.coHostResponsibility || [],
      coHost: live.coHost || '',
      chatSetting: live.chatSetting || '',
      message: trimmed,
      roomName: live.roomName,
      messagesLength: Array.isArray(live.messages) ? live.messages.length : 0,
      receivers,
      group: group ?? receivers.length === 0,
      sender: live.member || '',
      socket,
    });
    return { ok: true, error: '' };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'The message could not be sent.' };
  }
}

export interface RunMediaControlOptions extends HeadlessOptions {
  /** Which control to run. */
  control:
    | 'clickAudio'
    | 'clickVideo'
    | 'clickScreenShare'
    | 'switchAudio'
    | 'switchVideo'
    | 'switchVideoAlt';
  /** Extra arguments, e.g. `{ audioPreference: deviceId }` for `switchAudio`. */
  extra?: Record<string, any>;
}

export type RunMediaControlType = (
  options: RunMediaControlOptions
) => Promise<HeadlessActionResult>;

/**
 * Invoke a media control safely from a headless surface.
 *
 * Gates on {@link getRoomReadiness} first — firing `clickVideo` before the
 * transport exists fails silently and looks like a dead button — then resolves
 * the control off the current bag rather than a snapshot the caller captured
 * earlier.
 *
 * @example
 * ```ts
 * import { runMediaControl } from 'mediasfu-reactjs';
 *
 * await runMediaControl({ parameters, control: 'clickVideo' });
 * await runMediaControl({
 *   parameters,
 *   control: 'switchVideo',
 *   extra: { videoPreference: deviceId },
 * });
 * ```
 */
export async function runMediaControl({
  parameters,
  control,
  extra,
}: RunMediaControlOptions): Promise<HeadlessActionResult> {
  const live = getCurrentParams({ parameters });
  const readiness = getRoomReadiness({ parameters: live });
  if (!readiness.ready) return { ok: false, error: readiness.reason };

  const method = live?.[control];
  if (typeof method !== 'function') {
    return { ok: false, error: `The SDK ${control} control is unavailable.` };
  }

  // MediaSFU's media controls return void and report refusals — "Access denied
  // by host", "A request is pending", recording locks, audio-only events —
  // exclusively through showAlert. Without this, a control the host has blocked
  // resolves normally and we would report success for something that did not
  // happen. Compare the alert before and after and treat a new danger/warning
  // as the failure reason.
  const alertBefore = live?.alertMessage || '';
  try {
    await method({ ...(extra || {}), parameters: live });
  } catch (error: any) {
    return { ok: false, error: error?.message || 'The media control failed.' };
  }

  const settled = getCurrentParams({ parameters: live });
  const alertAfter = settled?.alertMessage || '';
  const alertType = settled?.alertType;
  if (
    alertAfter
    && alertAfter !== alertBefore
    && (alertType === 'danger' || alertType === 'warning')
  ) {
    return { ok: false, error: alertAfter };
  }
  return { ok: true, error: '' };
}
