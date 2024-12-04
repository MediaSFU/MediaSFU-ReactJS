import { Socket } from "socket.io-client";
import { CheckPermissionType, DisconnectSendTransportAudioParameters, DisconnectSendTransportAudioType, Participant, RequestPermissionAudioType, ResumeSendTransportAudioParameters, ResumeSendTransportAudioType, ShowAlert, StreamSuccessAudioParameters, StreamSuccessAudioType } from "../../@types/types";
export interface ClickAudioParameters extends DisconnectSendTransportAudioParameters, ResumeSendTransportAudioParameters, StreamSuccessAudioParameters {
    checkMediaPermission: boolean;
    hasAudioPermission: boolean;
    audioPaused: boolean;
    audioAlreadyOn: boolean;
    audioOnlyRoom: boolean;
    recordStarted: boolean;
    recordResumed: boolean;
    recordPaused: boolean;
    recordStopped: boolean;
    recordingMediaOptions: string;
    islevel: string;
    youAreCoHost: boolean;
    adminRestrictSetting: boolean;
    audioRequestState: string | null;
    audioRequestTime: number;
    member: string;
    socket: Socket;
    localSocket?: Socket;
    roomName: string;
    userDefaultAudioInputDevice: string;
    micAction: boolean;
    localStream: MediaStream | null;
    audioSetting: string;
    videoSetting: string;
    screenshareSetting: string;
    chatSetting: string;
    updateRequestIntervalSeconds: number;
    participants: Participant[];
    mediaDevices: MediaDevices;
    transportCreated: boolean;
    transportCreatedAudio: boolean;
    updateAudioAlreadyOn: (status: boolean) => void;
    updateAudioRequestState: (state: string | null) => void;
    updateAudioPaused: (status: boolean) => void;
    updateLocalStream: (stream: MediaStream | null) => void;
    updateParticipants: (participants: Participant[]) => void;
    updateTransportCreated: (status: boolean) => void;
    updateTransportCreatedAudio: (status: boolean) => void;
    updateMicAction: (action: boolean) => void;
    showAlert?: ShowAlert;
    checkPermission: CheckPermissionType;
    streamSuccessAudio: StreamSuccessAudioType;
    disconnectSendTransportAudio: DisconnectSendTransportAudioType;
    requestPermissionAudio: RequestPermissionAudioType;
    resumeSendTransportAudio: ResumeSendTransportAudioType;
    getUpdatedAllParams: () => ClickAudioParameters;
    [key: string]: any;
}
export interface ClickAudioOptions {
    parameters: ClickAudioParameters;
}
export type ClickAudioType = (options: ClickAudioOptions) => Promise<void>;
/**
 * Handles the click event for toggling audio in a media session.
 *
 * @param {ClickAudioOptions} parameters - The parameters required for handling the audio click event.
 * @returns {Promise<void>} A promise that resolves when the audio click event has been handled.
 *
 * The function performs the following actions:
 * - If the event is audio-only, it shows an alert and exits.
 * - If the audio is already on, it handles the logic for turning it off, including checking recording states and permissions.
 * - If the audio is off, it checks for admin restrictions, user permissions, and handles the logic for turning the audio on.
 * - It updates various states and emits socket events as necessary.
 *
 * @example
 * ```typescript
 * clickAudio({ parameters });
 * ```
 */
export declare const clickAudio: ({ parameters }: ClickAudioOptions) => Promise<void>;
//# sourceMappingURL=clickAudio.d.ts.map