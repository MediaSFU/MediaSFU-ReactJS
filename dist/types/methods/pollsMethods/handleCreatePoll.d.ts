import { Socket } from "socket.io-client";
import { ShowAlert } from "../../@types/types";
interface NewPoll {
    question: string;
    type: string;
    options: string[];
}
export interface HandleCreatePollOptions {
    poll: NewPoll;
    socket: Socket;
    roomName: string;
    showAlert?: ShowAlert;
    updateIsPollModalVisible: (visible: boolean) => void;
}
export type HandleCreatePollType = (options: HandleCreatePollOptions) => Promise<void>;
/**
 * Handles the creation of a poll.
 *
 * @param {Object} options - The options for creating the poll.
 * @param {Poll} options.poll - The poll object containing the poll details.
 * @param {Object} options.parameters - Additional parameters for creating the poll.
 * @returns {Promise<void>} - A promise that resolves when the poll is created successfully.
 */
export declare const handleCreatePoll: ({ poll, socket, roomName, showAlert, updateIsPollModalVisible, }: HandleCreatePollOptions) => Promise<void>;
export {};
//# sourceMappingURL=handleCreatePoll.d.ts.map