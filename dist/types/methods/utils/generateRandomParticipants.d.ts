import { Participant } from "../../@types/types";
export interface GenerateRandomParticipantsOptions {
    member: string;
    coHost?: string;
    host: string;
    forChatBroadcast?: boolean;
}
export type GenerateRandomParticipantsType = (options: GenerateRandomParticipantsOptions) => Participant[];
/**
 * Generates a list of random participants with specified options.
 *
 * @param {Object} options - The options for generating participants.
 * @param {string} options.member - The member to include in the participants list.
 * @param {string} [options.coHost=""] - The co-host to include in the participants list.
 * @param {string} options.host - The host to include in the participants list.
 * @param {boolean} [options.forChatBroadcast=false] - Whether the participants are for a chat broadcast.
 * @returns {Participant[]} An array of generated participants.
 *
 * @example
 * ```typescript
 * generateRandomParticipants({
 *   member: "Alice",
 *   coHost: "Bob",
 *   host: "Carol",
 *   forChatBroadcast: true,
 * });
 * // Returns an array of Participant objects, e.g., [{ name: "Alice", islevel: "1", muted: false, id: "0", audioID: "audio-0", videoID: "video-0" }, ...]
 * ```
 */
declare const generateRandomParticipants: ({ member, coHost, host, forChatBroadcast }: GenerateRandomParticipantsOptions) => Participant[];
export { generateRandomParticipants };
//# sourceMappingURL=generateRandomParticipants.d.ts.map