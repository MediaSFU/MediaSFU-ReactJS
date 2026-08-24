import { Participant } from '../../../@types/types';
import { HeadlessOptions, HeadlessParameters } from './headlessTypes';

/** MediaSFU writes 'none' rather than an empty string when a producer is absent. */
function hasProducer(value: unknown): boolean {
  return (
    typeof value === 'string' &&
    value.length > 3 &&
    value.toLowerCase() !== 'none'
  );
}

function participantList(parameters: HeadlessParameters): Participant[] {
  const source = parameters || {};
  const primary = Array.isArray(source.participants) ? source.participants : [];
  if (primary.length > 0) return primary;
  return Array.isArray(source.participantsAll) ? source.participantsAll : [];
}

export interface ParticipantMediaState {
  participant: Participant | null;
  /** The participant's own display name, or '' when unresolved. */
  name: string;
  /** True when this row is the local user. */
  isSelf: boolean;
  /** True when the participant is a host (islevel '2'). */
  isHost: boolean;
  /** True when the participant is publishing a camera. */
  hasVideo: boolean;
  /** True when the participant is publishing a microphone. */
  hasAudio: boolean;
  /** True when the participant's microphone is muted. */
  muted: boolean;
  /** The camera producer id, or '' when not publishing. */
  videoProducerId: string;
  /** The microphone producer id, or '' when not publishing. */
  audioProducerId: string;
}

export interface GetParticipantMediaStateOptions extends HeadlessOptions {
  /** Match by display name. */
  name?: string;
  /** Match by participant id. Takes precedence over `name`. */
  id?: string;
}

export type GetParticipantMediaStateType = (
  options: GetParticipantMediaStateOptions
) => ParticipantMediaState;

/**
 * Whether a participant is publishing, and what to label them.
 *
 * "Is this person on camera?" is not `participant.muted` and not the presence of
 * a stream in your grid — it is whether `videoID` holds a real producer
 * reference. MediaSFU writes the string `'none'` rather than an empty value when
 * there is no producer, which is why a naive truthiness check reports everyone
 * as publishing.
 *
 * @example
 * ```ts
 * import { getParticipantMediaState } from 'mediasfu-reactjs';
 *
 * const paul = getParticipantMediaState({ parameters, name: 'Paul' });
 * if (paul.hasVideo) renderCamera(paul.videoProducerId);
 * ```
 */
export function getParticipantMediaState({
  parameters,
  name = '',
  id = '',
}: GetParticipantMediaStateOptions): ParticipantMediaState {
  const source = parameters || {};
  const participants = participantList(source);
  const participant =
    (id ? participants.find((part) => part.id === id) : undefined) ||
    (name ? participants.find((part) => part.name === name) : undefined) ||
    null;

  const videoProducerId = hasProducer(participant?.videoID)
    ? (participant!.videoID as string)
    : '';
  const audioProducerId = hasProducer(participant?.audioID)
    ? (participant!.audioID as string)
    : '';

  return {
    participant,
    name: participant?.name || '',
    isSelf: Boolean(participant?.name && participant.name === source.member),
    isHost: String(participant?.islevel) === '2',
    hasVideo: Boolean(videoProducerId),
    hasAudio: Boolean(audioProducerId),
    muted: participant?.muted === true,
    videoProducerId,
    audioProducerId,
  };
}

export type ListParticipantMediaStatesType = (
  options: HeadlessOptions
) => ParticipantMediaState[];

/** {@link getParticipantMediaState} for everyone currently in the room. */
export function listParticipantMediaStates({
  parameters,
}: HeadlessOptions): ParticipantMediaState[] {
  const source = parameters || {};
  return participantList(source).map((participant) =>
    getParticipantMediaState({
      parameters: source,
      id: participant.id,
      name: participant.name,
    })
  );
}

export interface ActiveSpeaker {
  /** Loudest participant's display name, or '' when the room is quiet. */
  name: string;
  /** That participant's average loudness. */
  level: number;
  participant: Participant | null;
}

export type GetActiveSpeakerType = (options: HeadlessOptions) => ActiveSpeaker;

/**
 * The loudest participant right now.
 *
 * Reads `audioDecibels`, which the SDK maintains per participant. MediaSFU's own
 * grids treat roughly 127.5 as the noise floor, so quieter rooms report no
 * active speaker rather than flickering between people.
 *
 * @example
 * ```ts
 * const speaker = getActiveSpeaker({ parameters });
 * if (speaker.name) highlight(speaker.name);
 * ```
 */
export function getActiveSpeaker({ parameters }: HeadlessOptions): ActiveSpeaker {
  const source = parameters || {};
  const decibels = Array.isArray(source.audioDecibels) ? source.audioDecibels : [];
  const participants = participantList(source);

  let best: { name: string; averageLoudness: number } | null = null;
  for (const entry of decibels) {
    if (!entry?.name || typeof entry.averageLoudness !== 'number') continue;
    if (entry.averageLoudness <= 127.5) continue;
    if (!best || entry.averageLoudness > best.averageLoudness) best = entry;
  }
  if (!best) return { name: '', level: 0, participant: null };

  return {
    name: best.name,
    level: best.averageLoudness,
    participant: participants.find((part) => part.name === best!.name) || null,
  };
}

export interface MediaDeviceList {
  cameras: MediaDeviceInfo[];
  microphones: MediaDeviceInfo[];
}

export type ListMediaDevicesType = (
  options: HeadlessOptions
) => Promise<MediaDeviceList>;

/**
 * Cameras and microphones available for a device picker.
 *
 * Uses the SDK's own `getMediaDevicesList` when the bag exposes it, so the
 * result reflects the same `mediaDevices` instance the SDK captures with;
 * otherwise falls back to `navigator.mediaDevices.enumerateDevices()`.
 *
 * Labels are blank until the user has granted permission once — call this after
 * the first successful capture if you need readable device names.
 *
 * @example
 * ```ts
 * const { cameras } = await listMediaDevices({ parameters });
 * await runMediaControl({
 *   parameters,
 *   control: 'switchVideo',
 *   extra: { videoPreference: cameras[1].deviceId },
 * });
 * ```
 */
export async function listMediaDevices({
  parameters,
}: HeadlessOptions): Promise<MediaDeviceList> {
  const source = parameters || {};
  try {
    if (typeof source.getMediaDevicesList === 'function') {
      const [cameras, microphones] = await Promise.all([
        source.getMediaDevicesList('videoinput'),
        source.getMediaDevicesList('audioinput'),
      ]);
      return {
        cameras: Array.isArray(cameras) ? cameras : [],
        microphones: Array.isArray(microphones) ? microphones : [],
      };
    }
    const devices = await navigator.mediaDevices.enumerateDevices();
    return {
      cameras: devices.filter((device) => device.kind === 'videoinput'),
      microphones: devices.filter((device) => device.kind === 'audioinput'),
    };
  } catch {
    return { cameras: [], microphones: [] };
  }
}

export interface SelectedDevices {
  /** Device id of the camera currently in use, or '' when none is selected. */
  cameraId: string;
  /** Device id of the microphone currently in use, or '' when none is selected. */
  microphoneId: string;
  /** Cameras the SDK has enumerated for this room. */
  cameras: MediaDeviceInfo[];
  /** Microphones the SDK has enumerated for this room. */
  microphones: MediaDeviceInfo[];
}

export type GetSelectedDevicesType = (options: HeadlessOptions) => SelectedDevices;

/**
 * Which camera and microphone the SDK is actually using, plus the device lists
 * it has already enumerated.
 *
 * Unlike {@link listMediaDevices} this is synchronous and needs no permission
 * prompt: it reads `userDefaultVideoInputDevice` / `userDefaultAudioInputDevice`
 * and the `videoInputs` / `audioInputs` the SDK populated during setup. Use it
 * to mark the current entry in a device picker; use `listMediaDevices` when you
 * need a freshly enumerated list.
 *
 * @example
 * ```tsx
 * const { cameras, cameraId } = getSelectedDevices({ parameters });
 * <select value={cameraId} onChange={(e) => room.controls.selectCamera(e.target.value)}>
 *   {cameras.map((d) => <option key={d.deviceId} value={d.deviceId}>{d.label}</option>)}
 * </select>
 * ```
 */
export function getSelectedDevices({ parameters }: HeadlessOptions): SelectedDevices {
  const source = parameters || {};
  return {
    cameraId: source.userDefaultVideoInputDevice || '',
    microphoneId: source.userDefaultAudioInputDevice || '',
    cameras: Array.isArray(source.videoInputs) ? source.videoInputs : [],
    microphones: Array.isArray(source.audioInputs) ? source.audioInputs : [],
  };
}
