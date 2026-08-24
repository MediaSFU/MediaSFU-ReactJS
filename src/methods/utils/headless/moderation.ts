import { Participant } from '../../../@types/types';
import { removeParticipants } from '../../participantsMethods/removeParticipants';
import { respondToWaiting } from '../../waitingMethods/respondToWaiting';
import { respondToRequests } from '../../requestsMethods/respondToRequests';
import { modifyCoHostSettings } from '../../coHostMethods/modifyCoHostSettings';
import { HeadlessOptions, HeadlessParameters } from './headlessTypes';
import { getCurrentParams } from './getCurrentParams';
import { HeadlessActionResult } from './roomActions';

/** The co-host responsibility keys MediaSFU recognises. */
export type ModerationArea = 'media' | 'participants' | 'chat' | 'waiting';

export interface ModerationPermissions {
  /** True when the local user is the host (islevel '2'). */
  isHost: boolean;
  /** True when the local user is the room's co-host. */
  isCoHost: boolean;
  /** Turn other participants' camera/mic/screen off. */
  canControlMedia: boolean;
  /** Remove or ban participants. */
  canManageParticipants: boolean;
  /** Moderate chat. */
  canManageChat: boolean;
  /** Admit or deny people in the waiting room. */
  canManageWaitingRoom: boolean;
}

export type GetModerationPermissionsType = (
  options: HeadlessOptions
) => ModerationPermissions;

function hasResponsibility(
  parameters: HeadlessParameters,
  area: ModerationArea
): boolean {
  const list = Array.isArray(parameters?.coHostResponsibility)
    ? parameters.coHostResponsibility
    : [];
  return list.find((item: any) => item?.name === area)?.value === true;
}

/**
 * What the local user is allowed to moderate.
 *
 * MediaSFU's rule is `islevel === '2' || (coHost === member && <area>.value)`,
 * and it is enforced *inside* each action — an unauthorised call is swallowed
 * with an alert rather than returning an error. That makes it very easy to ship
 * a moderation button that silently does nothing for co-hosts. Gate your UI on
 * this instead.
 *
 * @example
 * ```ts
 * import { getModerationPermissions } from 'mediasfu-reactjs';
 *
 * const perms = getModerationPermissions({ parameters });
 * <button disabled={!perms.canControlMedia}>Mute everyone</button>
 * ```
 */
export function getModerationPermissions({
  parameters,
}: HeadlessOptions): ModerationPermissions {
  const source = parameters || {};
  const isHost = String(source.islevel) === '2';
  const isCoHost = Boolean(source.coHost && source.coHost === source.member);
  const allow = (area: ModerationArea) =>
    isHost || (isCoHost && hasResponsibility(source, area));
  return {
    isHost,
    isCoHost,
    canControlMedia: allow('media'),
    canManageParticipants: allow('participants'),
    canManageChat: allow('chat'),
    canManageWaitingRoom: allow('waiting'),
  };
}

function participantList(parameters: HeadlessParameters): Participant[] {
  const source = parameters || {};
  const primary = Array.isArray(source.participants) ? source.participants : [];
  if (primary.length > 0) return primary;
  return Array.isArray(source.participantsAll) ? source.participantsAll : [];
}

function findParticipant(
  parameters: HeadlessParameters,
  { id, name }: { id?: string; name?: string }
): Participant | null {
  const participants = participantList(parameters);
  return (
    (id ? participants.find((part) => part.id === id) : undefined) ||
    (name ? participants.find((part) => part.name === name) : undefined) ||
    null
  );
}

export interface SetParticipantMediaOptions extends HeadlessOptions {
  /** Participant display name. */
  name?: string;
  /** Participant id. Takes precedence over `name`. */
  id?: string;
  /** Which media to switch off. */
  kind: 'audio' | 'video' | 'screenshare' | 'all';
}

export type SetParticipantMediaType = (
  options: SetParticipantMediaOptions
) => Promise<HeadlessActionResult>;

/**
 * Turn a participant's media off as host or authorised co-host.
 *
 * This is one-directional by design: MediaSFU lets a moderator *stop* someone's
 * camera, microphone or screen share, but cannot start it on their behalf — the
 * participant must re-enable it themselves.
 *
 * The SDK's own `controlMedia` consumer only emits for `type: 'audio'` and
 * `type: 'video'`; `'all'` and `'screenshare'` fall through its guard and do
 * nothing. This helper emits the `controlMedia` event directly with the same
 * permission and self-protection checks applied uniformly, so every kind works.
 * Hosts (`islevel === '2'`) cannot be muted by anyone, including other hosts.
 *
 * @example
 * ```ts
 * import { setParticipantMedia } from 'mediasfu-reactjs';
 *
 * await setParticipantMedia({ parameters, name: 'Paul', kind: 'video' });
 * await setParticipantMedia({ parameters, name: 'Paul', kind: 'all' });
 * ```
 */
export async function setParticipantMedia({
  parameters,
  name = '',
  id = '',
  kind,
}: SetParticipantMediaOptions): Promise<HeadlessActionResult> {
  try {
    const live = getCurrentParams({ parameters });
    const permissions = getModerationPermissions({ parameters: live });
    if (!permissions.canControlMedia) {
      return {
        ok: false,
        error: 'You are not allowed to control media for other participants.',
      };
    }
    const socket = live?.socket;
    if (!socket || typeof socket.emit !== 'function' || !live?.roomName) {
      return { ok: false, error: 'The room connection is not ready.' };
    }
    const participant = findParticipant(live, { id, name });
    if (!participant) return { ok: false, error: 'That participant is not in the room.' };
    if (String(participant.islevel) === '2') {
      return { ok: false, error: 'A host’s media cannot be turned off.' };
    }

    socket.emit('controlMedia', {
      participantId: participant.id,
      participantName: participant.name,
      type: kind,
      roomName: live.roomName,
    });
    return { ok: true, error: '' };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'The media control failed.' };
  }
}

export interface ModerateParticipantOptions extends HeadlessOptions {
  name?: string;
  id?: string;
}

/** Mute a participant's microphone. See {@link setParticipantMedia}. */
export function muteParticipant(
  options: ModerateParticipantOptions
): Promise<HeadlessActionResult> {
  return setParticipantMedia({ ...options, kind: 'audio' });
}

/** Turn a participant's camera off. See {@link setParticipantMedia}. */
export function disableParticipantVideo(
  options: ModerateParticipantOptions
): Promise<HeadlessActionResult> {
  return setParticipantMedia({ ...options, kind: 'video' });
}

/** Stop a participant's screen share. See {@link setParticipantMedia}. */
export function stopParticipantScreenShare(
  options: ModerateParticipantOptions
): Promise<HeadlessActionResult> {
  return setParticipantMedia({ ...options, kind: 'screenshare' });
}

export interface MuteEveryoneOptions extends HeadlessOptions {
  /** Which media to switch off for everyone. Defaults to `audio`. */
  kind?: 'audio' | 'video' | 'screenshare' | 'all';
}

export type MuteEveryoneType = (
  options: MuteEveryoneOptions
) => Promise<HeadlessActionResult>;

/**
 * Turn media off for every non-host participant.
 *
 * MediaSFU has no bulk primitive, so this fans out per participant. Hosts and
 * the local user are skipped. Succeeds if at least one participant was
 * actioned; reports the failure otherwise.
 */
export async function muteEveryone({
  parameters,
  kind = 'audio',
}: MuteEveryoneOptions): Promise<HeadlessActionResult> {
  const live = getCurrentParams({ parameters });
  const permissions = getModerationPermissions({ parameters: live });
  if (!permissions.canControlMedia) {
    return {
      ok: false,
      error: 'You are not allowed to control media for other participants.',
    };
  }
  const targets = participantList(live).filter(
    (part) => String(part.islevel) !== '2' && part.name !== live.member
  );
  if (targets.length === 0) return { ok: false, error: 'There is nobody else to mute.' };

  const results = await Promise.all(
    targets.map((part) =>
      setParticipantMedia({ parameters: live, id: part.id, name: part.name, kind })
    )
  );
  const failed = results.filter((result) => !result.ok);
  if (failed.length === results.length) {
    return { ok: false, error: failed[0]?.error || 'No participant could be muted.' };
  }
  return { ok: true, error: '' };
}

export type RemoveParticipantType = (
  options: ModerateParticipantOptions
) => Promise<HeadlessActionResult>;

/**
 * Remove a participant from the room.
 *
 * @example
 * ```ts
 * await removeParticipant({ parameters, name: 'Paul' });
 * ```
 */
export async function removeParticipant({
  parameters,
  name = '',
  id = '',
}: ModerateParticipantOptions): Promise<HeadlessActionResult> {
  try {
    const live = getCurrentParams({ parameters });
    const permissions = getModerationPermissions({ parameters: live });
    if (!permissions.canManageParticipants) {
      return { ok: false, error: 'You are not allowed to remove participants.' };
    }
    const participant = findParticipant(live, { id, name });
    if (!participant) return { ok: false, error: 'That participant is not in the room.' };
    if (String(participant.islevel) === '2') {
      return { ok: false, error: 'A host cannot be removed.' };
    }
    await removeParticipants({
      coHostResponsibility: live.coHostResponsibility || [],
      participant,
      member: live.member || '',
      islevel: live.islevel || '1',
      showAlert: live.showAlert,
      coHost: live.coHost || '',
      participants: participantList(live),
      socket: live.socket,
      roomName: live.roomName || '',
      updateParticipants: live.updateParticipants,
    });
    return { ok: true, error: '' };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'The participant could not be removed.' };
  }
}

export interface RespondToWaitingParticipantOptions extends HeadlessOptions {
  name?: string;
  id?: string;
  /** True to admit, false to deny. */
  admit: boolean;
}

export type RespondToWaitingParticipantType = (
  options: RespondToWaitingParticipantOptions
) => Promise<HeadlessActionResult>;

/**
 * Admit or deny somebody waiting to join.
 *
 * Reads `waitingRoomList` off the bag, so you only supply the person's name or
 * id and whether to let them in.
 *
 * @example
 * ```ts
 * for (const person of parameters.waitingRoomList ?? []) {
 *   await respondToWaitingParticipant({ parameters, id: person.id, admit: true });
 * }
 * ```
 */
export async function respondToWaitingParticipant({
  parameters,
  name = '',
  id = '',
  admit,
}: RespondToWaitingParticipantOptions): Promise<HeadlessActionResult> {
  try {
    const live = getCurrentParams({ parameters });
    const permissions = getModerationPermissions({ parameters: live });
    if (!permissions.canManageWaitingRoom) {
      return { ok: false, error: 'You are not allowed to manage the waiting room.' };
    }
    const waitingList = Array.isArray(live.waitingRoomList) ? live.waitingRoomList : [];
    const entry =
      (id ? waitingList.find((person: any) => person?.id === id) : undefined) ||
      (name ? waitingList.find((person: any) => person?.name === name) : undefined);
    if (!entry) return { ok: false, error: 'That person is no longer waiting to join.' };

    await respondToWaiting({
      participantId: entry.id,
      participantName: entry.name,
      updateWaitingList: live.updateWaitingRoomList,
      waitingList,
      type: admit,
      roomName: live.roomName || '',
      socket: live.socket,
    });
    return { ok: true, error: '' };
  } catch (error: any) {
    return {
      ok: false,
      error: error?.message || 'The waiting-room response failed.',
    };
  }
}

export interface RespondToParticipantRequestOptions extends HeadlessOptions {
  /** The request id from `parameters.requestList`. */
  requestId?: string;
  /** Or match by requester name. */
  name?: string;
  /** True to approve, false to reject. */
  approve: boolean;
}

export type RespondToParticipantRequestType = (
  options: RespondToParticipantRequestOptions
) => Promise<HeadlessActionResult>;

/**
 * Approve or reject a participant request (raise hand, ask to share, ask to
 * speak). Requests live on `parameters.requestList`; each carries an `icon`
 * naming the capability being asked for.
 */
export async function respondToParticipantRequest({
  parameters,
  requestId = '',
  name = '',
  approve,
}: RespondToParticipantRequestOptions): Promise<HeadlessActionResult> {
  try {
    const live = getCurrentParams({ parameters });
    const permissions = getModerationPermissions({ parameters: live });
    if (!permissions.canManageParticipants) {
      return { ok: false, error: 'You are not allowed to respond to requests.' };
    }
    const requestList = Array.isArray(live.requestList) ? live.requestList : [];
    const request =
      (requestId
        ? requestList.find((item: any) => item?.id === requestId)
        : undefined) ||
      (name
        ? requestList.find(
            (item: any) => item?.name === name || item?.username === name
          )
        : undefined);
    if (!request) return { ok: false, error: 'That request is no longer pending.' };

    await respondToRequests({
      socket: live.socket,
      request,
      updateRequestList: live.updateRequestList,
      requestList,
      action: approve ? 'accepted' : 'rejected',
      roomName: live.roomName || '',
    });
    return { ok: true, error: '' };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'The request response failed.' };
  }
}

export interface SetCoHostOptions extends HeadlessOptions {
  /** Participant to promote. Pass '' to clear the current co-host. */
  name: string;
  /** Areas the co-host may moderate. Defaults to media + participants. */
  areas?: ModerationArea[];
}

export type SetCoHostType = (
  options: SetCoHostOptions
) => Promise<HeadlessActionResult>;

/**
 * Promote a participant to co-host and choose what they may moderate.
 *
 * Only the host may do this. Areas not listed are explicitly disabled, so this
 * sets the complete responsibility set rather than merging with the previous one.
 *
 * @example
 * ```ts
 * await setCoHost({ parameters, name: 'Paul', areas: ['media', 'waiting'] });
 * ```
 */
export async function setCoHost({
  parameters,
  name,
  areas = ['media', 'participants'],
}: SetCoHostOptions): Promise<HeadlessActionResult> {
  try {
    const live = getCurrentParams({ parameters });
    if (String(live.islevel) !== '2') {
      return { ok: false, error: 'Only the host can assign a co-host.' };
    }
    const all: ModerationArea[] = ['media', 'participants', 'chat', 'waiting'];
    const responsibilities = all.map((area) => ({
      name: area,
      value: areas.includes(area),
      dedicated: false,
    }));

    await modifyCoHostSettings({
      roomName: live.roomName || '',
      showAlert: live.showAlert,
      selectedParticipant: name,
      coHost: live.coHost || '',
      coHostResponsibility: responsibilities,
      updateIsCoHostModalVisible:
        live.updateIsCoHostModalVisible || (() => undefined),
      updateCoHostResponsibility: live.updateCoHostResponsibility,
      updateCoHost: live.updateCoHost,
      socket: live.socket,
    });
    return { ok: true, error: '' };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'The co-host update failed.' };
  }
}
