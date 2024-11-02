import { Producer } from 'mediasoup-client/lib/types';
import { Socket } from 'socket.io-client';
import { ReorderStreamsType, ReorderStreamsParameters } from '../@types/types';
export interface DisconnectSendTransportVideoParameters extends ReorderStreamsParameters {
    videoProducer: Producer | null;
    socket: Socket;
    islevel: string;
    roomName: string;
    lock_screen: boolean;
    updateMainWindow: boolean;
    updateUpdateMainWindow: (state: boolean) => void;
    updateVideoProducer: (producer: Producer | null) => void;
    reorderStreams: ReorderStreamsType;
    [key: string]: any;
}
export interface DisconnectSendTransportVideoOptions {
    parameters: DisconnectSendTransportVideoParameters;
}
export type DisconnectSendTransportVideoType = (options: DisconnectSendTransportVideoOptions) => Promise<void>;
/**
 * Disconnects the send transport for video, closes the video producer, and updates the state.
 *
 * @param {DisconnectSendTransportVideoOptions} options - The options for disconnecting the send transport.
 * @param {Object} options.parameters - The parameters required for disconnection.
 * @param {Producer | null} options.parameters.videoProducer - The video producer to be closed.
 * @param {Socket} options.parameters.socket - The socket instance for communication.
 * @param {string} options.parameters.islevel - The participant's level.
 * @param {string} options.parameters.roomName - The name of the room.
 * @param {boolean} options.parameters.updateMainWindow - Flag to update the main window.
 * @param {boolean} options.parameters.lock_screen - Flag indicating if the screen is locked.
 * @param {Function} options.parameters.updateUpdateMainWindow - Function to update the main window state.
 * @param {Function} options.parameters.updateVideoProducer - Function to update the video producer state.
 * @param {Function} options.parameters.reorderStreams - Function to reorder streams.
 *
 * @returns {Promise<void>} A promise that resolves when the disconnection process is complete.
 *
 * @throws {Error} Throws an error if the disconnection process fails.
 *
 * @example
 * const options = {
 *   parameters: {
 *     videoProducer: videoProducerInstance,
 *     socket: socketInstance,
 *     islevel: '1',
 *     roomName: 'Room A',
 *     updateMainWindow: false,
 *     lock_screen: false,
 *     updateUpdateMainWindow: (state) => console.log('Main window updated:', state),
 *     updateVideoProducer: (producer) => console.log('Video producer updated:', producer),
 *     reorderStreams: reorderStreamsFunction,
 *   },
 * };
 *
 * disconnectSendTransportVideo(options)
 *   .then(() => {
 *     console.log('Video send transport disconnected successfully');
 *   })
 *   .catch((error) => {
 *     console.error('Error disconnecting video send transport:', error);
 *   });
 */
export declare const disconnectSendTransportVideo: ({ parameters }: DisconnectSendTransportVideoOptions) => Promise<void>;
//# sourceMappingURL=disconnectSendTransportVideo.d.ts.map