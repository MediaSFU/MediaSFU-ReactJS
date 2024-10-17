import { Request, WaitingRoomParticipant } from "../../@types/types";
export interface ParticipantRequestedOptions {
    userRequest: Request;
    requestList: Request[];
    waitingRoomList: WaitingRoomParticipant[];
    updateTotalReqWait: (count: number) => void;
    updateRequestList: (list: Request[]) => void;
}
export type ParticipantRequestedType = (options: ParticipantRequestedOptions) => Promise<void>;
/**
 * Handles a participant's request by adding it to the request list and updating the total count of requests and waiting room participants.
 *
 * @param {ParticipantRequestedOptions} options - The options for handling the participant's request.
 * @param {UserRequest} options.userRequest - The user request to be added to the request list.
 * @param {UserRequest[]} options.requestList - The current list of user requests.
 * @param {UserRequest[]} options.waitingRoomList - The current list of participants in the waiting room.
 * @param {Function} options.updateTotalReqWait - Function to update the total count of requests and waiting room participants.
 * @param {Function} options.updateRequestList - Function to update the request list.
 * @returns {Promise<void>} A promise that resolves when the participant's request has been handled.
 */
export declare const participantRequested: ({ userRequest, requestList, waitingRoomList, updateTotalReqWait, updateRequestList, }: ParticipantRequestedOptions) => Promise<void>;
//# sourceMappingURL=participantRequested.d.ts.map