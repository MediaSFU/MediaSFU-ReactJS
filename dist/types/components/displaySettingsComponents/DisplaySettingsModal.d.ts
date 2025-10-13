import React from "react";
import { ModifyDisplaySettingsOptions, ModifyDisplaySettingsParameters } from "../../methods/displaySettingsMethods/modifyDisplaySettings";
export interface DisplaySettingsModalParameters extends ModifyDisplaySettingsParameters {
    meetingDisplayType: string;
    autoWave: boolean;
    forceFullDisplay: boolean;
    meetingVideoOptimized: boolean;
}
export interface DisplaySettingsModalOptions {
    isDisplaySettingsModalVisible: boolean;
    onDisplaySettingsClose: () => void;
    onModifyDisplaySettings?: (options: ModifyDisplaySettingsOptions) => Promise<void>;
    parameters: DisplaySettingsModalParameters;
    position?: "topRight" | "topLeft" | "bottomRight" | "bottomLeft";
    backgroundColor?: string;
}
export type DisplaySettingsModalType = (options: DisplaySettingsModalOptions) => React.JSX.Element;
/**
 * DisplaySettingsModal - Comprehensive layout and visual configuration interface
 *
 * A powerful modal for managing meeting display modes, video optimization, participant visibility,
 * and audio visualization settings. Provides granular control over grid layouts, screen sharing displays,
 * and participant rendering. Perfect for adapting the UI to different meeting types and user preferences.
 *
 * Features:
 * - Display type selection (video, media, all participants)
 * - Video optimization toggle (bandwidth/quality management)
 * - Force full display mode (maximize participant grid)
 * - Auto-wave visualization (audio level indicators)
 * - Meeting display type configuration
 * - Real-time layout updates
 * - Responsive positioning
 * - Custom styling support
 * - Settings persistence
 *
 * @component
 * @param {DisplaySettingsModalOptions} options - Configuration options
 * @param {boolean} options.isDisplaySettingsModalVisible - Modal visibility state
 * @param {Function} options.onDisplaySettingsClose - Callback when modal is closed
 * @param {Function} [options.onModifyDisplaySettings=modifyDisplaySettings] - Settings modification handler
 * @param {DisplaySettingsModalParameters} options.parameters - Display configuration parameters
 * @param {string} options.parameters.meetingDisplayType - Current display mode ('video', 'media', 'all')
 * @param {boolean} options.parameters.autoWave - Audio visualization enabled state
 * @param {boolean} options.parameters.forceFullDisplay - Full display mode state
 * @param {boolean} options.parameters.meetingVideoOptimized - Video optimization state
 * @param {string} [options.position='topRight'] - Modal screen position
 * @param {string} [options.backgroundColor='#83c0e9'] - Modal background color
 *
 * @returns {React.JSX.Element} Rendered display settings modal
 *
 * @example
 * // Basic display settings modal
 * ```tsx
 * import React, { useState } from 'react';
 * import { DisplaySettingsModal } from 'mediasfu-reactjs';
 *
 * function DisplayControls({ parameters }) {
 *   const [isVisible, setIsVisible] = useState(false);
 *
 *   return (
 *     <>
 *       <button onClick={() => setIsVisible(true)}>
 *         Display Settings ({parameters.meetingDisplayType})
 *       </button>
 *       <DisplaySettingsModal
 *         isDisplaySettingsModalVisible={isVisible}
 *         onDisplaySettingsClose={() => setIsVisible(false)}
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
 * // Custom display settings with analytics
 * ```tsx
 * import { DisplaySettingsModal } from 'mediasfu-reactjs';
 *
 * function AnalyticsDisplay({ isVisible, onClose, parameters }) {
 *   const handleModifySettings = async (options) => {
 *     analytics.track('display_settings_changed', {
 *       displayType: options.displayType,
 *       autoWave: options.autoWave,
 *       forceFullDisplay: options.forceFullDisplay,
 *       videoOptimized: options.meetingVideoOptimized,
 *     });
 *     return parameters.modifyDisplaySettings(options);
 *   };
 *
 *   return (
 *     <DisplaySettingsModal
 *       isDisplaySettingsModalVisible={isVisible}
 *       onDisplaySettingsClose={onClose}
 *       onModifyDisplaySettings={handleModifySettings}
 *       parameters={parameters}
 *       position="bottomLeft"
 *       backgroundColor="#1e3a8a"
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * // Branded settings with current state display
 * ```tsx
 * import { DisplaySettingsModal } from 'mediasfu-reactjs';
 *
 * function BrandedDisplaySettings({ isVisible, onClose, parameters }) {
 *   const displayModes = {
 *     video: 'Video Focus',
 *     media: 'Screen Share',
 *     all: 'All Participants',
 *   };
 *
 *   return (
 *     <div>
 *       <div style={{
 *         padding: 12,
 *         background: '#f8fafc',
 *         borderRadius: 8,
 *         marginBottom: 16,
 *       }}>
 *         <div style={{ fontWeight: 600, marginBottom: 8 }}>
 *           Current: {displayModes[parameters.meetingDisplayType]}
 *         </div>
 *         <div style={{ fontSize: 14, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
 *           <span>Audio Viz: {parameters.autoWave ? '✓' : '✗'}</span>
 *           <span>Full Display: {parameters.forceFullDisplay ? '✓' : '✗'}</span>
 *           <span>Optimized: {parameters.meetingVideoOptimized ? '✓' : '✗'}</span>
 *         </div>
 *       </div>
 *       <DisplaySettingsModal
 *         isDisplaySettingsModalVisible={isVisible}
 *         onDisplaySettingsClose={onClose}
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
 * import { MediasfuGeneric, DisplaySettingsModal } from 'mediasfu-reactjs';
 *
 * const uiOverrides = {
 *   displaySettingsModal: {
 *     component: (props) => (
 *       <DisplaySettingsModal
 *         {...props}
 *         backgroundColor="#0f172a"
 *         position="topRight"
 *         onModifyDisplaySettings={async (options) => {
 *           console.log('Display settings updated:', {
 *             type: options.displayType,
 *             optimized: options.meetingVideoOptimized,
 *           });
 *           return props.onModifyDisplaySettings?.(options);
 *         }}
 *       />
 *     ),
 *   },
 * };
 *
 * <MediasfuGeneric uiOverrides={uiOverrides} />;
 * ```
 */
declare const DisplaySettingsModal: React.FC<DisplaySettingsModalOptions>;
export default DisplaySettingsModal;
//# sourceMappingURL=DisplaySettingsModal.d.ts.map