import { Producer, ProducerCodecOptions, ProducerOptions } from "mediasoup-client/lib/types";
import { Socket } from "socket.io-client";
import { PrepopulateUserMediaParameters, PrepopulateUserMediaType, CreateSendTransportParameters, CreateSendTransportType, ConnectSendTransportAudioParameters, ConnectSendTransportAudioType, SleepType } from "../@types/types";
export interface StreamSuccessAudioSwitchParameters extends PrepopulateUserMediaParameters, CreateSendTransportParameters, ConnectSendTransportAudioParameters {
    audioProducer: Producer | null;
    socket: Socket;
    roomName: string;
    localStream: MediaStream | null;
    localStreamAudio: MediaStream | null;
    audioParams: ProducerOptions;
    audioPaused: boolean;
    audioAlreadyOn: boolean;
    transportCreated: boolean;
    audioParamse?: ProducerCodecOptions;
    defAudioID: string;
    userDefaultAudioInputDevice: string;
    hostLabel: string;
    updateMainWindow: boolean;
    videoAlreadyOn: boolean;
    islevel: string;
    lock_screen: boolean;
    shared: boolean;
    updateAudioProducer: (audioProducer: Producer | null) => void;
    updateLocalStream: (localStream: MediaStream | null) => void;
    updateAudioParams: (audioParams: ProducerOptions) => void;
    updateDefAudioID: (defAudioID: string) => void;
    updateUserDefaultAudioInputDevice: (userDefaultAudioInputDevice: string) => void;
    updateUpdateMainWindow: (updateMainWindow: boolean) => void;
    sleep: SleepType;
    prepopulateUserMedia: PrepopulateUserMediaType;
    createSendTransport: CreateSendTransportType;
    connectSendTransportAudio: ConnectSendTransportAudioType;
    getUpdatedAllParams: () => StreamSuccessAudioSwitchParameters;
    [key: string]: any;
}
export interface StreamSuccessAudioSwitchOptions {
    stream: MediaStream;
    parameters: StreamSuccessAudioSwitchParameters;
}
export type StreamSuccessAudioSwitchType = (options: StreamSuccessAudioSwitchOptions) => Promise<void>;
/**
 * Handles the switching of the audio stream upon successful stream connection.
 *
 * @param {Object} options - The options for the stream success audio switch.
 * @param {MediaStream} options.stream - The new media stream.
 * @param {Object} options.parameters - The parameters required for the audio switch.
 * @param {Producer} options.parameters.audioProducer - The current audio producer.
 * @param {Socket} options.parameters.socket - The socket connection.
 * @param {string} options.parameters.roomName - The name of the room.
 * @param {MediaStream} options.parameters.localStream - The local media stream.
 * @param {MediaStream} options.parameters.localStreamAudio - The local audio stream.
 * @param {Object} options.parameters.audioParams - The audio parameters.
 * @param {boolean} options.parameters.audioPaused - Indicates if the audio is paused.
 * @param {boolean} options.parameters.audioAlreadyOn - Indicates if the audio is already on.
 * @param {boolean} options.parameters.transportCreated - Indicates if the transport is created.
 * @param {Object} options.parameters.audioParamse - Additional audio parameters.
 * @param {string} options.parameters.defAudioID - The default audio device ID.
 * @param {string} options.parameters.userDefaultAudioInputDevice - The user default audio input device.
 * @param {string} options.parameters.hostLabel - The host label.
 * @param {boolean} options.parameters.updateMainWindow - Indicates if the main window should be updated.
 * @param {boolean} options.parameters.videoAlreadyOn - Indicates if the video is already on.
 * @param {string} options.parameters.islevel - The participant's level.
 * @param {boolean} options.parameters.lock_screen - Indicates if the screen is locked.
 * @param {boolean} options.parameters.shared - Indicates if the screen is shared.
 * @param {Function} options.parameters.updateAudioProducer - Function to update the audio producer.
 * @param {Function} options.parameters.updateLocalStream - Function to update the local stream.
 * @param {Function} options.parameters.updateAudioParams - Function to update the audio parameters.
 * @param {Function} options.parameters.updateDefAudioID - Function to update the default audio device ID.
 * @param {Function} options.parameters.updateUserDefaultAudioInputDevice - Function to update the user default audio input device.
 * @param {Function} options.parameters.updateUpdateMainWindow - Function to update the main window.
 * @param {Function} options.parameters.sleep - Function to pause execution for a specified time.
 * @param {Function} options.parameters.prepopulateUserMedia - Function to prepopulate user media.
 * @param {Function} options.parameters.createSendTransport - Function to create a send transport.
 * @param {Function} options.parameters.connectSendTransportAudio - Function to connect the send transport for audio.
 *
 * @returns {Promise<void>} A promise that resolves when the audio switch is complete.
 */
export declare const streamSuccessAudioSwitch: ({ stream, parameters, }: StreamSuccessAudioSwitchOptions) => Promise<void>;
//# sourceMappingURL=streamSuccessAudioSwitch.d.ts.map