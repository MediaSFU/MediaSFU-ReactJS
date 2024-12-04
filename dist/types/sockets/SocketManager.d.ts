import { MeetingRoomParams, RecordingParams } from "../@types/types";
import { Socket } from "socket.io-client";
export interface ResponseLocalConnection {
    socket?: Socket;
    data?: ResponseLocalConnectionData;
}
export interface ResponseLocalConnectionData {
    socketId: string;
    mode: string;
    apiUserName?: string;
    apiKey?: string;
    allowRecord: boolean;
    meetingRoomParams_: MeetingRoomParams;
    recordingParams_: RecordingParams;
}
export interface ConnectLocalSocketOptions {
    link: string;
}
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
export type ConnectLocalSocketType = (options: ConnectLocalSocketOptions) => Promise<ResponseLocalConnection>;
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
 * @example
 * ```typescript
 * const options = {
 *   apiUserName: "user123",
 *   apiKey: "yourApiKeyHere",
 *   link: "https://socketlink.com",
 * };
 *
 * try {
 *   const socket = await connectSocket(options);
 *   console.log("Connected to socket:", socket);
 * } catch (error) {
 *   console.error("Failed to connect to socket:", error);
 * }
 * ```
 */
declare function connectSocket({ apiUserName, apiKey, apiToken, link }: ConnectSocketOptions): Promise<Socket>;
/**
 * Connects to a local media socket using the provided connection options.
 *
 * @param {ConnectLocalSocketOptions} options - The connection options.
 * @param {string} options.link - The socket link.
 *
 * @returns {Promise<ResponseLocalConnection>} A promise that resolves to the connected socket and data.
 *
 * @example
 * ```typescript
 * const options = {
 *   link: "http://localhost:3000",
 * };
 *
 * try {
 *   const { socket, data } = await connectLocalSocket(options);
 *   console.log("Connected to socket:", socket, data);
 * } catch (error) {
 *   console.error("Failed to connect to socket:", error);
 * }
 * ```
 */
declare function connectLocalSocket({ link }: ConnectLocalSocketOptions): Promise<ResponseLocalConnection>;
/**
 * Disconnects from the socket.
 *
 * @param {Socket} socket - The socket instance to disconnect.
 * @returns {Promise<boolean>} - A promise that resolves once the socket is disconnected.
 *
 * @example
 * ```typescript
 * const options = { socket: socketInstance };
 *
 * try {
 *   const isDisconnected = await disconnectSocket(options);
 *   console.log("Disconnected:", isDisconnected);
 * } catch (error) {
 *   console.error("Failed to disconnect:", error);
 * }
 * ```
 */
declare function disconnectSocket({ socket }: DisconnectSocketOptions): Promise<boolean>;
export { connectSocket, disconnectSocket, connectLocalSocket };
//# sourceMappingURL=SocketManager.d.ts.map