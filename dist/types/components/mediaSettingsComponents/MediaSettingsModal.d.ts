import React from 'react';
import { SwitchAudioOptions, SwitchAudioParameters } from '../../methods/streamMethods/switchAudio';
import { SwitchVideoOptions, SwitchVideoParameters } from '../../methods/streamMethods/switchVideo';
import { SwitchVideoAltOptions, SwitchVideoAltParameters } from '../../methods/streamMethods/switchVideoAlt';
export interface MediaSettingsModalParameters extends SwitchAudioParameters, SwitchVideoParameters, SwitchVideoAltParameters {
    userDefaultVideoInputDevice: string;
    videoInputs: MediaDeviceInfo[];
    audioInputs: MediaDeviceInfo[];
    userDefaultAudioInputDevice: string;
    isBackgroundModalVisible: boolean;
    updateIsBackgroundModalVisible: (visible: boolean) => void;
    getUpdatedAllParams: () => MediaSettingsModalParameters;
}
export interface MediaSettingsModalOptions {
    isMediaSettingsModalVisible: boolean;
    onMediaSettingsClose: () => void;
    switchCameraOnPress?: (options: SwitchVideoAltOptions) => Promise<void>;
    switchVideoOnPress?: (options: SwitchVideoOptions) => Promise<void>;
    switchAudioOnPress?: (options: SwitchAudioOptions) => Promise<void>;
    parameters: MediaSettingsModalParameters;
    position?: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';
    backgroundColor?: string;
}
export type MediaSettingsModalType = (options: MediaSettingsModalOptions) => JSX.Element;
/**
 * MediaSettingsModal component provides a modal interface for users to configure media settings such as selecting video and audio input devices.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {boolean} props.isMediaSettingsModalVisible - Determines if the media settings modal is visible.
 * @param {Function} props.onMediaSettingsClose - Callback function to close the media settings modal.
 * @param {Function} [props.switchCameraOnPress=switchVideoAlt] - Function to handle camera switch action.
 * @param {Function} [props.switchVideoOnPress=switchVideo] - Function to handle video input switch action.
 * @param {Function} [props.switchAudioOnPress=switchAudio] - Function to handle audio input switch action.
 * @param {MediaSettingsModalParameters} props.parameters - Parameters containing user default devices and available devices.
 * @param {string} [props.position='topRight'] - Position of the modal on the screen.
 * @param {string} [props.backgroundColor='#83c0e9'] - Background color of the modal.
 *
 * @returns {JSX.Element} The rendered MediaSettingsModal component.
 *
 * @example
 * import React, { useState } from 'react';
 * import { MediaSettingsModal } from 'mediasfu-reactjs';
 * import { io } from 'socket.io-client';
 *
 * const App = () => {
 *   const socket = io("http://localhost:3000");
 *   const [isMediaModalVisible, setIsMediaModalVisible] = useState(true);
 *
 *   const handleMediaSettingsClose = () => setIsMediaModalVisible(false);
 *   const handleSwitchCamera = async (options) => console.log("Camera switched", options);
 *   const handleSwitchVideo = async (options) => console.log("Video input switched", options);
 *   const handleSwitchAudio = async (options) => console.log("Audio input switched", options);
 *
 *   const parameters = {
 *     userDefaultVideoInputDevice: "default",
 *     videoInputs: [
 *       { deviceId: "camera1", label: "Front Camera" },
 *       { deviceId: "camera2", label: "Rear Camera" }
 *     ],
 *     audioInputs: [
 *       { deviceId: "mic1", label: "Built-in Microphone" },
 *       { deviceId: "mic2", label: "External Microphone" }
 *     ],
 *     userDefaultAudioInputDevice: "default",
 *     isBackgroundModalVisible: false,
 *     updateIsBackgroundModalVisible: (visible) => console.log("Background modal visibility:", visible),
 *     getUpdatedAllParams: () => console.log("Updated all parameters"),
 *   };
 *
 *   return (
 *     <MediaSettingsModal
 *       isMediaSettingsModalVisible={isMediaModalVisible}
 *       onMediaSettingsClose={handleMediaSettingsClose}
 *       switchCameraOnPress={handleSwitchCamera}
 *       switchVideoOnPress={handleSwitchVideo}
 *       switchAudioOnPress={handleSwitchAudio}
 *       parameters={parameters}
 *       position="topRight"
 *       backgroundColor="#83c0e9"
 *     />
 *   );
 * };
 *
 * export default App;
 */
declare const MediaSettingsModal: React.FC<MediaSettingsModalOptions>;
export default MediaSettingsModal;
//# sourceMappingURL=MediaSettingsModal.d.ts.map