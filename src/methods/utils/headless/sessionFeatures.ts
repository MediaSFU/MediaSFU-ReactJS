import { confirmRecording } from '../../recordingMethods/confirmRecording';
import { startRecording } from '../../recordingMethods/startRecording';
import { stopRecording } from '../../recordingMethods/stopRecording';
import { updateRecording } from '../../recordingMethods/updateRecording';
import { handleCreatePoll } from '../../pollsMethods/handleCreatePoll';
import { handleVotePoll } from '../../pollsMethods/handleVotePoll';
import { handleEndPoll } from '../../pollsMethods/handleEndPoll';
import { HeadlessOptions, HeadlessParameters } from './headlessTypes';
import { getCurrentParams } from './getCurrentParams';
import { HeadlessActionResult } from './roomActions';

const noop = () => undefined;

/* ------------------------------------------------------------------ *
 * Recording
 * ------------------------------------------------------------------ */

export type RecordingStatus =
  | 'unavailable'
  | 'idle'
  | 'recording'
  | 'paused'
  | 'stopped';

export interface RecordingState {
  status: RecordingStatus;
  /** True while frames are being captured right now. */
  active: boolean;
  /** The local user may start/stop recording. */
  canRecord: boolean;
  /** 'video' | 'audio' — what the room is configured to capture. */
  mediaOptions: string;
  /** Seconds elapsed, as reported by the SDK. */
  elapsedSeconds: number;
}

export type GetRecordingStateType = (options: HeadlessOptions) => RecordingState;

/**
 * Collapse MediaSFU's four recording booleans into one status.
 *
 * The SDK tracks `recordStarted`, `recordPaused`, `recordResumed` and
 * `recordStopped` independently, and they overlap — after a pause/resume cycle
 * `recordStarted` and `recordResumed` are both true. Deriving "is it recording?"
 * from any single flag gives the wrong answer at least once per session.
 *
 * @example
 * ```ts
 * const recording = getRecordingState({ parameters });
 * if (recording.status === 'paused') showResumeButton();
 * ```
 */
export function getRecordingState({ parameters }: HeadlessOptions): RecordingState {
  const source: HeadlessParameters = parameters || {};
  const canRecord = source.canRecord === true;
  let status: RecordingStatus = 'idle';
  if (!canRecord && !source.recordStarted) status = 'unavailable';
  else if (source.recordStopped) status = 'stopped';
  else if (source.recordStarted && source.recordPaused) status = 'paused';
  else if (source.recordStarted) status = 'recording';

  return {
    status,
    active: status === 'recording',
    canRecord,
    mediaOptions: source.recordingMediaOptions || 'video',
    elapsedSeconds: Number(source.recordElapsedTime) || 0,
  };
}

export type RecordingActionType = (
  options: HeadlessOptions
) => Promise<HeadlessActionResult>;

/**
 * Start recording.
 *
 * MediaSFU requires `confirmRecording` before `startRecording` — it validates
 * the room's recording settings against the current layout and populates the
 * state `startRecording` then reads. Calling `startRecording` alone appears to
 * do nothing. This runs both steps in order.
 *
 * @example
 * ```ts
 * import { startRoomRecording } from 'mediasfu-reactjs';
 *
 * const result = await startRoomRecording({ parameters });
 * if (!result.ok) setNotice(result.error);
 * ```
 */
export async function startRoomRecording({
  parameters,
}: HeadlessOptions): Promise<HeadlessActionResult> {
  try {
    const live = getCurrentParams({ parameters });
    if (live.canRecord !== true) {
      return { ok: false, error: 'Recording is not available in this room.' };
    }
    if (live.recordStarted && !live.recordStopped) {
      return { ok: false, error: 'Recording has already started.' };
    }
    await confirmRecording({ parameters: live as any });
    const refreshed = getCurrentParams({ parameters: live });
    await startRecording({ parameters: refreshed as any });
    return { ok: true, error: '' };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'Recording could not be started.' };
  }
}

/** Pause an active recording. */
export async function pauseRoomRecording({
  parameters,
}: HeadlessOptions): Promise<HeadlessActionResult> {
  return toggleRecordingPause(parameters, true);
}

/** Resume a paused recording. */
export async function resumeRoomRecording({
  parameters,
}: HeadlessOptions): Promise<HeadlessActionResult> {
  return toggleRecordingPause(parameters, false);
}

async function toggleRecordingPause(
  parameters: HeadlessParameters,
  pause: boolean
): Promise<HeadlessActionResult> {
  try {
    const live = getCurrentParams({ parameters });
    const state = getRecordingState({ parameters: live });
    if (state.status !== (pause ? 'recording' : 'paused')) {
      return {
        ok: false,
        error: pause
          ? 'There is no active recording to pause.'
          : 'There is no paused recording to resume.',
      };
    }
    // `updateRecording` is the SDK's pause/resume toggle; it decides direction
    // from the current recordPaused state, which we just validated.
    await updateRecording({ parameters: live as any });
    return { ok: true, error: '' };
  } catch (error: any) {
    return {
      ok: false,
      error: error?.message || 'The recording state could not be changed.',
    };
  }
}

/** Stop recording. The file becomes available through the MediaSFU API. */
export async function stopRoomRecording({
  parameters,
}: HeadlessOptions): Promise<HeadlessActionResult> {
  try {
    const live = getCurrentParams({ parameters });
    if (!live.recordStarted || live.recordStopped) {
      return { ok: false, error: 'There is no active recording to stop.' };
    }
    await stopRecording({ parameters: live as any });
    return { ok: true, error: '' };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'Recording could not be stopped.' };
  }
}

/* ------------------------------------------------------------------ *
 * Whiteboard
 * ------------------------------------------------------------------ */

export interface WhiteboardState {
  /** True while a whiteboard session is running. */
  active: boolean;
  /** The local user may start one. */
  canStart: boolean;
  /** Participants granted drawing rights. */
  users: any[];
  /** Maximum participants the room's plan allows on a whiteboard. */
  limit: number;
  /** The live canvas element, when the SDK has created one. */
  canvas: HTMLCanvasElement | null;
}

export type GetWhiteboardStateType = (
  options: HeadlessOptions
) => WhiteboardState;

/**
 * Current whiteboard session state.
 *
 * `whiteboardStarted` alone is not enough — the SDK leaves it true after a
 * session ends and sets `whiteboardEnded` alongside it, so "active" is
 * `started && !ended`.
 */
export function getWhiteboardState({ parameters }: HeadlessOptions): WhiteboardState {
  const source: HeadlessParameters = parameters || {};
  return {
    active: source.whiteboardStarted === true && source.whiteboardEnded !== true,
    canStart: source.canStartWhiteboard === true,
    users: Array.isArray(source.whiteboardUsers) ? source.whiteboardUsers : [],
    limit: Number(source.whiteboardLimit) || 0,
    canvas: source.canvasWhiteboard || null,
  };
}

export interface StartWhiteboardOptions extends HeadlessOptions {
  /** Participants allowed to draw. Defaults to the room's current selection. */
  users?: any[];
}

export type StartWhiteboardType = (
  options: StartWhiteboardOptions
) => Promise<HeadlessActionResult>;

/**
 * Start (or reconfigure) the shared whiteboard.
 *
 * Emits `startWhiteboard` for a new session and `updateWhiteboard` when one is
 * already running, matching the SDK's own modal. Breakout rooms and the
 * whiteboard are mutually exclusive, which is checked here.
 *
 * This applies the session state only. Layout follow-up (`onScreenChanges`,
 * `prepopulateUserMedia`, main-pane sizing) is deliberately left to you, since a
 * headless surface owns its own layout.
 *
 * @example
 * ```ts
 * await startWhiteboard({ parameters, users: [{ name: 'Paul' }] });
 * ```
 */
export async function startWhiteboard({
  parameters,
  users,
}: StartWhiteboardOptions): Promise<HeadlessActionResult> {
  try {
    const live = getCurrentParams({ parameters });
    if (live.breakOutRoomStarted && !live.breakOutRoomEnded) {
      return {
        ok: false,
        error: 'The whiteboard cannot start while breakout rooms are active.',
      };
    }
    const socket = live?.socket;
    if (!socket || typeof socket.emit !== 'function' || !live?.roomName) {
      return { ok: false, error: 'The room connection is not ready.' };
    }
    const state = getWhiteboardState({ parameters: live });
    if (!state.active && !state.canStart) {
      return { ok: false, error: 'You are not allowed to start the whiteboard.' };
    }
    const whiteboardUsers = users ?? state.users;
    if (state.limit > 0 && whiteboardUsers.length > state.limit) {
      return {
        ok: false,
        error: `The whiteboard allows at most ${state.limit} participants.`,
      };
    }

    const event = state.active ? 'updateWhiteboard' : 'startWhiteboard';
    const response = await new Promise<any>((resolve) => {
      socket.emit(event, { whiteboardUsers, roomName: live.roomName }, resolve);
    });
    if (!response?.success) {
      return {
        ok: false,
        error: response?.reason || 'The whiteboard could not be started.',
      };
    }
    live.updateWhiteboardStarted?.(true);
    live.updateWhiteboardEnded?.(false);
    live.updateWhiteboardUsers?.(whiteboardUsers);
    live.updateCanStartWhiteboard?.(false);
    return { ok: true, error: '' };
  } catch (error: any) {
    return {
      ok: false,
      error: error?.message || 'The whiteboard could not be started.',
    };
  }
}

export type StopWhiteboardType = (
  options: HeadlessOptions
) => Promise<HeadlessActionResult>;

/** End the shared whiteboard session. */
export async function stopWhiteboard({
  parameters,
}: HeadlessOptions): Promise<HeadlessActionResult> {
  try {
    const live = getCurrentParams({ parameters });
    const socket = live?.socket;
    if (!socket || typeof socket.emit !== 'function' || !live?.roomName) {
      return { ok: false, error: 'The room connection is not ready.' };
    }
    if (!getWhiteboardState({ parameters: live }).active) {
      return { ok: false, error: 'The whiteboard is not running.' };
    }
    const response = await new Promise<any>((resolve) => {
      socket.emit('stopWhiteboard', { roomName: live.roomName }, resolve);
    });
    if (!response?.success) {
      return {
        ok: false,
        error: response?.reason || 'The whiteboard could not be stopped.',
      };
    }
    live.updateWhiteboardStarted?.(false);
    live.updateWhiteboardEnded?.(true);
    return { ok: true, error: '' };
  } catch (error: any) {
    return {
      ok: false,
      error: error?.message || 'The whiteboard could not be stopped.',
    };
  }
}

/* ------------------------------------------------------------------ *
 * Polls
 * ------------------------------------------------------------------ */

export interface PollState {
  /** Every poll the room has seen. */
  polls: any[];
  /** The poll currently open for voting, if any. */
  active: any | null;
}

export type GetPollStateType = (options: HeadlessOptions) => PollState;

/** Polls in the room, plus whichever one is currently open. */
export function getPollState({ parameters }: HeadlessOptions): PollState {
  const source: HeadlessParameters = parameters || {};
  const polls = Array.isArray(source.polls) ? source.polls : [];
  const active =
    source.poll && source.poll.status === 'active'
      ? source.poll
      : polls.find((entry: any) => entry?.status === 'active') || null;
  return { polls, active };
}

export interface CreatePollOptions extends HeadlessOptions {
  question: string;
  options: string[];
  /** Defaults to 'custom'. */
  type?: string;
}

export type CreateRoomPollType = (
  options: CreatePollOptions
) => Promise<HeadlessActionResult>;

/**
 * Open a poll.
 *
 * @example
 * ```ts
 * await createRoomPoll({
 *   parameters,
 *   question: 'Ship on Friday?',
 *   options: ['Yes', 'No'],
 * });
 * ```
 */
export async function createRoomPoll({
  parameters,
  question,
  options,
  type = 'custom',
}: CreatePollOptions): Promise<HeadlessActionResult> {
  try {
    const live = getCurrentParams({ parameters });
    if (!question?.trim()) return { ok: false, error: 'The poll needs a question.' };
    if (!Array.isArray(options) || options.length < 2) {
      return { ok: false, error: 'The poll needs at least two options.' };
    }
    await handleCreatePoll({
      poll: { question, options, type } as any,
      socket: live.socket,
      roomName: live.roomName || '',
      showAlert: live.showAlert,
      updateIsPollModalVisible: live.updateIsPollModalVisible || noop,
    });
    return { ok: true, error: '' };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'The poll could not be created.' };
  }
}

export interface VotePollOptions extends HeadlessOptions {
  pollId: string;
  optionIndex: number;
}

/** Cast a vote in an open poll. */
export async function voteInRoomPoll({
  parameters,
  pollId,
  optionIndex,
}: VotePollOptions): Promise<HeadlessActionResult> {
  try {
    const live = getCurrentParams({ parameters });
    await handleVotePoll({
      pollId,
      optionIndex,
      socket: live.socket,
      showAlert: live.showAlert,
      member: live.member || '',
      roomName: live.roomName || '',
      updateIsPollModalVisible: live.updateIsPollModalVisible || noop,
    });
    return { ok: true, error: '' };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'The vote could not be cast.' };
  }
}

export interface EndPollOptions extends HeadlessOptions {
  pollId: string;
}

/** Close a poll. Host only. */
export async function endRoomPoll({
  parameters,
  pollId,
}: EndPollOptions): Promise<HeadlessActionResult> {
  try {
    const live = getCurrentParams({ parameters });
    if (String(live.islevel) !== '2') {
      return { ok: false, error: 'Only the host can end a poll.' };
    }
    await handleEndPoll({
      pollId,
      socket: live.socket,
      showAlert: live.showAlert,
      roomName: live.roomName || '',
      updateIsPollModalVisible: live.updateIsPollModalVisible || noop,
    });
    return { ok: true, error: '' };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'The poll could not be ended.' };
  }
}

/* ------------------------------------------------------------------ *
 * Breakout rooms
 * ------------------------------------------------------------------ */

export interface BreakoutState {
  /** True while breakout rooms are running. */
  active: boolean;
  /** The local user may start them. */
  canStart: boolean;
  /** Room composition as the SDK holds it. */
  rooms: any[];
  /** The breakout room the local user is in, or -1. */
  currentRoom: number;
}

export type GetBreakoutStateType = (options: HeadlessOptions) => BreakoutState;

/**
 * Breakout-room state.
 *
 * Same `started && !ended` shape as the whiteboard, and the two are mutually
 * exclusive — check this before offering a whiteboard control.
 */
export function getBreakoutState({ parameters }: HeadlessOptions): BreakoutState {
  const source: HeadlessParameters = parameters || {};
  return {
    active:
      source.breakOutRoomStarted === true && source.breakOutRoomEnded !== true,
    canStart: source.canStartBreakout === true,
    rooms: Array.isArray(source.breakoutRooms) ? source.breakoutRooms : [],
    currentRoom:
      typeof source.hostNewRoom === 'number' ? source.hostNewRoom : -1,
  };
}
