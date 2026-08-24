import { Participant, Stream } from '../../../@types/types';

/**
 * The MediaSFU parameter bag.
 *
 * This is the object handed to `updateSourceParameters`. Every field on it is a
 * snapshot of an internal ref (`allVideoStreams.current`, `localStreamVideo.current`,
 * …) taken at publish time, and the SDK **reassigns** those refs rather than
 * mutating them — so a bag you hold onto goes stale as soon as a producer or
 * consumer changes. Always read from the most recent publication.
 */
export interface HeadlessParameters {
  // Room identity / readiness
  roomName?: string;
  member?: string;
  islevel?: string;
  validated?: boolean;
  socket?: any;
  localSocket?: any;
  device?: { loaded?: boolean; [key: string]: any };

  // Participants
  participants?: Participant[];
  participantsAll?: Participant[];

  // Media collections
  allVideoStreams?: (Participant | Stream)[];
  allAudioStreams?: (Participant | Stream)[];
  oldAllStreams?: (Participant | Stream)[];
  audioOnlyStreams?: any[];
  translationStreams?: any[];

  // Local media
  localStream?: MediaStream | null;
  localStreamVideo?: MediaStream | null;
  localStreamAudio?: MediaStream | null;
  localStreamScreen?: MediaStream | null;
  virtualStream?: MediaStream | null;
  keepBackground?: boolean;
  audioAlreadyOn?: boolean;
  videoAlreadyOn?: boolean;

  // Screen share
  remoteScreenStream?: (Participant | Stream)[] | { stream?: MediaStream } | null;
  shareScreenStarted?: boolean;
  shared?: boolean;

  // Chat
  messages?: any[];
  coHost?: string;
  coHostResponsibility?: any[];
  chatSetting?: string;
  showAlert?: (options: any) => void;

  // Audio activity
  audioLevel?: number;
  audioDecibels?: { name: string; averageLoudness: number }[];

  // SDK function map
  /** Republishes as a side effect — prefer `getCurrentParams`. */
  getUpdatedAllParams?: () => any;
  /** Pure read of the current bag. No republish. */
  getCurrentParams?: () => any;
  getParticipantMedia?: (...args: any[]) => Promise<MediaStream | null>;
  getMediaDevicesList?: (
    kind: 'videoinput' | 'audioinput'
  ) => Promise<MediaDeviceInfo[]>;
  updateAutoWave?: (value: boolean) => void;

  /**
   * Server-provided playback URLs, when the room has them provisioned.
   *
   * Unlike WebRTC media these are never consumed automatically — see
   * getPlaybackSources/attachPlayback. Absence means the room has no HLS or
   * WHEP egress, not an error.
   */
  hlsUrl?: string;
  hlsPlaybackUrl?: string;
  playbackUrl?: string;
  whepUrl?: string;
  whepPlaybackUrl?: string;
  [key: string]: any;
}

export interface HeadlessOptions {
  /** The most recent parameter bag from `updateSourceParameters`. */
  parameters: HeadlessParameters;
}

/** A resolved media entry with the producer reference that identifies it. */
export interface ResolvedMedia {
  stream: MediaStream;
  producerId: string;
  /** Participant display name when the SDK exposes one for this producer. */
  name: string;
}

export interface RoomReadiness {
  ready: boolean;
  /** Empty when ready; otherwise a short, user-safe explanation. */
  reason: string;
}
