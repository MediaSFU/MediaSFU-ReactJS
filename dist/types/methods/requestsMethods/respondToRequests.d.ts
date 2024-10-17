import { Socket } from "socket.io-client";
import { Request } from "../../@types/types";
export interface RespondToRequestsOptions {
    socket: Socket;
    request: Request;
    updateRequestList: (newRequestList: Request[]) => void;
    requestList: Request[];
    action: string;
    roomName: string;
}
export type RespondToRequestsType = (options: RespondToRequestsOptions) => Promise<void>;
/**
 * Responds to incoming requests by updating the request list and emitting a response to the server.
 *
 * @param {Object} options - The options for responding to requests.
 * @param {Socket} options.socket - The socket instance used to emit the response.
 * @param {Request} options.request - The request object containing details of the request.
 * @param {Function} options.updateRequestList - The function to update the request list.
 * @param {Request[]} options.requestList - The current list of requests.
 * @param {string} options.action - The action to be taken on the request.
 * @param {string} options.roomName - The name of the room to which the response should be emitted.
 *
 * @returns {Promise<void>} A promise that resolves when the response has been emitted.
 */
export declare const respondToRequests: ({ socket, request, updateRequestList, requestList, action, roomName, }: RespondToRequestsOptions) => Promise<void>;
//# sourceMappingURL=respondToRequests.d.ts.map