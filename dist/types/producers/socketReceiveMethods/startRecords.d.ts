import { Socket } from "socket.io-client";
export interface StartRecordsOptions {
    roomName: string;
    member: string;
    socket: Socket;
}
export type StartRecordsType = (options: StartRecordsOptions) => Promise<void>;
/**
 * Starts recording for a specified room.
 *
 * @param {StartRecordsOptions} options - Configuration options to start the recording.
 * @param {string} options.roomName - The name of the room to record.
 * @param {string} options.member - The name of the member initiating the recording.
 * @param {Socket} options.socket - The socket instance to communicate with the server.
 *
 * @returns {Promise<void>} A promise that resolves when the attempt to start recording completes.
 *
 * @example
 * ```typescript
 * const options = {
 *   roomName: "RoomA",
 *   member: "AdminUser",
 *   socket: socketInstance,
 * };
 *
 * startRecords(options)
 *   .then(() => console.log("Recording started successfully"))
 *   .catch((error) => console.error("Failed to start recording", error));
 * ```
 */
export declare const startRecords: ({ roomName, member, socket }: StartRecordsOptions) => Promise<void>;
//# sourceMappingURL=startRecords.d.ts.map