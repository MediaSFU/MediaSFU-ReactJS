import { Stream, Participant, Transport, SleepType } from "../@types/types";
export interface ProcessConsumerTransportsParameters {
    remoteScreenStream: Stream[];
    oldAllStreams: (Stream | Participant)[];
    newLimitedStreams: (Stream | Participant)[];
    sleep: SleepType;
    getUpdatedAllParams: () => ProcessConsumerTransportsParameters;
    [key: string]: any;
}
export interface ProcessConsumerTransportsOptions {
    consumerTransports: Transport[];
    lStreams_: (Stream | Participant)[];
    parameters: ProcessConsumerTransportsParameters;
}
export type ProcessConsumerTransportsType = (options: ProcessConsumerTransportsOptions) => Promise<void>;
/**
 * Processes consumer transports by pausing and resuming them based on certain conditions.
 *
 * @param {Object} options - The options for processing consumer transports.
 * @param {Array} options.consumerTransports - The list of consumer transports to process.
 * @param {Array} options.lStreams_ - The list of local streams.
 * @param {Object} options.parameters - The parameters object containing various stream arrays and utility functions.
 *
 * @returns {Promise<void>} - A promise that resolves when the processing is complete.
 *
 * @throws {Error} - Throws an error if there is an issue processing consumer transports.
 *
 * The function performs the following steps:
 * 1. Destructures and updates the parameters.
 * 2. Defines a helper function to check if a producerId is valid in given stream arrays.
 * 3. Filters consumer transports to resume based on certain conditions.
 * 4. Filters consumer transports to pause based on certain conditions.
 * 5. Pauses consumer transports after a short delay.
 * 6. Emits `consumer-pause` event for each filtered transport (not audio).
 * 7. Emits `consumer-resume` event for each filtered transport (not audio).
 */
export declare function processConsumerTransports({ consumerTransports, lStreams_, parameters, }: ProcessConsumerTransportsOptions): Promise<void>;
//# sourceMappingURL=processConsumerTransports.d.ts.map