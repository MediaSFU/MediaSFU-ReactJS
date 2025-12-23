import { Socket } from "socket.io-client";
import { CheckPermissionType, DisconnectSendTransportVideoParameters, DisconnectSendTransportVideoType, RequestPermissionCameraType, ShowAlert, StreamSuccessVideoParameters, StreamSuccessVideoType, VidCons } from "../../@types/types";
import { PermissionConfig } from "../permissionsMethods/updatePermissionConfig";
export interface ClickVideoParameters extends DisconnectSendTransportVideoParameters, StreamSuccessVideoParameters {
    checkMediaPermission: boolean;
    hasCameraPermission: boolean;
    videoAlreadyOn: boolean;
    audioOnlyRoom: boolean;
    recordStarted: boolean;
    recordResumed: boolean;
    recordPaused: boolean;
    recordStopped: boolean;
    recordingMediaOptions: string;
    islevel: string;
    youAreCoHost: boolean;
    adminRestrictSetting: boolean;
    videoRequestState: string | null;
    videoRequestTime: number;
    member: string;
    socket: Socket;
    roomName: string;
    userDefaultVideoInputDevice: string;
    currentFacingMode: string;
    vidCons: VidCons;
    frameRate: number;
    videoAction: boolean;
    localStream: MediaStream | null;
    audioSetting: string;
    videoSetting: string;
    screenshareSetting: string;
    chatSetting: string;
    permissionConfig?: PermissionConfig | null;
    updateRequestIntervalSeconds: number;
    supportFlexRoom?: boolean;
    supportMaxRoom?: boolean;
    showAlert?: ShowAlert;
    updateVideoAlreadyOn: (value: boolean) => void;
    updateVideoRequestState: (state: string) => void;
    updateLocalStream: (stream: MediaStream | null) => void;
    mediaDevices: MediaDevices;
    streamSuccessVideo: StreamSuccessVideoType;
    disconnectSendTransportVideo: DisconnectSendTransportVideoType;
    requestPermissionCamera: RequestPermissionCameraType;
    checkPermission: CheckPermissionType;
    getUpdatedAllParams: () => ClickVideoParameters;
    [key: string]: any;
}
export interface ClickVideoOptions {
    parameters: ClickVideoParameters;
}
export type ClickVideoType = (options: ClickVideoOptions) => Promise<void>;
/**
 * Handles the click event to toggle the participant's video on/off and manages video permission requests.
 *
 * @param {ClickVideoOptions} options - The function parameters.
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * clickVideo({
 *   parameters: {
 *     checkMediaPermission: true,
 *     hasCameraPermission: false,
 *     videoAlreadyOn: false,
 *     audioOnlyRoom: false,
 *     recordStarted: true,
 *     recordResumed: false,
 *     recordPaused: true,
 *     recordStopped: false,
 *     recordingMediaOptions: "video",
 *     islevel: "1",
 *     youAreCoHost: false,
 *     adminRestrictSetting: false,
 *     videoRequestState: null,
 *     videoRequestTime: Date.now(),
 *     member: "John Doe",
 *     socket: socketInstance,
 *     roomName: "room123",
 *     userDefaultVideoInputDevice: "default",
 *     currentFacingMode: "user",
 *     vidCons: { width: 1280, height: 720 },
 *     frameRate: 30,
 *     videoAction: false,
 *     localStream: null,
 *     audioSetting: "allow",
 *     videoSetting: "allow",
 *     screenshareSetting: "allow",
 *     chatSetting: "allow",
 *     updateRequestIntervalSeconds: 60,
 *     showAlert: showAlertFunction,
 *     updateVideoAlreadyOn: setVideoAlreadyOn,
 *     updateVideoRequestState: setVideoRequestState,
 *     updateLocalStream: setLocalStream,
 *     mediaDevices: navigator.mediaDevices,
 *     streamSuccessVideo: streamSuccessVideoFunction,
 *     disconnectSendTransportVideo: disconnectVideoTransportFunction,
 *     requestPermissionCamera: requestCameraPermissionFunction,
 *     checkPermission: checkPermissionFunction,
 *     getUpdatedAllParams: getUpdatedParamsFunction
 *   }
 * });
 * ```
 */
export declare const clickVideo: ({ parameters }: ClickVideoOptions) => Promise<void>;
//# sourceMappingURL=clickVideo.d.ts.map