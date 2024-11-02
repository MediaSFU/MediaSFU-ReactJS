import { Socket } from "socket.io-client";
import { Message } from "../@types/types";
export interface ReceiveRoomMessagesOptions {
    socket: Socket;
    roomName: string;
    updateMessages: (messages: Message[]) => void;
}
export type ReceiveRoomMessagesType = (options: ReceiveRoomMessagesOptions) => Promise<void>;
/**
 * Retrieves messages from a specified room and updates the message state.
 *
 * @param {ReceiveRoomMessagesOptions} options - The options for receiving room messages.
 * @param {Socket} options.socket - The socket instance used for communication.
 * @param {string} options.roomName - The name of the room from which to retrieve messages.
 * @param {Function} options.updateMessages - Function to update the state with retrieved messages.
 *
 * @returns {Promise<void>} A promise that resolves when the messages have been retrieved and updated.
 *
 * @throws Will log an error message if there is an issue retrieving the messages.
 *
 * @example
 * ```typescript
 * await receiveRoomMessages({
 *   socket: socketInstance,
 *   roomName: 'Room1',
 *   updateMessages: (messages) => console.log(messages),
 * });
 * ```
 */
export declare function receiveRoomMessages({ socket, roomName, updateMessages, }: ReceiveRoomMessagesOptions): Promise<void>;
//# sourceMappingURL=receiveRoomMessages.d.ts.map