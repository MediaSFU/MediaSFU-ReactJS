import { Socket } from "socket.io-client";
import { SleepType, CreateSendTransportType, ConnectSendTransportScreenType, DisconnectSendTransportScreenType, StopShareScreenType, ReorderStreamsType, PrepopulateUserMediaType, RePortType, ShowAlert, CreateSendTransportParameters, ConnectSendTransportScreenParameters, DisconnectSendTransportScreenParameters, StopShareScreenParameters, ReorderStreamsParameters, PrepopulateUserMediaParameters, EventType } from "../@types/types";
export interface StreamSuccessScreenParameters extends CreateSendTransportParameters, ConnectSendTransportScreenParameters, DisconnectSendTransportScreenParameters, StopShareScreenParameters, ReorderStreamsParameters, PrepopulateUserMediaParameters {
    socket: Socket;
    transportCreated: boolean;
    localStreamScreen: MediaStream | null;
    screenAlreadyOn: boolean;
    screenAction: boolean;
    transportCreatedScreen: boolean;
    hostLabel: string;
    eventType: EventType;
    showAlert?: ShowAlert;
    annotateScreenStream: boolean;
    shared: boolean;
    updateTransportCreatedScreen: (transportCreatedScreen: boolean) => void;
    updateScreenAlreadyOn: (screenAlreadyOn: boolean) => void;
    updateScreenAction: (screenAction: boolean) => void;
    updateTransportCreated: (transportCreated: boolean) => void;
    updateLocalStreamScreen: (localStreamScreen: MediaStream | null) => void;
    updateShared: (shared: boolean) => void;
    updateIsScreenboardModalVisible: (isVisible: boolean) => void;
    sleep: SleepType;
    createSendTransport: CreateSendTransportType;
    connectSendTransportScreen: ConnectSendTransportScreenType;
    disconnectSendTransportScreen: DisconnectSendTransportScreenType;
    stopShareScreen: StopShareScreenType;
    reorderStreams: ReorderStreamsType;
    prepopulateUserMedia: PrepopulateUserMediaType;
    rePort: RePortType;
    getUpdatedAllParams: () => StreamSuccessScreenParameters;
    [key: string]: any;
}
export interface StreamSuccessScreenOptions {
    stream: MediaStream;
    parameters: StreamSuccessScreenParameters;
}
export type StreamSuccessScreenType = (options: StreamSuccessScreenOptions) => Promise<void>;
/**
 * Handles the successful initiation of screen sharing.
 *
 * @param {StreamSuccessScreenOptions} options - The options for the screen sharing success handler.
 * @param {MediaStream} options.stream - The media stream to be shared.
 * @param {Object} options.parameters - The parameters required for screen sharing.
 * @param {Function} options.parameters.getUpdatedAllParams - Function to get updated parameters.
 * @param {Socket} options.parameters.socket - The socket instance for communication.
 * @param {boolean} options.parameters.transportCreated - Flag indicating if the transport is already created.
 * @param {MediaStream} options.parameters.localStreamScreen - The local screen media stream.
 * @param {boolean} options.parameters.screenAlreadyOn - Flag indicating if the screen is already being shared.
 * @param {boolean} options.parameters.screenAction - Flag indicating if the screen share action is requested.
 * @param {boolean} options.parameters.transportCreatedScreen - Flag indicating if the screen transport is created.
 * @param {string} options.parameters.hostLabel - The label of the host.
 * @param {string} options.parameters.eventType - The type of the event (e.g., conference).
 * @param {Function} options.parameters.showAlert - Function to show alerts.
 * @param {boolean} options.parameters.annotateScreenStream - Flag indicating if screen annotation is enabled.
 * @param {Function} options.parameters.updateTransportCreatedScreen - Function to update the screen transport creation state.
 * @param {Function} options.parameters.updateScreenAlreadyOn - Function to update the screen sharing state.
 * @param {Function} options.parameters.updateScreenAction - Function to update the screen action state.
 * @param {Function} options.parameters.updateTransportCreated - Function to update the transport creation state.
 * @param {Function} options.parameters.updateLocalStreamScreen - Function to update the local screen stream.
 * @param {Function} options.parameters.updateShared - Function to update the shared state.
 * @param {Function} options.parameters.updateIsScreenboardModalVisible - Function to update the screenboard modal visibility.
 * @param {Function} options.parameters.sleep - Function to pause execution for a specified duration.
 * @param {Function} options.parameters.createSendTransport - Function to create a send transport.
 * @param {Function} options.parameters.connectSendTransportScreen - Function to connect the send transport for screen sharing.
 * @param {Function} options.parameters.disconnectSendTransportScreen - Function to disconnect the send transport for screen sharing.
 * @param {Function} options.parameters.stopShareScreen - Function to stop screen sharing.
 * @param {Function} options.parameters.reorderStreams - Function to reorder streams.
 * @param {Function} options.parameters.prepopulateUserMedia - Function to prepopulate user media.
 * @param {Function} options.parameters.rePort - Function to reinitialize ports.
 *
 * @returns {Promise<void>} A promise that resolves when the screen sharing setup is complete.
 */
export declare const streamSuccessScreen: ({ stream, parameters, }: StreamSuccessScreenOptions) => Promise<void>;
//# sourceMappingURL=streamSuccessScreen.d.ts.map