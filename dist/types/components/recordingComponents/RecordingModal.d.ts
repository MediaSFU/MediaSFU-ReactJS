import React from "react";
import { EventType, ConfirmRecordingType, StartRecordingType, ConfirmRecordingParameters, StartRecordingParameters } from "../../@types/types";
import { ModalRenderMode } from "../menuComponents/MenuModal";
export interface RecordingModalParameters extends ConfirmRecordingParameters, StartRecordingParameters {
    recordPaused: boolean;
    recordingVideoType: string;
    recordingDisplayType: "video" | "media" | "all";
    recordingBackgroundColor: string;
    recordingNameTagsColor: string;
    recordingOrientationVideo: string;
    recordingNameTags: boolean;
    recordingAddText: boolean;
    recordingCustomText: string;
    recordingCustomTextPosition: string;
    recordingCustomTextColor: string;
    recordingMediaOptions: string;
    recordingAudioOptions: string;
    recordingVideoOptions: string;
    recordingAddHLS: boolean;
    eventType: EventType;
    updateRecordingVideoType: (value: string) => void;
    updateRecordingDisplayType: (value: "video" | "media" | "all") => void;
    updateRecordingBackgroundColor: (value: string) => void;
    updateRecordingNameTagsColor: (value: string) => void;
    updateRecordingOrientationVideo: (value: string) => void;
    updateRecordingNameTags: (value: boolean) => void;
    updateRecordingAddText: (value: boolean) => void;
    updateRecordingCustomText: (value: string) => void;
    updateRecordingCustomTextPosition: (value: string) => void;
    updateRecordingCustomTextColor: (value: string) => void;
    updateRecordingMediaOptions: (value: string) => void;
    updateRecordingAudioOptions: (value: string) => void;
    updateRecordingVideoOptions: (value: string) => void;
    updateRecordingAddHLS: (value: boolean) => void;
    getUpdatedAllParams: () => RecordingModalParameters;
    [key: string]: any;
}
export interface RecordingModalOptions {
    isRecordingModalVisible: boolean;
    onClose: () => void;
    backgroundColor?: string;
    position?: string;
    /** Theme control - whether dark mode is active */
    isDarkMode?: boolean;
    /** Enable glassmorphism effects (modern UI) */
    enableGlassmorphism?: boolean;
    /** Render mode: modal (default overlay), sidebar (inline for desktop), inline (no wrapper) */
    renderMode?: ModalRenderMode;
    confirmRecording: ConfirmRecordingType;
    startRecording: StartRecordingType;
    parameters: RecordingModalParameters;
    title?: React.ReactNode;
    overlayProps?: React.HTMLAttributes<HTMLDivElement>;
    contentProps?: React.HTMLAttributes<HTMLDivElement>;
    headerProps?: React.HTMLAttributes<HTMLDivElement>;
    titleProps?: React.HTMLAttributes<HTMLHeadingElement>;
    closeButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    closeIconComponent?: React.ReactNode;
    headerDividerProps?: React.HTMLAttributes<HTMLHRElement>;
    bodyProps?: React.HTMLAttributes<HTMLDivElement>;
    panelsWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    panelsScrollProps?: React.HTMLAttributes<HTMLDivElement>;
    panelsContainerProps?: React.HTMLAttributes<HTMLDivElement>;
    panelsActionsDividerProps?: React.HTMLAttributes<HTMLDivElement>;
    actionsWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    confirmButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    startButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    confirmButtonLabel?: React.ReactNode;
    startButtonLabel?: React.ReactNode;
    renderHeader?: (options: {
        defaultHeader: React.ReactNode;
        onClose: () => void;
    }) => React.ReactNode;
    renderPanels?: (options: {
        defaultPanels: React.ReactNode;
        parameters: RecordingModalParameters;
    }) => React.ReactNode;
    renderActions?: (options: {
        defaultActions: React.ReactNode;
        recordPaused: boolean;
        handleConfirm: () => void;
        handleStart: () => void;
    }) => React.ReactNode;
    renderBody?: (options: {
        defaultBody: React.ReactNode;
    }) => React.ReactNode;
    renderContent?: (options: {
        defaultContent: React.ReactNode;
    }) => React.ReactNode;
}
export type RecordingModalType = (options: RecordingModalOptions) => React.JSX.Element;
/**
 * RecordingModal - Comprehensive recording configuration interface
 *
 * A feature-rich modal for configuring cloud recording settings including video quality,
 * display options, branding (watermarks, name tags, custom text), background colors,
 * and HLS streaming. Provides standard and advanced configuration panels with real-time preview.
 *
 * Features:
 * - Standard and advanced configuration panels
 * - Video quality selection (fullDisplay, bestDisplay, all)
 * - Display type options (video, media, all)
 * - Background color picker for recording canvas
 * - Name tags with custom colors
 * - Custom text watermarks with positioning
 * - Recording orientation (landscape/portrait)
 * - Media/audio/video participant selection
 * - HLS streaming toggle
 * - Pause/resume recording controls
 * - Custom render hooks for complete UI flexibility
 *
 * @component
 * @param {RecordingModalOptions} options - Configuration options
 * @param {boolean} options.isRecordingModalVisible - Modal visibility state
 * @param {Function} options.onClose - Callback when modal is closed
 * @param {string} [options.backgroundColor="#83c0e9"] - Modal background color
 * @param {string} [options.position="bottomRight"] - Modal position on screen
 * @param {ConfirmRecordingType} options.confirmRecording - Function to confirm recording settings
 * @param {StartRecordingType} options.startRecording - Function to start/resume recording
 * @param {RecordingModalParameters} options.parameters - Recording configuration parameters
 * @param {React.ReactNode} [options.title] - Modal title content
 * @param {object} [options.overlayProps] - HTML attributes for overlay div
 * @param {object} [options.contentProps] - HTML attributes for content container
 * @param {object} [options.headerProps] - HTML attributes for header section
 * @param {object} [options.closeButtonProps] - HTML attributes for close button
 * @param {React.ReactNode} [options.closeIconComponent] - Custom close icon
 * @param {object} [options.bodyProps] - HTML attributes for body section
 * @param {object} [options.panelsWrapperProps] - HTML attributes for panels container
 * @param {object} [options.actionsWrapperProps] - HTML attributes for action buttons wrapper
 * @param {object} [options.confirmButtonProps] - HTML attributes for confirm button
 * @param {object} [options.startButtonProps] - HTML attributes for start/resume button
 * @param {React.ReactNode} [options.confirmButtonLabel] - Custom confirm button label
 * @param {React.ReactNode} [options.startButtonLabel] - Custom start/resume button label
 * @param {Function} [options.renderHeader] - Custom header renderer
 * @param {Function} [options.renderPanels] - Custom configuration panels renderer
 * @param {Function} [options.renderActions] - Custom action buttons renderer
 * @param {Function} [options.renderBody] - Custom body renderer
 * @param {Function} [options.renderContent] - Custom content renderer
 *
 * @returns {React.JSX.Element} Rendered recording modal
 *
 * @example
 * // Basic recording modal with default settings
 * ```tsx
 * import React, { useState } from 'react';
 * import { RecordingModal } from 'mediasfu-reactjs';
 *
 * function RecordingControls({ parameters }) {
 *   const [isVisible, setIsVisible] = useState(false);
 *
 *   return (
 *     <>
 *       <button onClick={() => setIsVisible(true)}>
 *         Configure Recording
 *       </button>
 *       <RecordingModal
 *         isRecordingModalVisible={isVisible}
 *         onClose={() => setIsVisible(false)}
 *         confirmRecording={parameters.confirmRecording}
 *         startRecording={parameters.startRecording}
 *         parameters={parameters}
 *         backgroundColor="#0f172a"
 *         position="bottomRight"
 *       />
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * // Custom styling with branded colors
 * ```tsx
 * import { RecordingModal } from 'mediasfu-reactjs';
 *
 * function BrandedRecording({ isVisible, onClose, parameters }) {
 *   return (
 *     <RecordingModal
 *       isRecordingModalVisible={isVisible}
 *       onClose={onClose}
 *       confirmRecording={parameters.confirmRecording}
 *       startRecording={parameters.startRecording}
 *       parameters={parameters}
 *       backgroundColor="#1e3a8a"
 *       position="topRight"
 *       contentProps={{
 *         style: {
 *           borderRadius: 20,
 *           border: '2px solid #3b82f6',
 *           boxShadow: '0 20px 60px rgba(59,130,246,0.3)',
 *           maxHeight: '90vh',
 *           overflow: 'auto',
 *         },
 *       }}
 *       confirmButtonProps={{
 *         style: {
 *           background: 'linear-gradient(135deg, #22c55e 0%, #14532d 100%)',
 *           color: 'white',
 *           padding: '12px 32px',
 *           borderRadius: 12,
 *           fontWeight: 600,
 *           border: 'none',
 *           cursor: 'pointer',
 *         },
 *       }}
 *       startButtonProps={{
 *         style: {
 *           background: 'linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)',
 *           color: 'white',
 *           padding: '12px 32px',
 *           borderRadius: 12,
 *           fontWeight: 600,
 *           border: 'none',
 *           cursor: 'pointer',
 *         },
 *       }}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * // Custom actions with analytics tracking
 * ```tsx
 * import { RecordingModal } from 'mediasfu-reactjs';
 *
 * function AnalyticsRecording({ isVisible, onClose, parameters }) {
 *   const handleConfirm = async () => {
 *     analytics.track('recording_configured', {
 *       videoType: parameters.recordingVideoType,
 *       displayType: parameters.recordingDisplayType,
 *       hasNameTags: parameters.recordingNameTags,
 *       hasCustomText: parameters.recordingAddText,
 *       hasHLS: parameters.recordingAddHLS,
 *     });
 *     await parameters.confirmRecording({ parameters });
 *   };
 *
 *   const handleStart = async () => {
 *     analytics.track('recording_started', {
 *       isPaused: parameters.recordPaused,
 *     });
 *     await parameters.startRecording({ parameters });
 *   };
 *
 *   return (
 *     <RecordingModal
 *       isRecordingModalVisible={isVisible}
 *       onClose={onClose}
 *       confirmRecording={handleConfirm}
 *       startRecording={handleStart}
 *       parameters={parameters}
 *       renderActions={({ defaultActions, recordPaused, handleConfirm, handleStart }) => (
 *         <div style={{
 *           display: 'flex',
 *           gap: 12,
 *           padding: 20,
 *           borderTop: '2px solid #1e3a8a',
 *           justifyContent: 'space-between',
 *         }}>
 *           <button
 *             onClick={handleConfirm}
 *             style={{
 *               flex: 1,
 *               background: '#3b82f6',
 *               color: 'white',
 *               padding: '14px 24px',
 *               borderRadius: 12,
 *               border: 'none',
 *               fontWeight: 600,
 *               cursor: 'pointer',
 *             }}
 *           >
 *             💾 Save Settings
 *           </button>
 *           <button
 *             onClick={handleStart}
 *             style={{
 *               flex: 1,
 *               background: recordPaused ? '#22c55e' : '#dc2626',
 *               color: 'white',
 *               padding: '14px 24px',
 *               borderRadius: 12,
 *               border: 'none',
 *               fontWeight: 600,
 *               cursor: 'pointer',
 *             }}
 *           >
 *             {recordPaused ? '▶️ Resume' : '🔴 Start'} Recording
 *           </button>
 *         </div>
 *       )}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * // Override with MediasfuGeneric uiOverrides
 * ```tsx
 * import { MediasfuGeneric, RecordingModal } from 'mediasfu-reactjs';
 *
 * const uiOverrides = {
 *   recordingModal: {
 *     component: (props) => (
 *       <RecordingModal
 *         {...props}
 *         backgroundColor="#0f172a"
 *         position="topRight"
 *         contentProps={{
 *           style: {
 *             maxHeight: '85vh',
 *             borderRadius: 20,
 *             border: '2px solid #3b82f6',
 *           },
 *         }}
 *         confirmButtonProps={{
 *           style: {
 *             background: '#22c55e',
 *             borderRadius: 12,
 *             padding: '12px 28px',
 *           },
 *         }}
 *         startButtonProps={{
 *           style: {
 *             background: '#dc2626',
 *             borderRadius: 12,
 *             padding: '12px 28px',
 *           },
 *         }}
 *       />
 *     ),
 *   },
 * };
 *
 * <MediasfuGeneric uiOverrides={uiOverrides} />;
 * ```
 */
declare const RecordingModal: React.FC<RecordingModalOptions>;
export default RecordingModal;
//# sourceMappingURL=RecordingModal.d.ts.map