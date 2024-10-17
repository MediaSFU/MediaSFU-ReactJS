import { Socket } from "socket.io-client";
export interface DisconnectUserSelfOptions {
    member: string;
    roomName: string;
    socket: Socket;
}
export type DisconnectUserSelfType = (options: DisconnectUserSelfOptions) => Promise<void>;
/**
 * Disconnects the user from the specified room and bans them.
 *
 * @param {DisconnectUserSelfOptions} options - The options for disconnecting the user.
 * @param {Object} options.member - The member object representing the user to disconnect.
 * @param {string} options.roomName - The name of the room from which the user will be disconnected.
 * @param {Socket} options.socket - The socket instance used to emit the disconnection request.
 * @returns {Promise<void>} A promise that resolves when the disconnection request has been emitted.
 */
export declare function disconnectUserSelf({ member, roomName, socket }: DisconnectUserSelfOptions): Promise<void>;
//# sourceMappingURL=disconnectUserSelf.d.ts.map