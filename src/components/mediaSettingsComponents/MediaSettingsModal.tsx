import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSyncAlt, faCamera, faMicrophone, faPhotoFilm } from '@fortawesome/free-solid-svg-icons';
import { switchAudio, SwitchAudioOptions, SwitchAudioParameters } from '../../methods/streamMethods/switchAudio';
import { switchVideo, SwitchVideoOptions, SwitchVideoParameters } from '../../methods/streamMethods/switchVideo';
import { switchVideoAlt, SwitchVideoAltOptions, SwitchVideoAltParameters } from '../../methods/streamMethods/switchVideoAlt';

// Define the prop types using a TypeScript interface
export interface MediaSettingsModalParameters extends SwitchAudioParameters, SwitchVideoParameters, SwitchVideoAltParameters {
  userDefaultVideoInputDevice: string;
  videoInputs: MediaDeviceInfo[];
  audioInputs: MediaDeviceInfo[];
  userDefaultAudioInputDevice: string;
  isBackgroundModalVisible: boolean;
  updateIsBackgroundModalVisible: (visible: boolean) => void;

  // mediasfu functions
  getUpdatedAllParams: () => MediaSettingsModalParameters;
  // [key: string]: any;
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

const MediaSettingsModal: React.FC<MediaSettingsModalOptions> = ({
  isMediaSettingsModalVisible,
  onMediaSettingsClose,
  switchCameraOnPress = switchVideoAlt,
  switchVideoOnPress = switchVideo,
  switchAudioOnPress = switchAudio,
  parameters,
  position = 'topRight',
  backgroundColor = '#83c0e9',
}) => {
  const {
    userDefaultVideoInputDevice,
    videoInputs,
    audioInputs,
    userDefaultAudioInputDevice,
    isBackgroundModalVisible,
    updateIsBackgroundModalVisible,
  } = parameters;

  const [selectedVideoInput, setSelectedVideoInput] = useState(userDefaultVideoInputDevice);
  const [selectedAudioInput, setSelectedAudioInput] = useState(userDefaultAudioInputDevice);

  const screenWidth = window.innerWidth;
  let modalWidth = 0.8 * screenWidth;
  if (modalWidth > 350) {
    modalWidth = 350;
  }

  const modalContainerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: isMediaSettingsModalVisible ? 'block' : 'none',
    zIndex: 999,
  };

  const modalContentStyle: React.CSSProperties = {
    position: 'fixed',
    backgroundColor: backgroundColor,
    borderRadius: 10,
    padding: 10,
    width: modalWidth,
    maxHeight: '65%',
    overflowY: 'auto',
    top: position.includes('top') ? 10 : 'auto',
    bottom: position.includes('bottom') ? 10 : 'auto',
    left: position.includes('Left') ? 10 : 'auto',
    right: position.includes('Right') ? 10 : 'auto',
  };

  const handleSwitchCamera = async () => {
    await switchCameraOnPress({ parameters });
  };

  const handleVideoSwitch = async (value: string) => {
    if (value !== selectedVideoInput) {
      setSelectedVideoInput(value);
      await switchVideoOnPress({ videoPreference: value, parameters });
    }
  };

  const handleAudioSwitch = async (value: string) => {
    if (value !== selectedAudioInput) {
      setSelectedAudioInput(value);
      await switchAudioOnPress({ audioPreference: value, parameters });
    }
  };

  const showVirtual = () => {
    updateIsBackgroundModalVisible(!isBackgroundModalVisible);
  };

  return (
    <div style={modalContainerStyle}>
      <div style={modalContentStyle}>
        <div className="modal-header">
          <div className="modal-title">Media Settings</div>
          <div className="btn-close-media-settings" onClick={onMediaSettingsClose} style={{ cursor: 'pointer', marginLeft: 'auto', marginRight: 10 }}>
            <FontAwesomeIcon icon={faTimes} className="icon" size="xl" />
          </div>
        </div>
        <hr className="hr" />
        <div className="modal-body">
          <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faCamera} /> Select Camera:
            </label>
            <select value={selectedVideoInput || ''} onChange={(e) => handleVideoSwitch(e.target.value)} className="form-control">
              {videoInputs.map((input) => (
                <option key={input.deviceId} value={input.deviceId}>
                  {input.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginTop: 10 }}>
            <label>
              <FontAwesomeIcon icon={faMicrophone} /> Select Microphone:
            </label>
            <select value={selectedAudioInput || ''} onChange={(e) => handleAudioSwitch(e.target.value)} className="form-control">
              {audioInputs.map((input) => (
                <option key={input.deviceId} value={input.deviceId}>
                  {input.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <button onClick={handleSwitchCamera} style={{ backgroundColor: '#83c0e9', color: 'black', padding: 10, borderRadius: 5, border: 'none', cursor: 'pointer', width: '100%', marginTop: 20 }}>
              <FontAwesomeIcon icon={faSyncAlt} /> Switch Camera
            </button>
          </div>
          <hr />
          <div className="form-group">
            <button onClick={showVirtual} style={{ backgroundColor: '#83c0e9', color: 'black', padding: 10, borderRadius: 5, border: 'none', cursor: 'pointer', width: '100%' }}>
              <FontAwesomeIcon icon={faPhotoFilm} /> Virtual Background
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaSettingsModal;
