import { WaitingRoomParticipant } from "../../@types/types";
export type GenerateRandomWaitingRoomListType = () => WaitingRoomParticipant[];
/**
 * Generates a random list of participants for a waiting room.
 *
 * @param options - Configuration options for generating the waiting room list.
 * @returns An array of `WaitingRoomParticipant` objects, each with a random name, mute status, and unique ID.
 *
 * @example
 * const options = {};
 * const waitingRoomList = generateRandomWaitingRoomList(options);
 * console.log(waitingRoomList);
 */
declare const generateRandomWaitingRoomList: () => WaitingRoomParticipant[];
export { generateRandomWaitingRoomList };
//# sourceMappingURL=generateRandomWaitingRoomList.d.ts.map