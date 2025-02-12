import { Socket } from "socket.io-client";
export interface ConfirmExitOptions {
    socket: Socket;
    localSocket?: Socket;
    member: string;
    roomName: string;
    ban?: boolean;
}
export type ConfirmExitType = (options: ConfirmExitOptions) => Promise<void>;
/**
 * Confirms the exit of a member from a room and optionally bans them.
 *
 * @param {ConfirmExitOptions} options - The options for confirming the exit.
 * @param {Socket} options.socket - The socket instance to emit the event.
 * @param {Socket} [options.localSocket] - The local socket instance to emit the event.
 * @param {string} options.member - The member who is exiting.
 * @param {string} options.roomName - The name of the room the member is exiting from.
 * @param {boolean} [options.ban=false] - Whether to ban the member from the room.
 * @returns {Promise<void>} A promise that resolves when the exit is confirmed.
 *
 * @example
 * ```typescript
 * const options = {
 *   socket: socketInstance,
 *   localSocket: localSocketInstance,
 *   member: "JohnDoe",
 *   roomName: "Room123",
 *   ban: true,
 * };
 * await confirmExit(options);
 * ```
 */
export declare const confirmExit: ({ socket, localSocket, member, roomName, ban }: ConfirmExitOptions) => Promise<void>;
//# sourceMappingURL=confirmExit.d.ts.map