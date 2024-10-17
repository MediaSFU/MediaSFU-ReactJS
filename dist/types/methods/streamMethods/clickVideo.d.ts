import { Socket } from "socket.io-client";
import { CheckPermissionType, DisconnectSendTransportVideoParameters, DisconnectSendTransportVideoType, RequestPermissionCameraType, ShowAlert, StreamSuccessVideoParameters, StreamSuccessVideoType, VidCons } from "../../@types/types";
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
    updateRequestIntervalSeconds: number;
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
 * @param {ClickVideoParams} options - The function parameters.
 * @returns {Promise<void>}
 */
export declare const clickVideo: ({ parameters }: ClickVideoOptions) => Promise<void>;
//# sourceMappingURL=clickVideo.d.ts.map