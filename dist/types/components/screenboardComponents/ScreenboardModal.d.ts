import React from "react";
import { Producer } from "mediasoup-client/lib/types";
import { ConnectSendTransportScreenType, CreateSendTransportType, DisconnectSendTransportScreenType, PrepopulateUserMediaType, StopShareScreenType, SleepType, ConnectSendTransportScreenParameters, CreateSendTransportParameters, DisconnectSendTransportScreenParameters, PrepopulateUserMediaParameters, StopShareScreenParameters } from "../../@types/types";
export interface ScreenboardModalParameters extends ConnectSendTransportScreenParameters, CreateSendTransportParameters, DisconnectSendTransportScreenParameters, PrepopulateUserMediaParameters, StopShareScreenParameters {
    localStreamScreen: MediaStream | null;
    shared: boolean;
    hostLabel: string;
    annotateScreenStream: boolean;
    processedScreenStream: MediaStream | null;
    mainScreenCanvas: HTMLCanvasElement | null;
    canvasScreenboard: HTMLCanvasElement | null;
    transportCreated: boolean;
    screenProducer: Producer | null;
    updateLocalStreamScreen: (stream: MediaStream | null) => void;
    updateProcessedScreenStream: (stream: MediaStream | null) => void;
    updateMainScreenCanvas: (canvas: HTMLCanvasElement | null) => void;
    sleep: SleepType;
    createSendTransport: CreateSendTransportType;
    disconnectSendTransportScreen: DisconnectSendTransportScreenType;
    connectSendTransportScreen: ConnectSendTransportScreenType;
    stopShareScreen: StopShareScreenType;
    prepopulateUserMedia: PrepopulateUserMediaType;
    getUpdatedAllParams: () => ScreenboardModalParameters;
    [key: string]: any;
}
export interface ScreenboardModalOptions {
    parameters: ScreenboardModalParameters;
    isVisible: boolean;
    onClose: () => void;
    position?: string;
    backgroundColor?: string;
}
export type ScreenboardModalType = (options: ScreenboardModalOptions) => React.JSX.Element;
/**
 * ScreenboardModal component provides a modal interface for screen annotation.
 * It handles the display and management of screen sharing and annotation streams.
 *
 * @param {ScreenboardModalOptions} props - The properties for the ScreenboardModal component.
 * @param {object} props.parameters - Various parameters required for screen annotation and streaming.
 * @param {boolean} props.isVisible - Determines if the modal is visible.
 * @param {function} props.onClose - Callback function to handle closing the modal.
 * @param {string} [props.position="topRight"] - Position of the modal on the screen.
 * @param {string} [props.backgroundColor="#83c0e9"] - Background color of the modal.
 *
 * @returns {React.JSX.Element} The ScreenboardModal component.
 *
 * @example
 * ```tsx
 * import { ScreenboardModal } from 'mediasfu-reactjs';
 *
 * // Define the parameters and functionality for screen sharing and annotation
 * const parameters = {
 *   localStreamScreen: new MediaStream(),
 *   shared: true,
 *   hostLabel: "Host Name",
 *   annotateScreenStream: true,
 *   processedScreenStream: null,
 *   mainScreenCanvas: null,
 *   canvasScreenboard: null,
 *   transportCreated: false,
 *   screenProducer: null,
 *   updateLocalStreamScreen: (stream) => console.log("Local Stream:", stream),
 *   updateProcessedScreenStream: (stream) => console.log("Processed Stream:", stream),
 *   updateMainScreenCanvas: (canvas) => console.log("Main Screen Canvas:", canvas),
 *   sleep: ({ ms }) => new Promise((resolve) => setTimeout(resolve, ms)),
 *   createSendTransport: async (options) => console.log("Create Transport:", options),
 *   disconnectSendTransportScreen: async (options) => console.log("Disconnect Transport:", options),
 *   connectSendTransportScreen: async (options) => console.log("Connect Transport:", options),
 *   stopShareScreen: async (options) => console.log("Stop Share Screen:", options),
 *   prepopulateUserMedia: async (options) => console.log("Prepopulate Media:", options),
 *   getUpdatedAllParams: () => ({
 *     filteredRequestList: [],
 *   }),
 * };
 *
 * const isVisible = true;
 * const handleClose = () => console.log("Modal closed");
 *
 * // Render the ScreenboardModal component
 * <ScreenboardModal
 *   parameters={parameters}
 *   isVisible={isVisible}
 *   onClose={handleClose}
 *   position="topRight"
 *   backgroundColor="#83c0e9"
 * />
 * ```
 */
declare const ScreenboardModal: React.FC<ScreenboardModalOptions>;
export default ScreenboardModal;
//# sourceMappingURL=ScreenboardModal.d.ts.map