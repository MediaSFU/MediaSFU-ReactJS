import { Participant, Stream, ChangeVidsParameters, ChangeVidsType } from "../@types/types";
export interface ReorderStreamsParameters extends ChangeVidsParameters {
    allVideoStreams: (Stream | Participant)[];
    participants: Participant[];
    oldAllStreams: (Stream | Participant)[];
    screenId?: string;
    adminVidID?: string;
    newLimitedStreams: (Stream | Participant)[];
    newLimitedStreamsIDs: string[];
    activeSounds: string[];
    screenShareIDStream?: string;
    screenShareNameStream?: string;
    adminIDStream?: string;
    adminNameStream?: string;
    updateNewLimitedStreams: (streams: (Stream | Participant)[]) => void;
    updateNewLimitedStreamsIDs: (ids: string[]) => void;
    updateActiveSounds: (sounds: string[]) => void;
    updateScreenShareIDStream: (id: string) => void;
    updateScreenShareNameStream: (name: string) => void;
    updateAdminIDStream: (id: string) => void;
    updateAdminNameStream: (name: string) => void;
    updateYouYouStream: (streams: (Stream | Participant)[]) => void;
    changeVids: ChangeVidsType;
    getUpdatedAllParams: () => ReorderStreamsParameters;
    [key: string]: any;
}
export interface ReorderStreamsOptions {
    add?: boolean;
    screenChanged?: boolean;
    parameters: ReorderStreamsParameters;
}
export type ReorderStreamsType = (options: ReorderStreamsOptions) => Promise<void>;
/**
 * Reorders the video streams based on the provided options and updates the UI accordingly.
 *
 * @param {Object} options - The options for reordering streams.
 * @param {boolean} [options.add=false] - Whether to add new streams or not.
 * @param {boolean} [options.screenChanged=false] - Whether the screen has changed or not.
 * @param {ReorderStreamsOptions} options.parameters - The parameters required for reordering streams.
 *
 * @returns {Promise<void>} A promise that resolves when the reordering is complete.
 *
 * @typedef {Object} ReorderStreamsOptions
 * @property {Function} getUpdatedAllParams - Function to get updated parameters.
 * @property {Array} allVideoStreams - Array of all video streams.
 * @property {Array} participants - Array of participants.
 * @property {Array} oldAllStreams - Array of old streams.
 * @property {string} screenId - ID of the screen.
 * @property {string} adminVidID - ID of the admin video.
 * @property {Array} newLimitedStreams - Array of new limited streams.
 * @property {Array} newLimitedStreamsIDs - Array of new limited stream IDs.
 * @property {Array} activeSounds - Array of active sounds.
 * @property {string} screenShareIDStream - ID of the screen share stream.
 * @property {string} screenShareNameStream - Name of the screen share stream.
 * @property {string} adminIDStream - ID of the admin stream.
 * @property {string} adminNameStream - Name of the admin stream.
 * @property {Function} updateNewLimitedStreams - Function to update new limited streams.
 * @property {Function} updateNewLimitedStreamsIDs - Function to update new limited stream IDs.
 * @property {Function} updateActiveSounds - Function to update active sounds.
 * @property {Function} updateScreenShareIDStream - Function to update screen share ID stream.
 * @property {Function} updateScreenShareNameStream - Function to update screen share name stream.
 * @property {Function} updateAdminIDStream - Function to update admin ID stream.
 * @property {Function} updateAdminNameStream - Function to update admin name stream.
 * @property {Function} updateYouYouStream - Function to update YouYou stream.
 * @property {Function} changeVids - Function to reflect changes on the UI.
 */
export declare const reorderStreams: ({ add, screenChanged, parameters, }: ReorderStreamsOptions) => Promise<void>;
//# sourceMappingURL=reorderStreams.d.ts.map