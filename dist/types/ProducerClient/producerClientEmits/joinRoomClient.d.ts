import { Socket } from "socket.io-client";
export interface JoinRoomClientOptions {
    socket: Socket;
    roomName: string;
    islevel: string;
    member: string;
    sec: string;
    apiUserName: string;
    consume?: boolean;
}
export type JoinRoomClientType = (params: JoinRoomClientOptions) => Promise<any>;
/**
 * Joins a room by emitting the `joinRoom` event to the server using the provided socket.
 *
 * @param {JoinRoomClientOptions} options - The options for joining the room.
 * @param {Socket} options.socket - The socket instance to use for communication.
 * @param {string} options.roomName - The name of the room to join.
 * @param {string} options.islevel - The level indicator for the room.
 * @param {string} options.member - The member identifier.
 * @param {string} options.sec - The security token or identifier.
 * @param {string} options.apiUserName - The API username for authentication.
 * @param {boolean} [options.consume=false] - Flag to determine which join function to use.
 * @returns {Promise<ResponseJoinRoom | Partial<ResponseJoinRoom>>} A promise that resolves with the data returned from the server.
 * @throws {Error} Throws an error if the room joining process fails.
 *
 * @example
 * ```typescript
 * const options = {
 *   socket: socketInstance,
 *   roomName: "room1",
 *   islevel: "2",
 *   member: "user123",
 *   sec: "secureToken",
 *   apiUserName: "apiUser",
 *   consume: true
 * };
 *
 * try {
 *   const response = await joinRoomClient(options);
 *   console.log("Joined room successfully:", response);
 * } catch (error) {
 *   console.error("Failed to join room:", error);
 * }
 * ```
 */
export declare const joinRoomClient: ({ socket, roomName, islevel, member, sec, apiUserName, consume, }: JoinRoomClientOptions) => Promise<any>;
//# sourceMappingURL=joinRoomClient.d.ts.map