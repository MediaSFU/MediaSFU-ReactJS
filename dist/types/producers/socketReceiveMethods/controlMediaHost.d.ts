import { OnScreenChangesType, StopShareScreenType, DisconnectSendTransportVideoType, DisconnectSendTransportAudioType, DisconnectSendTransportScreenType, OnScreenChangesParameters, StopShareScreenParameters, DisconnectSendTransportVideoParameters, DisconnectSendTransportAudioParameters, DisconnectSendTransportScreenParameters } from "../../@types/types";
export interface ControlMediaHostParameters extends OnScreenChangesParameters, StopShareScreenParameters, DisconnectSendTransportVideoParameters, DisconnectSendTransportAudioParameters, DisconnectSendTransportScreenParameters {
    updateAdminRestrictSetting: (value: boolean) => void;
    localStream: MediaStream | null;
    updateLocalStream: (stream: (MediaStream | null)) => void;
    updateAudioAlreadyOn: (value: boolean) => void;
    localStreamScreen: MediaStream | null;
    updateLocalStreamScreen: (stream: (MediaStream | null)) => void;
    localStreamVideo: MediaStream | null;
    updateLocalStreamVideo: (stream: (MediaStream | null)) => void;
    updateScreenAlreadyOn: (value: boolean) => void;
    updateVideoAlreadyOn: (value: boolean) => void;
    updateChatAlreadyOn: (value: boolean) => void;
    onScreenChanges: OnScreenChangesType;
    stopShareScreen: StopShareScreenType;
    disconnectSendTransportVideo: DisconnectSendTransportVideoType;
    disconnectSendTransportAudio: DisconnectSendTransportAudioType;
    disconnectSendTransportScreen: DisconnectSendTransportScreenType;
    getUpdatedAllParams: () => ControlMediaHostParameters;
    [key: string]: any;
}
export interface ControlMediaHostOptions {
    type: "audio" | "video" | "screenshare" | "chat" | "all";
    parameters: ControlMediaHostParameters;
}
export type ControlMediaHostType = (options: ControlMediaHostOptions) => Promise<void>;
/**
 * Controls the media host by disabling specific media types (audio, video, screenshare, chat)
 * and updating the corresponding states.
 *
 * @param {ControlMediaHostOptions} options - The options for controlling the media host.
 * @param {string} options.type - The type of media to control. Can be "audio", "video", "screenshare", "chat", or "all".
 * @param {Object} options.parameters - The parameters required for controlling the media host.
 * @param {Function} options.parameters.updateAdminRestrictSetting - Function to update the admin restrict setting.
 * @param {MediaStream} options.parameters.localStream - The local media stream.
 * @param {Function} options.parameters.updateLocalStream - Function to update the local media stream.
 * @param {Function} options.parameters.updateAudioAlreadyOn - Function to update the audio state.
 * @param {MediaStream} options.parameters.localStreamScreen - The local screen share stream.
 * @param {Function} options.parameters.updateLocalStreamScreen - Function to update the local screen share stream.
 * @param {MediaStream} options.parameters.localStreamVideo - The local video stream.
 * @param {Function} options.parameters.updateLocalStreamVideo - Function to update the local video stream.
 * @param {Function} options.parameters.updateScreenAlreadyOn - Function to update the screen share state.
 * @param {Function} options.parameters.updateVideoAlreadyOn - Function to update the video state.
 * @param {Function} options.parameters.updateChatAlreadyOn - Function to update the chat state.
 * @param {Function} options.parameters.onScreenChanges - Function to handle screen changes.
 * @param {Function} options.parameters.stopShareScreen - Function to stop screen sharing.
 * @param {Function} options.parameters.disconnectSendTransportVideo - Function to disconnect the video transport.
 * @param {Function} options.parameters.disconnectSendTransportAudio - Function to disconnect the audio transport.
 * @param {Function} options.parameters.disconnectSendTransportScreen - Function to disconnect the screen share transport.
 *
 * @returns {Promise<void>} A promise that resolves when the media control actions are completed.
 *
 * @example
 * ```typescript
 * await controlMediaHost({
 *   type: "video",
 *   parameters: {
 *     updateAdminRestrictSetting: setAdminRestrict,
 *     localStream: userMediaStream,
 *     updateLocalStream: setUserMediaStream,
 *     updateAudioAlreadyOn: setAudioState,
 *     localStreamScreen: screenMediaStream,
 *     updateLocalStreamScreen: setScreenMediaStream,
 *     localStreamVideo: videoMediaStream,
 *     updateLocalStreamVideo: setVideoMediaStream,
 *     updateScreenAlreadyOn: setScreenState,
 *     updateVideoAlreadyOn: setVideoState,
 *     updateChatAlreadyOn: setChatState,
 *     onScreenChanges: handleScreenChanges,
 *     stopShareScreen: stopScreenSharing,
 *     disconnectSendTransportVideo: disconnectVideoTransport,
 *     disconnectSendTransportAudio: disconnectAudioTransport,
 *     disconnectSendTransportScreen: disconnectScreenTransport,
 *   }
 * });
 * ```
 */
export declare const controlMediaHost: ({ type, parameters }: ControlMediaHostOptions) => Promise<void>;
//# sourceMappingURL=controlMediaHost.d.ts.map