import { Transport, Producer, ProducerOptions } from "mediasoup-client/lib/types";
export interface ConnectSendTransportAudioParameters {
    audioProducer: Producer | null;
    producerTransport: Transport | null;
    updateAudioProducer: (producer: (Producer | null)) => void;
    updateProducerTransport: (transport: Transport | null) => void;
}
export interface ConnectSendTransportAudioOptions {
    audioParams: ProducerOptions;
    parameters: ConnectSendTransportAudioParameters;
}
export type ConnectSendTransportAudioType = (options: ConnectSendTransportAudioOptions) => Promise<void>;
/**
 * Connects the send transport for audio by producing audio data and updating the audio producer and producer transport objects.
 *
 * @param {ConnectSendTransportAudioOptions} options - The parameters for connecting the send transport.
 * @param {ProducerOptions} options.audioParams - The options for the audio producer.
 * @param {ConnectSendTransportAudioParameters} options.parameters - The parameters containing the audio producer, producer transport, and update functions.
 * @param {Producer} options.parameters.audioProducer - The current audio producer.
 * @param {Transport} options.parameters.producerTransport - The transport used to produce audio data.
 * @param {Function} options.parameters.updateAudioProducer - Function to update the audio producer.
 * @param {Function} options.parameters.updateProducerTransport - Function to update the producer transport.
 *
 * @returns {Promise<void>} A promise that resolves when the audio transport is successfully connected.
 *
 * @throws Will throw an error if the connection fails.
 *
 * @example
 * const options = {
 *   audioParams: {
 *     // producer options (e.g., codec, bitrate)
 *   },
 *   parameters: {
 *     audioProducer: null,
 *     producerTransport: transport,
 *     updateAudioProducer: (producer) => { console.log('updated')  },
 *     updateProducerTransport: (transport) => { console.log('updated')  },
 *   },
 * };
 *
 * connectSendTransportAudio(options)
 *   .then(() => {
 *     console.log('Audio transport connected successfully');
 *   })
 *   .catch((error) => {
 *     console.error('Error connecting audio transport:', error);
 *   });
 */
export declare const connectSendTransportAudio: ({ audioParams, parameters, }: {
    audioParams: ProducerOptions;
    parameters: ConnectSendTransportAudioParameters;
}) => Promise<void>;
//# sourceMappingURL=connectSendTransportAudio.d.ts.map