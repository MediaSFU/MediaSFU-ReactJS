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

export type MediaSettingsModalType = (options: MediaSettingsModalOptions) => React.JSX.Element;

/**
 * MediaSettingsModal - Comprehensive device selection and media configuration interface
 * 
 * A feature-rich modal for managing audio/video inputs, camera switching, and virtual backgrounds.
 * Supports device enumeration, real-time switching, front/back camera toggle (mobile), and
 * integrates with background customization. Perfect for pre-call setup or in-call media adjustments.
 * 
 * Features:
 * - Video input device selection (webcams, external cameras)
 * - Audio input device selection (microphones, headsets)
 * - Front/back camera switching for mobile devices
 * - Virtual background access integration
 * - Real-time device switching without dropping call
 * - Device refresh capability
 * - Selected device persistence
 * - Responsive positioning (topRight, topLeft, bottomRight, bottomLeft)
 * - Custom styling support
 * 
 * @component
 * @param {MediaSettingsModalOptions} options - Configuration options
 * @param {boolean} options.isMediaSettingsModalVisible - Modal visibility state
 * @param {Function} options.onMediaSettingsClose - Callback when modal is closed
 * @param {Function} [options.switchCameraOnPress=switchVideoAlt] - Camera front/back toggle handler
 * @param {Function} [options.switchVideoOnPress=switchVideo] - Video input switch handler
 * @param {Function} [options.switchAudioOnPress=switchAudio] - Audio input switch handler
 * @param {MediaSettingsModalParameters} options.parameters - Device and state parameters
 * @param {string} options.parameters.userDefaultVideoInputDevice - Currently selected video device ID
 * @param {MediaDeviceInfo[]} options.parameters.videoInputs - Available video input devices
 * @param {MediaDeviceInfo[]} options.parameters.audioInputs - Available audio input devices
 * @param {string} options.parameters.userDefaultAudioInputDevice - Currently selected audio device ID
 * @param {boolean} options.parameters.isBackgroundModalVisible - Background modal state
 * @param {Function} options.parameters.updateIsBackgroundModalVisible - Update background modal visibility
 * @param {Function} options.parameters.getUpdatedAllParams - Retrieve latest parameters
 * @param {string} [options.position='topRight'] - Modal screen position
 * @param {string} [options.backgroundColor='#83c0e9'] - Modal background color
 * 
 * @returns {React.JSX.Element} Rendered media settings modal
 * 
 * @example
 * // Basic media settings modal
 * ```tsx
 * import React, { useState } from 'react';
 * import { MediaSettingsModal } from 'mediasfu-reactjs';
 * 
 * function MediaControls({ parameters }) {
 *   const [isVisible, setIsVisible] = useState(false);
 * 
 *   return (
 *     <>
 *       <button onClick={() => setIsVisible(true)}>
 *         Media Settings
 *       </button>
 *       <MediaSettingsModal
 *         isMediaSettingsModalVisible={isVisible}
 *         onMediaSettingsClose={() => setIsVisible(false)}
 *         parameters={parameters}
 *         position="topRight"
 *         backgroundColor="#0f172a"
 *       />
 *     </>
 *   );
 * }
 * ```
 * 
 * @example
 * // Custom styled with device analytics
 * ```tsx
 * import { MediaSettingsModal } from 'mediasfu-reactjs';
 * 
 * function AnalyticsMediaSettings({ isVisible, onClose, parameters }) {
 *   const handleSwitchVideo = async (options) => {
 *     analytics.track('video_device_switched', {
 *       deviceId: options.videoPreference,
 *       deviceLabel: parameters.videoInputs.find(d => d.deviceId === options.videoPreference)?.label,
 *     });
 *     return parameters.switchVideo(options);
 *   };
 * 
 *   const handleSwitchAudio = async (options) => {
 *     analytics.track('audio_device_switched', {
 *       deviceId: options.audioPreference,
 *       deviceLabel: parameters.audioInputs.find(d => d.deviceId === options.audioPreference)?.label,
 *     });
 *     return parameters.switchAudio(options);
 *   };
 * 
 *   return (
 *     <MediaSettingsModal
 *       isMediaSettingsModalVisible={isVisible}
 *       onMediaSettingsClose={onClose}
 *       switchVideoOnPress={handleSwitchVideo}
 *       switchAudioOnPress={handleSwitchAudio}
 *       parameters={parameters}
 *       position="bottomRight"
 *       backgroundColor="#1e3a8a"
 *     />
 *   );
 * }
 * ```
 * 
 * @example
 * // Branded settings with device count display
 * ```tsx
 * import { MediaSettingsModal } from 'mediasfu-reactjs';
 * 
 * function BrandedSettings({ isVisible, onClose, parameters }) {
 *   return (
 *     <div>
 *       <div style={{
 *         display: 'flex',
 *         gap: 12,
 *         marginBottom: 16,
 *         padding: 12,
 *         background: '#f8fafc',
 *         borderRadius: 8,
 *       }}>
 *         <div>
 *           <span style={{ fontWeight: 600 }}>Cameras:</span> {parameters.videoInputs.length}
 *         </div>
 *         <div>
 *           <span style={{ fontWeight: 600 }}>Microphones:</span> {parameters.audioInputs.length}
 *         </div>
 *       </div>
 *       <MediaSettingsModal
 *         isMediaSettingsModalVisible={isVisible}
 *         onMediaSettingsClose={onClose}
 *         parameters={parameters}
 *         position="topLeft"
 *         backgroundColor="#7c3aed"
 *       />
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example
 * // Override with MediasfuGeneric uiOverrides
 * ```tsx
 * import { MediasfuGeneric, MediaSettingsModal } from 'mediasfu-reactjs';
 * 
 * const uiOverrides = {
 *   mediaSettingsModal: {
 *     component: (props) => (
 *       <MediaSettingsModal
 *         {...props}
 *         backgroundColor="#0f172a"
 *         position="topRight"
 *         switchVideoOnPress={async (options) => {
 *           console.log('Video device switched:', options.videoPreference);
 *           return props.switchVideoOnPress?.(options);
 *         }}
 *         switchAudioOnPress={async (options) => {
 *           console.log('Audio device switched:', options.audioPreference);
 *           return props.switchAudioOnPress?.(options);
 *         }}
 *       />
 *     ),
 *   },
 * };
 * 
 * <MediasfuGeneric uiOverrides={uiOverrides} />;
 * ```
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
