import { Participant, ReorderStreamsType, ReorderStreamsParameters } from "../../@types/types";
export interface BanParticipantParameters extends ReorderStreamsParameters {
    activeNames: string[];
    dispActiveNames: string[];
    participants: Participant[];
    updateParticipants: (participants: Participant[]) => void;
    reorderStreams: ReorderStreamsType;
    [key: string]: any;
}
export interface BanParticipantOptions {
    name: string;
    parameters: BanParticipantParameters;
}
export type BanParticipantType = (options: BanParticipantOptions) => Promise<void>;
/**
 * Bans a participant from the session by removing them from the active and display names arrays,
 * updating the participants list, and reordering the streams.
 *
 * @param {BanParticipantOptions} options - The options for banning a participant.
 * @param {string} options.name - The name of the participant to be banned.
 * @param {Object} options.parameters - The parameters required for banning the participant.
 * @param {string[]} options.parameters.activeNames - The array of active participant names.
 * @param {string[]} options.parameters.dispActiveNames - The array of display participant names.
 * @param {Object[]} options.parameters.participants - The array of participant objects.
 * @param {Function} options.parameters.updateParticipants - The function to update the participants array.
 * @param {Function} options.parameters.reorderStreams - The function to reorder the streams.
 *
 * @returns {Promise<void>} A promise that resolves when the participant has been banned and streams reordered.
 *
 * @example
 * ```typescript
 * await banParticipant({
 *   name: "John Doe",
 *   parameters: {
 *     activeNames: ["Alice", "Bob", "John Doe"],
 *     dispActiveNames: ["Alice", "John Doe"],
 *     participants: [
 *       { name: "Alice", isActive: true },
 *       { name: "Bob", isActive: true },
 *       { name: "John Doe", isActive: true }
 *     ],
 *     updateParticipants: (updated) => setParticipants(updated),
 *     reorderStreams: reorderStreamFunction,
 *   },
 * });
 * ```
 */
export declare const banParticipant: ({ name, parameters, }: BanParticipantOptions) => Promise<void>;
//# sourceMappingURL=banParticipant.d.ts.map