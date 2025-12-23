import { Socket } from "socket.io-client";
import { ConsumerResumeType, ConsumerResumeParameters, Transport as TransportType } from "../@types/types";
import { Device, Transport } from "mediasoup-client/lib/types";
interface SpeakerTranslationState {
    speakerId: string;
    speakerName: string;
    inputLanguage: string;
    outputLanguage: string;
    originalProducerId: string;
    enabled: boolean;
}
export interface ConnectRecvTransportParameters extends ConsumerResumeParameters {
    device: Device | null;
    consumerTransports: TransportType[];
    updateConsumerTransports: (transports: TransportType[]) => void;
    speakerTranslationStates?: Map<string, SpeakerTranslationState>;
    consumerResume: ConsumerResumeType;
    getUpdatedAllParams: () => ConnectRecvTransportParameters;
    [key: string]: any;
}
export interface ConnectRecvTransportOptions {
    consumerTransport: Transport;
    remoteProducerId: string;
    serverConsumerTransportId: string;
    nsock: Socket;
    parameters: ConnectRecvTransportParameters;
}
export type ConnectRecvTransportType = (options: ConnectRecvTransportOptions) => Promise<void>;
/**
 * Connects the receiving transport to consume media from a remote producer.
 *
 * @param {ConnectRecvTransportOptions} options - The options for connecting the receiving transport.
 * @param {Transport} options.consumerTransport - The transport used for consuming media.
 * @param {string} options.remoteProducerId - The ID of the remote producer.
 * @param {string} options.serverConsumerTransportId - The ID of the server consumer transport.
 * @param {Socket} options.nsock - The socket used for communication.
 * @param {ConnectRecvTransportParameters} options.parameters - The parameters for the connection.
 *
 * @returns {Promise<void>} A promise that resolves when the connection is established.
 *
 * @throws Will throw an error if the connection or consumption fails.
 *
 * @example
 * ```typescript
 * const options = {
 *   consumerTransport,
 *   remoteProducerId: 'producer-id',
 *   serverConsumerTransportId: 'transport-id',
 *   nsock: socket,
 *   parameters: connectRecvTransportOptions,
 * };
 *
 * connectRecvTransport(options)
 *   .then(() => {
 *     console.log('Transport connected and consuming media');
 *   })
 *   .catch((error) => {
 *     console.error('Error connecting transport:', error);
 *   });
 * ```
 */
export declare const connectRecvTransport: ({ consumerTransport, remoteProducerId, serverConsumerTransportId, nsock, parameters, }: ConnectRecvTransportOptions) => Promise<void>;
export {};
//# sourceMappingURL=connectRecvTransport.d.ts.map