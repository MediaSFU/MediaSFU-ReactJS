import { WaitingRoomParticipant } from "../../@types/types";
export type GenerateRandomWaitingRoomListType = () => WaitingRoomParticipant[];
/**
 * Generates a random list of participants for a waiting room.
 *
 * @returns An array of `WaitingRoomParticipant` objects, each with a random name and unique ID.
 *
 * @example
 * ```typescript
 * const waitingRoomList = generateRandomWaitingRoomList();
 * console.log(waitingRoomList);
 * // Output:
 * // [
 * //   { name: "Dimen", id: "0" },
 * //   { name: "Nore", id: "1" },
 * //   { name: "Ker", id: "2" },
 * //   { name: "Lor", id: "3" },
 * //   { name: "Mik", id: "4" }
 * // ]
 * ```
 */
declare const generateRandomWaitingRoomList: () => WaitingRoomParticipant[];
export { generateRandomWaitingRoomList };
//# sourceMappingURL=generateRandomWaitingRoomList.d.ts.map