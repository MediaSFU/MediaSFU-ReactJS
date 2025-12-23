import React from 'react';
import { SwitchAudioOptions, SwitchAudioParameters } from '../../methods/streamMethods/switchAudio';
import { SwitchVideoOptions, SwitchVideoParameters } from '../../methods/streamMethods/switchVideo';
import { SwitchVideoAltOptions, SwitchVideoAltParameters } from '../../methods/streamMethods/switchVideoAlt';
import { ModalRenderMode } from '../menuComponents/MenuModal';
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
    /** Theme control - whether dark mode is active */
    isDarkMode?: boolean;
    /** Enable glassmorphism effects (modern UI) */
    enableGlassmorphism?: boolean;
    /** Render mode: modal (default overlay), sidebar (inline for desktop), inline (no wrapper) */
    renderMode?: ModalRenderMode;
    /** Optional hook used by modern shell to route to the sidebar background picker */
    onOpenBackgroundSidebar?: () => void;
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
declare const MediaSettingsModal: React.FC<MediaSettingsModalOptions>;
export default MediaSettingsModal;
//# sourceMappingURL=MediaSettingsModal.d.ts.map