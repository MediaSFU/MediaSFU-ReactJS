import { HeadlessOptions, HeadlessParameters } from './headlessTypes';

/* ------------------------------------------------------------------ *
 * Recording notices and limits
 * ------------------------------------------------------------------ */

export interface RecordingNotice {
  /** The SDK's current recording notice, or '' when there is none. */
  message: string;
  /** Formatted elapsed time as the SDK reports it (e.g. "00:12:04"). */
  elapsed: string;
  /** Elapsed seconds. */
  elapsedSeconds: number;
  /** True while pause/resume is permitted (the SDK enforces a cooldown). */
  canPauseResume: boolean;
  /** Pauses used so far. */
  pausesUsed: number;
  /** Pauses allowed for the active media type; 0 when unpublished. */
  pauseLimit: number;
  /** True when the pause allowance is exhausted. */
  pauseLimitReached: boolean;
}

export type GetRecordingNoticeType = (options: HeadlessOptions) => RecordingNotice;

/**
 * The user-facing side of recording: the notice, the timer, and the pause
 * allowance.
 *
 * Pause limits are per media type — `recordingAudioPausesLimit` vs
 * `recordingVideoPausesLimit` — and the SDK picks by `recordingMediaOptions`.
 * Reading the wrong one reports the wrong allowance, which is why this is a
 * helper rather than a field read. Complements `getRecordingState`, which
 * covers only the start/pause/resume/stop status.
 */
export function getRecordingNotice({ parameters }: HeadlessOptions): RecordingNotice {
  const source: HeadlessParameters = parameters || {};
  const isAudio = source.recordingMediaOptions === 'audio';
  const pauseLimit = Number(
    isAudio ? source.recordingAudioPausesLimit : source.recordingVideoPausesLimit
  ) || 0;
  const pausesUsed = Number(source.pauseRecordCount) || 0;
  return {
    message: source.recordingNotice || '',
    elapsed: source.recordingProgressTime || '00:00:00',
    elapsedSeconds: Number(source.recordElapsedTime) || 0,
    canPauseResume: source.canPauseResume === true,
    pausesUsed,
    pauseLimit,
    pauseLimitReached: pauseLimit > 0 && pausesUsed >= pauseLimit,
  };
}

export interface RecordingCapabilities {
  /** Recording audio at all. */
  audio: boolean;
  /** Recording video at all. */
  video: boolean;
  /** Recording every participant, not just the active speaker. */
  allParticipants: boolean;
  /** Recording every participant's video. */
  videoParticipants: boolean;
  /** Adding an HLS output. */
  hls: boolean;
  /** Max people included in an audio recording; 0 when unpublished. */
  audioPeopleLimit: number;
  /** Max people included in a video recording; 0 when unpublished. */
  videoPeopleLimit: number;
}

export type GetRecordingCapabilitiesType = (
  options: HeadlessOptions
) => RecordingCapabilities;

/**
 * What this room's plan actually permits recording.
 *
 * These are entitlement flags the server publishes per room, so a UI should
 * gate on them rather than offering options the room will refuse.
 */
export function getRecordingCapabilities({
  parameters,
}: HeadlessOptions): RecordingCapabilities {
  const source: HeadlessParameters = parameters || {};
  return {
    audio: source.recordingAudioSupport === true,
    video: source.recordingVideoSupport === true,
    allParticipants: source.recordingAllParticipantsSupport === true,
    videoParticipants: source.recordingVideoParticipantsSupport === true,
    hls: source.recordingAddHLS === true,
    audioPeopleLimit: Number(source.recordingAudioPeopleLimit) || 0,
    videoPeopleLimit: Number(source.recordingVideoPeopleLimit) || 0,
  };
}

/* ------------------------------------------------------------------ *
 * Translation
 * ------------------------------------------------------------------ */

export interface TranslationPreference {
  /** Language applied to every speaker, or null when unset. */
  globalLanguage: string | null;
  /** Per-speaker overrides, keyed by speaker id. */
  perSpeaker: { speakerId: string; language: string | null; wantOriginal: boolean }[];
}

export interface TranslationState extends TranslationPreference {
  /** True when any translation is currently being consumed. */
  active: boolean;
  /** Languages the room currently has translation producers for. */
  availableLanguages: string[];
}

export type GetTranslationStateType = (options: HeadlessOptions) => TranslationState;

/**
 * What the listener is currently hearing, and what is on offer.
 *
 * `listenerTranslationPreferences.perSpeaker` is a `Map` on the bag, which does
 * not survive serialisation or spread; this returns a plain array so it can be
 * rendered and compared normally. Translation audio itself already reaches the
 * user through `getAudioGridComponents`, which folds in `translationStreams`.
 */
export function getTranslationState({ parameters }: HeadlessOptions): TranslationState {
  const source: HeadlessParameters = parameters || {};
  const preferences: any = source.listenerTranslationPreferences || {};
  const perSpeakerMap = preferences.perSpeaker;
  const perSpeaker = perSpeakerMap instanceof Map
    ? Array.from(perSpeakerMap.values())
    : Array.isArray(perSpeakerMap) ? perSpeakerMap : [];

  const speakerStates: any = source.speakerTranslationStates;
  const languages = new Set<string>();
  const collect = (value: any) => {
    if (value?.language) languages.add(value.language);
  };
  if (speakerStates instanceof Map) speakerStates.forEach(collect);
  else if (Array.isArray(speakerStates)) speakerStates.forEach(collect);
  perSpeaker.forEach(collect);
  if (preferences.globalLanguage) languages.add(preferences.globalLanguage);

  return {
    globalLanguage: preferences.globalLanguage ?? null,
    perSpeaker,
    active: Boolean(
      preferences.globalLanguage
        || perSpeaker.some((entry) => entry?.language && !entry.wantOriginal)
    ),
    availableLanguages: Array.from(languages),
  };
}

export interface SetTranslationPreferenceOptions extends HeadlessOptions {
  /** Language for every speaker. `null` restores the original audio. */
  language?: string | null;
  /** Limit the change to one speaker. */
  speakerId?: string;
  /** Explicitly prefer the untranslated audio for this speaker. */
  wantOriginal?: boolean;
}

export type SetTranslationPreferenceType = (
  options: SetTranslationPreferenceOptions
) => { ok: boolean; error: string };

/**
 * Choose a translation language, globally or for one speaker.
 *
 * Delegates to the SDK's `updateListenerTranslationPreferences`, which is what
 * syncs the choice to the server for routing and billing — setting the bag's
 * fields directly would change local state without telling the server.
 */
export function setTranslationPreference({
  parameters,
  language = null,
  speakerId,
  wantOriginal = false,
}: SetTranslationPreferenceOptions): { ok: boolean; error: string } {
  const source: HeadlessParameters = parameters || {};
  const update = source.updateListenerTranslationPreferences;
  if (typeof update !== 'function') {
    return { ok: false, error: 'Translation is not available in this room.' };
  }
  try {
    const current: any = source.listenerTranslationPreferences || {};
    const perSpeaker = current.perSpeaker instanceof Map
      ? new Map(current.perSpeaker)
      : new Map();
    if (speakerId) {
      perSpeaker.set(speakerId, { speakerId, language, wantOriginal });
      update({ perSpeaker, globalLanguage: current.globalLanguage ?? null });
    } else {
      update({ perSpeaker, globalLanguage: language });
    }
    return { ok: true, error: '' };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'The translation preference could not be set.' };
  }
}

/* ------------------------------------------------------------------ *
 * Panelists and focus mode
 * ------------------------------------------------------------------ */

export interface FocusModeState {
  /** True while focus mode is active. */
  active: boolean;
  /** Participants permitted to speak/appear while focus mode is on. */
  panelists: { name: string; [key: string]: any }[];
  /** True when the local user is one of them. */
  selfIsPanelist: boolean;
  /** True when focus mode silences non-panelist microphones. */
  mutesMicrophones: boolean;
  /** True when focus mode blocks non-panelist cameras. */
  mutesCameras: boolean;
}

export type GetFocusModeStateType = (options: HeadlessOptions) => FocusModeState;

/**
 * Focus-mode ("only panelists") state.
 *
 * The field is `muteOthersCamera`, not `muteOthersVideo` — worth stating,
 * because the neighbouring flag is `muteOthersMic` and the asymmetry invites a
 * wrong guess. {@link getMediaPermissions} already applies these rules to the
 * local user; this exposes the room-level picture for a roster UI.
 */
export function getFocusModeState({ parameters }: HeadlessOptions): FocusModeState {
  const source: HeadlessParameters = parameters || {};
  const panelists = Array.isArray(source.panelists) ? source.panelists : [];
  return {
    active: source.panelistsFocused === true,
    panelists,
    selfIsPanelist: panelists.some((entry: any) => entry?.name === source.member),
    mutesMicrophones: source.muteOthersMic === true,
    mutesCameras: source.muteOthersCamera === true,
  };
}

/* ------------------------------------------------------------------ *
 * Virtual background
 * ------------------------------------------------------------------ */

export interface VirtualBackgroundState {
  /** True when a processed (background-applied) stream is being published. */
  active: boolean;
  /** The processed stream, when one exists. */
  stream: MediaStream | null;
  /** The background currently applied, if the SDK reports one. */
  appliedBackground: any;
  /** The image the user selected, if any. */
  selectedImage: string | null;
}

export type GetVirtualBackgroundStateType = (
  options: HeadlessOptions
) => VirtualBackgroundState;

/**
 * Read-only virtual-background state.
 *
 * **You do not need this to render the right self-view.**
 * `getLocalVideoStream` already returns the processed `virtualStream` whenever
 * `keepBackground` is on, and the raw camera otherwise — the same rule the SDK's
 * own grid uses. Rendering `localStreamVideo` directly is what shows a user
 * their *unprocessed* background, so prefer the helper and ignore this.
 *
 * This exists for UI that needs to *describe* the state ("Background on"), not
 * to choose a stream.
 *
 * Known gap: applying or clearing a background is still modal-driven in the SDK
 * (`isBackgroundModalVisible` / `autoClickBackground`), so a `returnUI={false}`
 * surface cannot currently turn a background on by itself. Reading works
 * headlessly; controlling does not.
 */
export function getVirtualBackgroundState({
  parameters,
}: HeadlessOptions): VirtualBackgroundState {
  const source: HeadlessParameters = parameters || {};
  const stream = (source.virtualStream || source.processedStream) as MediaStream | null;
  return {
    active: source.keepBackground === true && Boolean(stream),
    stream: stream || null,
    appliedBackground: source.appliedBackground ?? null,
    selectedImage: source.selectedImage ?? null,
  };
}

/* ------------------------------------------------------------------ *
 * Local playback control (per-participant)
 * ------------------------------------------------------------------ */

export interface SetParticipantPlaybackOptions extends HeadlessOptions {
  /** Participant display name. */
  name?: string;
  /** Producer id, when you already hold one. */
  producerId?: string;
  /** Which of their tracks to affect. Defaults to both. */
  kind?: 'audio' | 'video' | 'all';
  /** True to stop receiving, false to resume. */
  paused: boolean;
}

export type SetParticipantPlaybackType = (
  options: SetParticipantPlaybackOptions
) => Promise<{ ok: boolean; error: string; affected: number }>;

/**
 * Producer ids this viewer has locally paused.
 *
 * Module-level rather than on the parameter bag: the SDK owns that bag and
 * rebuilds it, and this is a purely local preference that must survive those
 * rebuilds so `reapplyLocalPlayback` can re-assert it after a layout pass.
 */
const LOCALLY_PAUSED = new Set<string>();

/**
 * Stop or resume playing one participant's media **for you only**.
 *
 * This is a local, per-viewer control — "don't play this person to me right
 * now". It pauses the mediasoup consumer, so the server stops sending that
 * track to you: it saves bandwidth as well as silencing them, and it is
 * invisible to everyone else. It is NOT moderation — the participant keeps
 * publishing and other people keep receiving. Use `setParticipantMedia` from
 * the moderation module to actually stop someone's media for the room.
 *
 * Note this is deliberately not `resumePauseStreams`, which the SDK drives from
 * the active-speaker layout (`dispActiveNames`) and will happily undo a manual
 * choice on its next pass. This targets the consumer directly.
 *
 * @example
 * ```ts
 * // Stop hearing and seeing Paul locally
 * await setParticipantPlayback({ parameters, name: 'Paul', paused: true });
 * // Just their audio
 * await setParticipantPlayback({ parameters, name: 'Paul', kind: 'audio', paused: true });
 * ```
 */
export async function setParticipantPlayback({
  parameters,
  name = '',
  producerId = '',
  kind = 'all',
  paused,
}: SetParticipantPlaybackOptions): Promise<{ ok: boolean; error: string; affected: number }> {
  try {
    const source: HeadlessParameters = parameters || {};
    const participants = Array.isArray(source.participants) ? source.participants : [];
    const participant = name
      ? participants.find((part: any) => part?.name === name)
      : undefined;

    const targets = new Set<string>();
    if (producerId) targets.add(producerId);
    const usable = (value: unknown) =>
      typeof value === 'string' && value.length > 3 && value.toLowerCase() !== 'none';
    if (participant) {
      if (kind !== 'video' && usable(participant.audioID)) targets.add(participant.audioID as string);
      if (kind !== 'audio' && usable(participant.videoID)) targets.add(participant.videoID as string);
    }
    if (targets.size === 0) {
      return { ok: false, error: 'That participant is not publishing anything to pause.', affected: 0 };
    }

    const transports = Array.isArray(source.consumerTransports) ? source.consumerTransports : [];
    let affected = 0;
    for (const entry of transports as any[]) {
      const consumer = entry?.consumer;
      const id = entry?.producerId || consumer?.producerId;
      if (!consumer || !targets.has(id)) continue;
      if (kind !== 'all' && consumer.track?.kind !== kind) continue;
      try {
        if (paused && typeof consumer.pause === 'function') {
          await consumer.pause();
          LOCALLY_PAUSED.add(id);
          affected += 1;
        } else if (!paused && typeof consumer.resume === 'function') {
          await consumer.resume();
          LOCALLY_PAUSED.delete(id);
          affected += 1;
        }
      } catch {
        // One failed consumer must not abort the rest.
      }
    }
    return affected > 0
      ? { ok: true, error: '', affected }
      : { ok: false, error: 'No matching incoming stream was found.', affected: 0 };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'The playback change failed.', affected: 0 };
  }
}

/* ------------------------------------------------------------------ *
 * Breakout room composition
 * ------------------------------------------------------------------ */

export type BreakoutParticipantRef = { name: string; breakRoom: number };

export interface SetBreakoutRoomsOptions extends HeadlessOptions {
  /** Room composition: index in the outer array is the room number. */
  rooms: BreakoutParticipantRef[][];
  /** What happens to people who join later. Defaults to the room's setting. */
  newParticipantAction?: string;
}

export type SetBreakoutRoomsType = (
  options: SetBreakoutRoomsOptions
) => Promise<{ ok: boolean; error: string }>;

/**
 * Publish a full breakout-room composition.
 *
 * The SDK models breakout rooms as an array of arrays — outer index is the room
 * number, inner entries are `{ name, breakRoom }`. Adding, removing, or moving
 * someone is therefore just editing that array and re-emitting it; there is no
 * per-participant verb. `startBreakout` opens them, `updateBreakout` amends a
 * running set, and the SDK picks by whether they are already started.
 *
 * Prefer {@link assignParticipantToBreakoutRoom} for single-person changes.
 */
export async function setBreakoutRooms({
  parameters,
  rooms,
  newParticipantAction,
}: SetBreakoutRoomsOptions): Promise<{ ok: boolean; error: string }> {
  try {
    const source: HeadlessParameters = parameters || {};
    const socket = source.socket;
    if (!socket || typeof socket.emit !== 'function' || !source.roomName) {
      return { ok: false, error: 'The room connection is not ready.' };
    }
    if (String(source.islevel) !== '2') {
      return { ok: false, error: 'Only the host can change breakout rooms.' };
    }
    const running = source.breakOutRoomStarted === true && source.breakOutRoomEnded !== true;
    const event = running ? 'updateBreakout' : 'startBreakout';
    // Strip anything beyond the two fields the server accepts.
    const payload = (Array.isArray(rooms) ? rooms : []).map((room) =>
      (Array.isArray(room) ? room : []).map(({ name, breakRoom }) => ({ name, breakRoom }))
    );

    const response = await new Promise<any>((resolve) => {
      socket.emit(
        event,
        {
          breakoutRooms: payload,
          newParticipantAction: newParticipantAction || source.newParticipantAction || 'autoAssignNewRoom',
          roomName: source.roomName,
        },
        resolve
      );
    });
    if (!response?.success) {
      return { ok: false, error: response?.reason || 'The breakout rooms could not be updated.' };
    }
    source.updateBreakoutRooms?.(payload);
    source.updateBreakOutRoomStarted?.(true);
    source.updateBreakOutRoomEnded?.(false);
    return { ok: true, error: '' };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'The breakout rooms could not be updated.' };
  }
}

export interface AssignParticipantToBreakoutRoomOptions extends HeadlessOptions {
  /** Participant display name. */
  name: string;
  /** Destination room index, or `null` to remove them from breakout rooms. */
  room: number | null;
  newParticipantAction?: string;
}

export type AssignParticipantToBreakoutRoomType = (
  options: AssignParticipantToBreakoutRoomOptions
) => Promise<{ ok: boolean; error: string }>;

/**
 * Add, move, or remove one participant, without rebuilding the whole array.
 *
 * Covers all three cases the composition array makes awkward by hand:
 * `room: 1` adds them to room 1 (or moves them there from wherever they are),
 * `room: null` removes them from breakout rooms entirely. Empty trailing rooms
 * are preserved, because room numbers are positional and collapsing them would
 * silently renumber everyone else.
 *
 * @example
 * ```ts
 * await assignParticipantToBreakoutRoom({ parameters, name: 'Ada', room: 0 }); // add
 * await assignParticipantToBreakoutRoom({ parameters, name: 'Ada', room: 1 }); // move 0 -> 1
 * await assignParticipantToBreakoutRoom({ parameters, name: 'Ada', room: null }); // remove
 * ```
 */
export async function assignParticipantToBreakoutRoom({
  parameters,
  name,
  room,
  newParticipantAction,
}: AssignParticipantToBreakoutRoomOptions): Promise<{ ok: boolean; error: string }> {
  const source: HeadlessParameters = parameters || {};
  if (!name) return { ok: false, error: 'A participant name is required.' };

  const current: BreakoutParticipantRef[][] = Array.isArray(source.breakoutRooms)
    ? source.breakoutRooms.map((entry: any) => (Array.isArray(entry) ? [...entry] : []))
    : [];
  // Remove them from wherever they are, keeping room indices stable.
  const next = current.map((entry) => entry.filter((person: any) => person?.name !== name));

  if (room !== null && room !== undefined) {
    if (!Number.isInteger(room) || room < 0) {
      return { ok: false, error: 'The destination room must be a room index.' };
    }
    while (next.length <= room) next.push([]);
    next[room].push({ name, breakRoom: room });
  }
  return setBreakoutRooms({ parameters: source, rooms: next, newParticipantAction });
}

export type StopBreakoutRoomsType = (
  options: HeadlessOptions
) => Promise<{ ok: boolean; error: string }>;

/** Close every breakout room and return everyone to the main room. */
export async function stopBreakoutRooms({
  parameters,
}: HeadlessOptions): Promise<{ ok: boolean; error: string }> {
  try {
    const source: HeadlessParameters = parameters || {};
    const socket = source.socket;
    if (!socket || typeof socket.emit !== 'function' || !source.roomName) {
      return { ok: false, error: 'The room connection is not ready.' };
    }
    if (String(source.islevel) !== '2') {
      return { ok: false, error: 'Only the host can stop breakout rooms.' };
    }
    const response = await new Promise<any>((resolve) => {
      socket.emit('stopBreakout', { roomName: source.roomName }, resolve);
    });
    if (!response?.success) {
      return { ok: false, error: response?.reason || 'The breakout rooms could not be stopped.' };
    }
    source.updateBreakOutRoomStarted?.(false);
    source.updateBreakOutRoomEnded?.(true);
    return { ok: true, error: '' };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'The breakout rooms could not be stopped.' };
  }
}

export type ReapplyLocalPlaybackType = (
  options: HeadlessOptions
) => Promise<{ ok: boolean; error: string; affected: number }>;

/**
 * Re-assert every local playback choice.
 *
 * Call this whenever media changes — `onMediaChanged` is the natural place. The
 * SDK layout pass resumes consumers it believes should be visible, which would
 * otherwise silently undo "do not play this person to me" the moment the active
 * speaker changes. Without this the feature appears to work and then quietly
 * stops working, which is worse than not having it.
 *
 * A no-op when nothing is locally paused.
 */
export async function reapplyLocalPlayback({
  parameters,
}: HeadlessOptions): Promise<{ ok: boolean; error: string; affected: number }> {
  if (LOCALLY_PAUSED.size === 0) return { ok: true, error: '', affected: 0 };
  try {
    const source: HeadlessParameters = parameters || {};
    const transports = Array.isArray(source.consumerTransports) ? source.consumerTransports : [];
    let affected = 0;
    for (const entry of transports as any[]) {
      const consumer = entry?.consumer;
      const id = entry?.producerId || consumer?.producerId;
      if (!consumer || !LOCALLY_PAUSED.has(id)) continue;
      if (consumer.paused === true) continue;
      try {
        if (typeof consumer.pause === 'function') { await consumer.pause(); affected += 1; }
      } catch {
        // Re-assertion is best-effort; a closed consumer is not an error.
      }
    }
    return { ok: true, error: '', affected };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'Playback could not be re-applied.', affected: 0 };
  }
}

/** Producer ids currently muted for this viewer only. */
export function getLocallyPausedProducerIds(): string[] {
  return Array.from(LOCALLY_PAUSED);
}
