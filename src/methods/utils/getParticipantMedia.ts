import { Participant, Stream } from '../../@types/types';

export interface GetParticipantMediaOptions {
  /**
   * A participant id, or a producer id when the caller already holds one.
   */
  id?: string;
  /** A participant display name. Used when `id` resolves nothing. */
  name?: string;
  /** Which media to resolve. Defaults to `video`. */
  kind?: 'video' | 'audio';
  /**
   * The MediaSFU parameter bag — the object handed to `updateSourceParameters`,
   * or anything exposing `participants`, `allVideoStreams` and `allAudioStreams`.
   */
  parameters: {
    participants?: Participant[];
    allVideoStreams?: (Participant | Stream)[];
    allAudioStreams?: (Participant | Stream)[];
    getCurrentParams?: () => any;
    getUpdatedAllParams?: () => any;
    [key: string]: any;
  };
}

export type GetParticipantMediaType = (
  options: GetParticipantMediaOptions
) => Promise<MediaStream | null>;

/**
 * Resolve a participant's live MediaStream from a MediaSFU parameter bag.
 *
 * This is the SDK-level counterpart of the `getParticipantMedia` helper that
 * MediaSFU components publish through `sourceParameters`. That helper remains
 * available for backwards compatibility; prefer this export when you drive the
 * SDK headlessly (`returnUI={false}`) and only hold the parameter bag.
 *
 * Resolution order:
 *  1. `parameters.participants` matched by `id`, then by `name`.
 *  2. The matched participant's `videoID` / `audioID`, looked up against
 *     `allVideoStreams` / `allAudioStreams` by `producerId`. These collections
 *     are keyed by producer id only — a participant's `id` is its membership id
 *     and never matches, which is why an id-keyed lookup silently returns null.
 *  3. `id` treated directly as a producer id, for callers that already hold one.
 *
 * @example
 * ```ts
 * import { getParticipantMedia } from 'mediasfu-reactjs';
 *
 * const stream = await getParticipantMedia({
 *   name: 'Paul',
 *   kind: 'video',
 *   parameters: sourceParameters.current,
 * });
 * if (stream) videoElement.srcObject = stream;
 * ```
 */
export async function getParticipantMedia({
  id = '',
  name = '',
  kind = 'video',
  parameters,
}: GetParticipantMediaOptions): Promise<MediaStream | null> {
  try {
    if (!parameters) return null;
    // Prefer the freshest bag when the caller holds an older snapshot.
    const live =
      typeof parameters.getCurrentParams === 'function'
        ? parameters.getCurrentParams() || parameters
        : parameters;

    const participants: Participant[] = Array.isArray(live.participants)
      ? live.participants
      : [];
    const streams: (Participant | Stream)[] = Array.isArray(
      kind === 'video' ? live.allVideoStreams : live.allAudioStreams
    )
      ? kind === 'video'
        ? live.allVideoStreams
        : live.allAudioStreams
      : [];
    if (streams.length === 0) return null;

    let participant = id
      ? participants.find((part) => part.id === id)
      : undefined;
    if (!participant && name) {
      participant = participants.find((part) => part.name === name);
    }

    const producerId = participant
      ? kind === 'video'
        ? participant.videoID
        : participant.audioID
      : '';
    if (producerId) {
      const match = streams.find((stream) => stream.producerId === producerId);
      if (match && match.stream) return match.stream;
    }

    if (id) {
      const direct = streams.find((stream) => stream.producerId === id);
      if (direct && direct.stream) return direct.stream;
    }

    return null;
  } catch {
    return null;
  }
}

export default getParticipantMedia;
