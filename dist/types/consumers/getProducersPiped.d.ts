import { Socket } from "socket.io-client";
import { SignalNewConsumerTransportParameters, SignalNewConsumerTransportType } from "../@types/types";
export interface GetProducersPipedParameters extends SignalNewConsumerTransportParameters {
    member: string;
    signalNewConsumerTransport: SignalNewConsumerTransportType;
    [key: string]: any;
}
export interface GetProducersPipedOptions {
    nsock: Socket;
    islevel: string;
    parameters: GetProducersPipedParameters;
}
export type GetProducersPipedType = (options: GetProducersPipedOptions) => Promise<void>;
/**
 * Retrieves piped producers and signals new consumer transport for each retrieved producer.
 *
 * @param {Object} options - The options for getting piped producers.
 * @param {WebSocket} options.nsock - The WebSocket instance used for communication.
 * @param {boolean} options.islevel - A flag indicating the level of the operation.
 * @param {Object} options.parameters - Additional parameters for the operation.
 * @param {string} options.parameters.member - The member identifier.
 * @param {Function} options.parameters.signalNewConsumerTransport - The function to signal new consumer transport.
 *
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 *
 * @throws {Error} If an error occurs during the process of retrieving producers.
 */
export declare const getProducersPiped: ({ nsock, islevel, parameters, }: GetProducersPipedOptions) => Promise<void>;
//# sourceMappingURL=getProducersPiped.d.ts.map