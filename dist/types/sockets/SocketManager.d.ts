import { Socket } from "socket.io-client";
export interface ConnectSocketOptions {
    apiUserName: string;
    apiKey?: string;
    apiToken?: string;
    link: string;
}
export interface DisconnectSocketOptions {
    socket: Socket;
}
export type ConnectSocketType = (options: ConnectSocketOptions) => Promise<Socket>;
export type DisconnectSocketType = (options: DisconnectSocketOptions) => Promise<boolean>;
/**
 * Connects to a media socket using the provided connection options.
 *
 * @param {ConnectSocketOptions} options - The connection options.
 * @param {string} options.apiUserName - The API username.
 * @param {string} [options.apiKey] - The API key (optional if apiToken is provided).
 * @param {string} [options.apiToken] - The API token (optional if apiKey is provided).
 * @param {string} options.link - The socket link.
 *
 * @returns {Promise<Socket>} A promise that resolves to the connected socket.
 *
 * @throws {Error} If any of the required parameters are missing or invalid.
 * @throws {Error} If the API key or token is invalid.
 * @throws {Error} If there is an error connecting to the media socket.
 */
declare function connectSocket({ apiUserName, apiKey, apiToken, link }: ConnectSocketOptions): Promise<Socket>;
/**
 * Disconnects from the socket.
 * @param {Socket} socket - The socket instance to disconnect.
 * @returns {Promise<boolean>} - A promise that resolves once the socket is disconnected.
 */
declare function disconnectSocket({ socket }: DisconnectSocketOptions): Promise<boolean>;
export { connectSocket, disconnectSocket };
//# sourceMappingURL=SocketManager.d.ts.map