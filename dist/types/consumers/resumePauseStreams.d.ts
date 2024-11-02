import { Participant, Transport, Stream } from "../@types/types";
export interface ResumePauseStreamsParameters {
    participants: Participant[];
    dispActiveNames: string[];
    remoteScreenStream: Stream[];
    consumerTransports: Transport[];
    screenId?: string;
    islevel: string;
    getUpdatedAllParams: () => ResumePauseStreamsParameters;
    [key: string]: any;
}
export interface ResumePauseStreamsOptions {
    parameters: ResumePauseStreamsParameters;
}
export type ResumePauseStreamsType = (options: ResumePauseStreamsOptions) => Promise<void>;
/**
 * Resumes or pauses streams based on the provided parameters.
 *
 * @param {ResumePauseStreamsOptions} options - The options for resuming or pausing streams.
 * @param {Object} options.parameters - The parameters for the function.
 * @param {Array} options.parameters.participants - The list of participants.
 * @param {Array} options.parameters.dispActiveNames - The list of active display names.
 * @param {Array} options.parameters.consumerTransports - The list of consumer transports.
 * @param {string} [options.parameters.screenId] - The screen producer ID.
 * @param {string} options.parameters.islevel - The level of the user.
 *
 * @returns {Promise<void>} A promise that resolves when the streams have been resumed or paused.
 *
 * @throws Will throw an error if there is an issue during the process of resuming or pausing streams.
 *
 * @example
 * ```typescript
 * await resumePauseStreams({
 *   parameters: {
 *     participants: participantArray,
 *     dispActiveNames: ['user1', 'user2'],
 *     consumerTransports: transportArray,
 *     screenId: 'screen-123',
 *     islevel: '1',
 *   },
 * });
 * ```
 */
export declare function resumePauseStreams({ parameters, }: ResumePauseStreamsOptions): Promise<void>;
//# sourceMappingURL=resumePauseStreams.d.ts.map