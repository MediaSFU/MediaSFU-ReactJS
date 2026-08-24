import { HeadlessOptions, HeadlessParameters } from './headlessTypes';

export interface MediaPermission {
  /** True when turning this media ON would be accepted right now. */
  allowed: boolean;
  /** Empty when allowed; otherwise the reason, phrased for a user. */
  reason: string;
  /**
   * True when enabling is possible but needs the host to approve first
   * (`audioSetting`/`videoSetting` of 'approval'). The control still works —
   * it raises a request rather than turning media on immediately.
   */
  needsApproval: boolean;
}

export interface MediaPermissions {
  microphone: MediaPermission;
  camera: MediaPermission;
  screenShare: MediaPermission;
  /** True when the local user is a host (islevel '2') and bypasses most gates. */
  isHost: boolean;
  /** True when focus mode is on and the local user is not a panelist. */
  focusModeBlocked: boolean;
}

export type GetMediaPermissionsType = (
  options: HeadlessOptions
) => MediaPermissions;

function isPanelist(parameters: HeadlessParameters): boolean {
  const panelists = Array.isArray(parameters.panelists) ? parameters.panelists : [];
  return panelists.some((entry: any) => entry?.name === parameters.member);
}

/**
 * Can this user turn their mic, camera or screen share on *right now*?
 *
 * MediaSFU decides this inside `clickAudio` / `clickVideo` / `clickScreenShare`,
 * which return `void` and report a refusal only through `showAlert`. That means
 * a headless surface finds out a control was blocked *after* the user pressed
 * it — the button looks broken. This evaluates the same gates up front so you
 * can disable the control and say why instead.
 *
 * The branches mirror the SDK's own order: audio-only rooms, host recording
 * locks, `adminRestrictSetting`, focus-mode panelist restrictions, and the
 * `allow` / `approval` / `disallow` settings. Host (`islevel === '2'`) bypasses
 * the participant-level gates, exactly as the controls do.
 *
 * Note this cannot predict two cases: room capacity checks, which the SDK
 * resolves by asking the server (`checkProduce`), and OS-level device
 * permission, which only surfaces when capture is attempted. Treat a `false`
 * here as authoritative and a `true` as "nothing known blocks it".
 *
 * @example
 * ```tsx
 * const perms = getMediaPermissions({ parameters });
 * <button disabled={!perms.microphone.allowed} title={perms.microphone.reason}>
 *   {perms.microphone.needsApproval ? 'Ask to unmute' : 'Unmute'}
 * </button>
 * ```
 */
export function getMediaPermissions({ parameters }: HeadlessOptions): MediaPermissions {
  const source: HeadlessParameters = parameters || {};
  const isHost = String(source.islevel) === '2';
  const recording = Boolean(source.recordStarted || source.recordResumed)
    && !(source.recordPaused || source.recordStopped);
  const focusModeBlocked = Boolean(source.panelistsFocused) && !isHost && !isPanelist(source);

  const evaluate = (
    kind: 'audio' | 'video' | 'screenshare'
  ): MediaPermission => {
    const allow = (): MediaPermission => ({ allowed: true, reason: '', needsApproval: false });
    const deny = (reason: string): MediaPermission => ({ allowed: false, reason, needsApproval: false });

    // An audio-only room refuses every visual producer outright.
    if (source.audioOnlyRoom && kind !== 'audio') {
      return deny('This is an audio-only event.');
    }
    // The host cannot drop media the recording depends on.
    if (isHost && recording) {
      if (kind === 'audio' && source.recordingMediaOptions === 'audio') {
        return deny('Pause or stop the recording before changing your microphone.');
      }
      if (kind === 'video' && source.recordingMediaOptions === 'video') {
        return deny('Pause or stop the recording before changing your camera.');
      }
    }
    if (isHost) return allow();

    if (source.adminRestrictSetting) {
      return deny('Access denied by the host.');
    }
    if (focusModeBlocked && kind === 'audio' && source.muteOthersMic) {
      return deny('Only panelists can unmute while focus mode is active.');
    }
    if (focusModeBlocked && kind === 'video' && source.muteOthersCamera) {
      return deny('Only panelists can enable video while focus mode is active.');
    }

    const setting = kind === 'audio'
      ? source.audioSetting
      : kind === 'video'
        ? source.videoSetting
        : source.screenshareSetting;
    if (setting === 'disallow') {
      return deny('The host has disabled this for participants.');
    }
    if (setting === 'approval') {
      // Not a refusal: the control raises a request to the host.
      return { allowed: true, reason: 'The host must approve this.', needsApproval: true };
    }
    return allow();
  };

  return {
    microphone: evaluate('audio'),
    camera: evaluate('video'),
    screenShare: evaluate('screenshare'),
    isHost,
    focusModeBlocked,
  };
}

export default getMediaPermissions;
