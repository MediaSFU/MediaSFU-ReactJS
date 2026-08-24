import { HeadlessOptions, HeadlessParameters } from './headlessTypes';
import { getCurrentParams } from './getCurrentParams';
import { HeadlessActionResult } from './roomActions';
import { modifySettings } from '../../settingsMethods/modifySettings';
import { switchVideo } from '../../streamMethods/switchVideo';
import { switchVideoAlt } from '../../streamMethods/switchVideoAlt';
import { switchAudio } from '../../streamMethods/switchAudio';

/**
 * Run an SDK control and turn its refusal into a real error.
 *
 * MediaSFU's stream methods resolve void and report refusals — host blocked,
 * request pending, audio-only event — only through `showAlert`. Without
 * comparing the alert across the call, a blocked switch looks like a success.
 * `runMediaControl` does this for controls published on the parameter bag;
 * these three are not on it and must be imported, hence the local copy.
 */
async function invokeChecked(
  live: HeadlessParameters,
  run: () => Promise<void>
): Promise<HeadlessActionResult> {
  const alertBefore = live?.alertMessage || '';
  try {
    await run();
  } catch (error: any) {
    return { ok: false, error: error?.message || 'The device switch failed.' };
  }
  const settled = getCurrentParams({ parameters: live });
  const alertAfter = settled?.alertMessage || '';
  const alertType = settled?.alertType;
  if (alertAfter && alertAfter !== alertBefore
    && (alertType === 'danger' || alertType === 'warning')) {
    return { ok: false, error: alertAfter };
  }
  return { ok: true, error: '' };
}

/* ------------------------------------------------------------------ *
 * Device switching
 * ------------------------------------------------------------------ */

export interface SwitchDeviceOptions extends HeadlessOptions {
  /** `deviceId` from `listMediaDevices()`. */
  deviceId: string;
}

export type SwitchCameraType = (options: SwitchDeviceOptions) => Promise<HeadlessActionResult>;

/**
 * Switch to a different camera.
 *
 * Pairs with `listMediaDevices()` / `getSelectedDevices()`, which could
 * previously only report devices with no way to act on them.
 *
 * Goes through the SDK's own `switchUserVideo`, so the producer track is
 * replaced on the existing transport — remote viewers see the new camera
 * without the call renegotiating — and host restrictions still apply. A refusal
 * (blocked by the host, audio-only event) is returned as `ok: false` with the
 * reason rather than resolving silently.
 *
 * @example
 * ```ts
 * const { video } = await listMediaDevices();
 * await switchCamera({ parameters, deviceId: video[1].deviceId });
 * ```
 */
export async function switchCamera({
  parameters,
  deviceId,
}: SwitchDeviceOptions): Promise<HeadlessActionResult> {
  if (!deviceId) return { ok: false, error: 'A camera deviceId is required.' };
  const live = getCurrentParams({ parameters });
  return invokeChecked(live, () => switchVideo({ videoPreference: deviceId, parameters: live as any }));
}

/**
 * Flip between the front and rear cameras.
 *
 * This toggles — the SDK's `switchVideoAlt` swaps whichever facing mode is
 * current and takes no target, so there is no way to ask for "front"
 * specifically. Use `switchCamera` with a deviceId when you need to land on a
 * particular camera; use this on mobile, where device ids are unstable across
 * sessions but the flip gesture is what users expect.
 */
export async function flipCamera({ parameters }: HeadlessOptions): Promise<HeadlessActionResult> {
  const live = getCurrentParams({ parameters });
  return invokeChecked(live, () => switchVideoAlt({ parameters: live as any }));
}

export type SwitchMicrophoneType = (options: SwitchDeviceOptions) => Promise<HeadlessActionResult>;

/** Switch to a different microphone. The audio counterpart of `switchCamera`. */
export async function switchMicrophone({
  parameters,
  deviceId,
}: SwitchDeviceOptions): Promise<HeadlessActionResult> {
  if (!deviceId) return { ok: false, error: 'A microphone deviceId is required.' };
  const live = getCurrentParams({ parameters });
  return invokeChecked(live, () => switchAudio({ audioPreference: deviceId, parameters: live as any }));
}

/* ------------------------------------------------------------------ *
 * Room media policy (host)
 * ------------------------------------------------------------------ */

/** 'allow' — anyone may; 'approval' — must ask the host; 'disallow' — nobody may. */
export type RoomPolicyValue = 'allow' | 'approval' | 'disallow';

export interface SetRoomMediaPolicyOptions extends HeadlessOptions {
  audio?: RoomPolicyValue;
  video?: RoomPolicyValue;
  screenshare?: RoomPolicyValue;
  chat?: RoomPolicyValue;
}

/**
 * Set what participants are allowed to do — the room-wide policy behind the
 * SDK's settings modal.
 *
 * This is the *rule*, not a one-off action: `setParticipantMedia` (moderation)
 * turns one person's camera off now, whereas `video: 'approval'` here means
 * everyone must ask before turning one on. `getMediaPermissions()` reads the
 * same four values back.
 *
 * Host only. Any value left undefined keeps its current setting.
 *
 * @example
 * ```ts
 * await setRoomMediaPolicy({ parameters, audio: 'approval', screenshare: 'disallow' });
 * ```
 */
export async function setRoomMediaPolicy({
  parameters,
  audio,
  video,
  screenshare,
  chat,
}: SetRoomMediaPolicyOptions): Promise<HeadlessActionResult> {
  const live = getCurrentParams({ parameters });
  if (String(live.islevel) !== '2') {
    return { ok: false, error: 'Only the host can change room settings.' };
  }
  if (!live.socket) {
    return { ok: false, error: 'The room connection is not ready yet.' };
  }
  try {
    // Imported rather than read off the parameter bag: unlike the media
    // controls, `modifySettings` is not published on it.
    await modifySettings({
      roomName: live.roomName || '',
      // The SDK requires all four on every call, so unspecified values are
      // filled from current state — otherwise changing one would blank the rest.
      audioSet: audio || live.audioSetting || 'allow',
      videoSet: video || live.videoSetting || 'allow',
      screenshareSet: screenshare || live.screenshareSetting || 'allow',
      chatSet: chat || live.chatSetting || 'allow',
      socket: live.socket,
      showAlert: live.showAlert,
      updateAudioSetting: live.updateAudioSetting,
      updateVideoSetting: live.updateVideoSetting,
      updateScreenshareSetting: live.updateScreenshareSetting,
      updateChatSetting: live.updateChatSetting,
      updateIsSettingsModalVisible: live.updateIsSettingsModalVisible || (() => {}),
    });
    return { ok: true, error: '' };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'The room settings could not be updated.' };
  }
}

/* ------------------------------------------------------------------ *
 * Reads
 * ------------------------------------------------------------------ */

export interface ChatMessage {
  sender: string;
  message: string;
  timestamp: string;
  /** Recipients — empty/[] means it went to everyone. */
  receivers: string[];
  /** True when this is a direct message rather than a room-wide one. */
  direct: boolean;
  /** True when the local user sent it. */
  mine: boolean;
}

export interface GetChatMessagesOptions extends HeadlessOptions {
  /** 'all' (default), 'group' for room-wide only, or 'direct' for DMs only. */
  scope?: 'all' | 'group' | 'direct';
  /** Only messages exchanged with this person. Implies direct messages. */
  withPerson?: string;
}

/**
 * Read the chat.
 *
 * `sendChatMessage` existed with no way to read replies, so a headless surface
 * could talk but not listen. Direct messages are flagged and filterable, since
 * rendering a DM in the room-wide thread leaks it to the wrong audience.
 *
 * Call from `onMediaChanged` or a render to get the current list.
 */
export function getChatMessages({
  parameters,
  scope = 'all',
  withPerson = '',
}: GetChatMessagesOptions): ChatMessage[] {
  const source: HeadlessParameters = parameters || {};
  const raw = Array.isArray(source.messages) ? source.messages : [];
  const me = source.member || '';

  return raw
    .map((entry: any) => {
      const receivers = Array.isArray(entry?.receivers) ? entry.receivers : [];
      return {
        sender: entry?.sender || '',
        message: entry?.message || '',
        timestamp: entry?.timestamp || '',
        receivers,
        // MediaSFU marks group messages with an empty receivers list; anything
        // addressed is a DM.
        direct: receivers.length > 0,
        mine: entry?.sender === me,
      } as ChatMessage;
    })
    .filter((message) => {
      if (scope === 'group' && message.direct) return false;
      if (scope === 'direct' && !message.direct) return false;
      if (withPerson) {
        return message.sender === withPerson || message.receivers.includes(withPerson);
      }
      return true;
    });
}

export interface PendingApprovals {
  /** People held in the waiting room. */
  waiting: { name: string; id: string }[];
  /** Requests to unmute, turn a camera on, share, or chat. */
  requests: { id: string; name: string; icon: string; username: string }[];
  /** Total items needing a host decision. */
  total: number;
}

/**
 * Everything currently awaiting a host decision.
 *
 * `respondToWaitingParticipant` and `respondToParticipantRequest` could act on
 * these but nothing could list them, so a headless host had no way to know a
 * decision was pending. Badge `total` and render the two lists.
 */
export function getPendingApprovals({ parameters }: HeadlessOptions): PendingApprovals {
  const source: HeadlessParameters = parameters || {};
  const waitingRaw = Array.isArray(source.waitingRoomList) ? source.waitingRoomList : [];
  const requestRaw = Array.isArray(source.requestList) ? source.requestList : [];

  const waiting = waitingRaw.map((entry: any) => ({
    name: entry?.name || '',
    id: entry?.id || '',
  }));
  const requests = requestRaw.map((entry: any) => ({
    id: entry?.id || '',
    name: entry?.name || '',
    // 'fa-microphone' | 'fa-video' | 'fa-desktop' | 'fa-comments' — what they asked for.
    icon: entry?.icon || '',
    username: entry?.username || entry?.name || '',
  }));

  return { waiting, requests, total: waiting.length + requests.length };
}

export interface SessionTimer {
  /** Elapsed wall time, formatted by the SDK (e.g. "12:04"). */
  elapsed: string;
  /**
   * True while the server is asking whether you are still there — see
   * `getPresenceCheck`, which you must answer or be disconnected.
   */
  presenceCheckPending: boolean;
}

/**
 * How long the session has been running.
 *
 * Deliberately does not report "time remaining": the server sends that on the
 * `meetingTimeRemaining` event, which the SDK forwards straight to `showAlert`
 * without storing it. There is no field to read, and inventing one from the
 * last alert would be a guess. Watch `showAlert` if you need the warning.
 */
export function getSessionTimer({ parameters }: HeadlessOptions): SessionTimer {
  const source: HeadlessParameters = parameters || {};
  return {
    elapsed: source.meetingProgressTime || '00:00',
    presenceCheckPending: Boolean(source.isConfirmHereModalVisible),
  };
}

export interface PresenceCheck {
  /** True while the "are you still there?" check is waiting on an answer. */
  pending: boolean;
}

/**
 * Whether the server is currently asking if you are still there.
 *
 * **This matters more headlessly than it looks.** On an idle room the server
 * emits `meetingStillThere`, and the SDK opens a modal that counts down and
 * then emits `disconnectUser`. With `returnUI={false}` that modal is still
 * mounted — inside a root collapsed to 0×0 — so the countdown runs invisibly
 * and the session is dropped with nothing shown and nothing to click.
 *
 * Poll this (from `onMediaChanged`, or a timer) and call `confirmStillHere`
 * to stay in the room.
 */
export function getPresenceCheck({ parameters }: HeadlessOptions): PresenceCheck {
  const source: HeadlessParameters = parameters || {};
  return { pending: Boolean(source.isConfirmHereModalVisible) };
}

/**
 * Answer the "are you still there?" check and stay in the room.
 *
 * Closing the check is the whole answer — the SDK only disconnects on the
 * countdown expiring, so cancelling it is what keeps the session alive. Safe to
 * call when nothing is pending.
 */
export function confirmStillHere({ parameters }: HeadlessOptions): HeadlessActionResult {
  const live = getCurrentParams({ parameters });
  const update = live.updateIsConfirmHereModalVisible;
  if (typeof update !== 'function') {
    return { ok: false, error: 'The presence check control is unavailable.' };
  }
  update(false);
  return { ok: true, error: '' };
}
