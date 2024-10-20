/**
 * Joins a consumption room by sending a request to the server and handles the necessary setup.
 * @function
 * @async
 * @param {Object} params - The parameters object containing necessary variables.
 * @param {string} params.remote_sock - The remote socket information.
 * @param {string} params.apiToken - The API token for authentication.
 * @param {string} params.apiUserName - The API username for authentication.
 * @param {Object} params.parameters - Additional parameters required for the function.
 * @param {string} params.roomName - The name of the room to join.
 * @param {string} params.islevel - The level of the participant.
 * @param {Object} params.member - Information about the participant.
 * @param {Object} params.device - The media device used by the participant.
 * @param {Object} params.mediasoupClient - The mediasoup client object.
 * @param {Object} params.rtpCapabilities - The RTP capabilities.
 * @param {function} params.receiveAllPipedTransports - Function to receive all piped transports.
 * @param {function} params.createDeviceClient - Function to create a device client.
 * @param {function} params.joinConRoom - Function to join a consumption room.
 * @returns {Object} - An object containing data related to the success of joining the room.
 * @throws {Error} Throws an error if there is an issue joining the room or setting up the necessary components.
 */
import { Device, RtpCapabilities } from 'mediasoup-client/lib/types';
import { Socket } from 'socket.io-client';
import { ReceiveAllPipedTransportsParameters, ReceiveAllPipedTransportsType, CreateDeviceClientType } from '../../@types/types';
export interface JoinConsumeRoomParameters extends ReceiveAllPipedTransportsParameters {
    roomName: string;
    islevel: string;
    member: string;
    device: Device | null;
    updateDevice: (device: Device | null) => void;
    receiveAllPipedTransports: ReceiveAllPipedTransportsType;
    createDeviceClient: CreateDeviceClientType;
    getUpdatedAllParams: () => JoinConsumeRoomParameters;
    [key: string]: any;
}
export interface JoinConsumeRoomOptions {
    remote_sock: Socket;
    apiToken: string;
    apiUserName: string;
    parameters: JoinConsumeRoomParameters;
}
interface JoinConsumeRoomResponse {
    success: boolean;
    rtpCapabilities?: RtpCapabilities | null;
}
export type JoinConsumeRoomType = (options: JoinConsumeRoomOptions) => Promise<JoinConsumeRoomResponse>;
export declare const joinConsumeRoom: ({ remote_sock, apiToken, apiUserName, parameters, }: JoinConsumeRoomOptions) => Promise<JoinConsumeRoomResponse>;
export {};
//# sourceMappingURL=joinConsumeRoom.d.ts.map