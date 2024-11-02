import { ShowAlert } from "../../@types/types";
export interface DisconnectOptions {
    showAlert?: ShowAlert;
    redirectURL?: string;
    onWeb: boolean;
    updateValidated?: (isValidated: boolean) => void;
}
export type DisconnectType = (options: DisconnectOptions) => Promise<void>;
/**
 * Disconnects the user from the specified room and bans them.
 *
 * @param {DisconnectUserSelfOptions} options - The options for disconnecting the user.
 * @param {string} options.member - The username of the member to disconnect.
 * @param {string} options.roomName - The name of the room from which the user will be disconnected.
 * @param {Socket} options.socket - The socket instance used to emit the disconnection request.
 * @returns {Promise<void>} A promise that resolves when the disconnection request has been emitted.
 *
 * @example
 * ```typescript
 * await disconnectUserSelf({
 *   member: "user123",
 *   roomName: "main-room",
 *   socket: socketInstance,
 * });
 * ```
 */
export declare const disconnect: ({ showAlert, redirectURL, onWeb }: DisconnectOptions) => Promise<void>;
//# sourceMappingURL=disconnect.d.ts.map