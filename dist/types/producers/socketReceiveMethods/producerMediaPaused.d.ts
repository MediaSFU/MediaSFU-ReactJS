import { Participant, PrepopulateUserMediaType, ReorderStreamsType, ReUpdateInterParameters, ReUpdateInterType, ReorderStreamsParameters, PrepopulateUserMediaParameters } from "../../@types/types";
export interface ProducerMediaPausedParameters extends PrepopulateUserMediaParameters, ReorderStreamsParameters, ReUpdateInterParameters {
    activeSounds: string[];
    meetingDisplayType: string;
    meetingVideoOptimized: boolean;
    participants: Participant[];
    oldSoundIds: string[];
    shared: boolean;
    shareScreenStarted: boolean;
    updateMainWindow: boolean;
    hostLabel: string;
    islevel: string;
    updateActiveSounds: (activeSounds: string[]) => void;
    updateUpdateMainWindow: (updateMainWindow: boolean) => void;
    reorderStreams: ReorderStreamsType;
    prepopulateUserMedia: PrepopulateUserMediaType;
    reUpdateInter: ReUpdateInterType;
    getUpdatedAllParams: () => ProducerMediaPausedParameters;
    [key: string]: any;
}
export interface ProducerMediaPausedOptions {
    producerId: string;
    kind: 'audio' | 'video' | 'screenshare' | 'screen';
    name: string;
    parameters: ProducerMediaPausedParameters;
}
export type ProducerMediaPausedType = (options: ProducerMediaPausedOptions) => Promise<void>;
/**
 * Handles the event when media is paused for a producer.
 *
 * @param {ProducerMediaPausedOptions} options - The options for the producer media paused event.
 * @param {string} options.producerId - The ID of the producer.
 * @param {string} options.kind - The kind of media (e.g., "audio", "video").
 * @param {string} options.name - The name of the producer.
 * @param {Parameters} options.parameters - The parameters for the event.
 *
 * @returns {Promise<void>} A promise that resolves when the media paused handling is complete.
 *
 * @description
 * This function handles the event when media is paused for a producer. It performs the following tasks:
 * - Updates the parameters.
 * - Iterates through participants and updates the UI based on their muted status and other conditions.
 * - Handles meeting display type and optimizes the UI accordingly.
 * - Manages audio media by updating the relevant participant's state.
 */
export declare const producerMediaPaused: ({ producerId, kind, name, parameters, }: ProducerMediaPausedOptions) => Promise<void>;
//# sourceMappingURL=producerMediaPaused.d.ts.map