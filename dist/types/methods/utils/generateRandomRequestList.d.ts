import { Request, Participant } from "../../@types/types";
export interface GenerateRandomRequestListOptions {
    participants: Participant[];
    hostName: string;
    coHostName?: string;
    numberOfRequests: number;
}
export type GenerateRandomRequestListType = (options: GenerateRandomRequestListOptions) => Request[];
/**
 * Generates a list of random requests for participants, excluding the host and co-host.
 *
 * @param {GenerateRandomRequestListOptions} options - The options for generating the request list.
 * @param {Participant[]} options.participants - The list of participants.
 * @param {string} options.hostName - The name of the host.
 * @param {string} options.coHostName - The name of the co-host.
 * @param {number} options.numberOfRequests - The number of requests to generate for each participant.
 * @returns {Request[]} The generated list of requests.
 *
 * @example
 * ```typescript
 * generateRandomRequestList({
 *   participants: [
 *     { id: "1", name: "Alice" },
 *     { id: "2", name: "Bob" },
 *     { id: "3", name: "Charlie" },
 *   ],
 *   hostName: "Alice",
 *   coHostName: "Bob",
 *   numberOfRequests: 2,
 * });
 * // Returns [
 * //   { id: "3", name: "charlie", icon: "fa-video", username: "charlie" },
 * //   { id: "3", name: "charlie", icon: "fa-microphone", username: "charlie" }
 * // ]
 * ```
 */
declare const generateRandomRequestList: ({ participants, hostName, coHostName, numberOfRequests }: GenerateRandomRequestListOptions) => Request[];
export { generateRandomRequestList };
//# sourceMappingURL=generateRandomRequestList.d.ts.map