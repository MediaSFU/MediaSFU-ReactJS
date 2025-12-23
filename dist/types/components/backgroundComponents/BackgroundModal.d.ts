import React from "react";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import { ConnectSendTransportVideoType, CreateSendTransportType, CreateSendTransportParameters, OnScreenChangesType, DisconnectSendTransportVideoType, OnScreenChangesParameters, ShowAlert, SleepType, VidCons, ConnectSendTransportVideoParameters, DisconnectSendTransportVideoParameters } from "../../@types/types";
import { Producer, ProducerOptions } from "mediasoup-client/lib/types";
import { ModalRenderMode } from '../menuComponents/MenuModal';
export interface BackgroundModalParameters extends CreateSendTransportParameters, ConnectSendTransportVideoParameters, DisconnectSendTransportVideoParameters, OnScreenChangesParameters {
    customImage: string;
    selectedImage: string;
    segmentVideo: MediaStream | null;
    selfieSegmentation: SelfieSegmentation | null;
    pauseSegmentation: boolean;
    processedStream: MediaStream | null;
    keepBackground: boolean;
    backgroundHasChanged: boolean;
    virtualStream: MediaStream | null;
    mainCanvas: HTMLCanvasElement | null;
    prevKeepBackground: boolean;
    appliedBackground: boolean;
    videoAlreadyOn: boolean;
    audioOnlyRoom: boolean;
    islevel: string;
    recordStarted: boolean;
    recordResumed: boolean;
    recordPaused: boolean;
    recordStopped: boolean;
    recordingMediaOptions: string;
    mediaDevices: MediaDevices;
    showAlert?: ShowAlert;
    localStreamVideo: MediaStream | null;
    vidCons: VidCons;
    frameRate: number;
    targetResolution: string;
    updateCustomImage: (image: string) => void;
    updateSelectedImage: (image: string) => void;
    updateSegmentVideo: (stream: MediaStream | null) => void;
    updateSelfieSegmentation: (segmentation: SelfieSegmentation | null) => void;
    updatePauseSegmentation: (pause: boolean) => void;
    updateProcessedStream: (stream: MediaStream | null) => void;
    updateKeepBackground: (keep: boolean) => void;
    updateBackgroundHasChanged: (changed: boolean) => void;
    updateVirtualStream: (stream: MediaStream | null) => void;
    updatePrevKeepBackground: (prev: boolean) => void;
    updateAppliedBackground: (applied: boolean) => void;
    videoProducer: Producer | null;
    transportCreated: boolean;
    videoParams: ProducerOptions;
    updateVideoParams: (params: ProducerOptions) => void;
    autoClickBackground: boolean;
    updateAutoClickBackground: (autoClick: boolean) => void;
    createSendTransport: CreateSendTransportType;
    connectSendTransportVideo: ConnectSendTransportVideoType;
    disconnectSendTransportVideo: DisconnectSendTransportVideoType;
    onScreenChanges: OnScreenChangesType;
    sleep: SleepType;
    getUpdatedAllParams: () => BackgroundModalParameters;
    [key: string]: any;
}
export interface BackgroundModalOptions {
    isVisible: boolean;
    onClose: () => void;
    parameters: BackgroundModalParameters;
    position?: string;
    backgroundColor?: string;
    title?: React.ReactNode;
    overlayProps?: React.HTMLAttributes<HTMLDivElement>;
    contentProps?: React.HTMLAttributes<HTMLDivElement>;
    headerProps?: React.HTMLAttributes<HTMLDivElement>;
    titleProps?: React.HTMLAttributes<HTMLHeadingElement>;
    closeButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    closeIconComponent?: React.ReactNode;
    headerDividerProps?: React.HTMLAttributes<HTMLHRElement>;
    bodyProps?: React.HTMLAttributes<HTMLDivElement>;
    defaultImagesContainerProps?: React.HTMLAttributes<HTMLDivElement>;
    uploadWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    uploadLabelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
    uploadLabel?: React.ReactNode;
    uploadInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    mainCanvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
    backgroundCanvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
    captureVideoProps?: React.VideoHTMLAttributes<HTMLVideoElement>;
    previewVideoProps?: React.VideoHTMLAttributes<HTMLVideoElement>;
    loadingOverlayProps?: React.HTMLAttributes<HTMLDivElement>;
    loadingSpinner?: React.ReactNode;
    buttonsWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    applyButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    saveButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    applyButtonLabel?: string;
    applyButtonAppliedLabel?: string;
    saveButtonLabel?: string;
    renderHeader?: (options: {
        defaultHeader: React.ReactNode;
        onClose: () => void;
    }) => React.ReactNode;
    renderButtons?: (options: {
        defaultButtons: React.ReactNode;
        applyButtonRef: React.RefObject<HTMLButtonElement | null>;
        saveButtonRef: React.RefObject<HTMLButtonElement | null>;
    }) => React.ReactNode;
    renderBody?: (options: {
        defaultBody: React.ReactNode;
    }) => React.ReactNode;
    renderContent?: (options: {
        defaultContent: React.ReactNode;
    }) => React.ReactNode;
    /** Theme control - whether dark mode is active */
    isDarkMode?: boolean;
    /** Enable glassmorphism effects (modern UI) */
    enableGlassmorphism?: boolean;
    /** Render mode: modal (default overlay), sidebar (inline for desktop), inline (no wrapper) */
    renderMode?: ModalRenderMode;
}
export type BackgroundModalType = (props: BackgroundModalOptions) => React.JSX.Element;
/**
 * BackgroundModal - Advanced virtual background and blur management interface
 *
 * A sophisticated modal for configuring virtual backgrounds using MediaPipe Selfie Segmentation.
 * Supports image uploads, preset backgrounds, real-time preview, blur effects, and seamless
 * video transport integration. Perfect for professional meetings, virtual events, and privacy
 * enhancement during video calls.
 *
 * Features:
 * - Virtual background image selection from presets
 * - Custom background image upload
 * - Real-time background segmentation (MediaPipe)
 * - Video preview before applying
 * - Background blur effects
 * - Seamless video stream replacement
 * - Canvas-based image processing
 * - Recording-compatible backgrounds
 * - Automatic video transport handling
 * - Memory-efficient stream management
 * - Extensive HTML attributes customization
 * - Custom render hooks for UI flexibility
 *
 * @component
 * @param {BackgroundModalOptions} options - Configuration options
 * @param {boolean} options.isVisible - Modal visibility state
 * @param {Function} options.onClose - Callback when modal is closed
 * @param {BackgroundModalParameters} options.parameters - Background processing parameters
 * @param {string} options.parameters.customImage - Custom uploaded image URL
 * @param {string} options.parameters.selectedImage - Currently selected background
 * @param {MediaStream|null} options.parameters.segmentVideo - Video stream for segmentation
 * @param {SelfieSegmentation|null} options.parameters.selfieSegmentation - MediaPipe instance
 * @param {boolean} options.parameters.pauseSegmentation - Segmentation pause state
 * @param {MediaStream|null} options.parameters.processedStream - Processed output stream
 * @param {boolean} options.parameters.keepBackground - Persist background state
 * @param {boolean} options.parameters.backgroundHasChanged - Background change flag
 * @param {MediaStream|null} options.parameters.virtualStream - Virtual background stream
 * @param {HTMLCanvasElement|null} options.parameters.mainCanvas - Canvas for processing
 * @param {boolean} options.parameters.prevKeepBackground - Previous keep state
 * @param {boolean} options.parameters.appliedBackground - Applied state flag
 * @param {boolean} options.parameters.videoAlreadyOn - Video active state
 * @param {boolean} options.parameters.audioOnlyRoom - Audio-only mode flag
 * @param {string} options.parameters.islevel - User permission level
 * @param {boolean} options.parameters.recordStarted - Recording active
 * @param {boolean} options.parameters.recordResumed - Recording resumed
 * @param {boolean} options.parameters.recordPaused - Recording paused
 * @param {boolean} options.parameters.recordStopped - Recording stopped
 * @param {string} options.parameters.recordingMediaOptions - Recording config
 * @param {MediaDevices} options.parameters.mediaDevices - Browser MediaDevices API
 * @param {ShowAlert} [options.parameters.showAlert] - Alert display function
 * @param {MediaStream|null} options.parameters.localStreamVideo - Local video stream
 * @param {VidCons} options.parameters.vidCons - Video constraints
 * @param {number} options.parameters.frameRate - Target frame rate
 * @param {string} options.parameters.targetResolution - Target resolution
 * @param {Function} options.parameters.updateCustomImage - Update custom image
 * @param {Function} options.parameters.updateSelectedImage - Update selection
 * @param {Function} options.parameters.updateSegmentVideo - Update segment stream
 * @param {Function} options.parameters.updateSelfieSegmentation - Update segmentation
 * @param {Function} options.parameters.updatePauseSegmentation - Update pause state
 * @param {Function} options.parameters.updateProcessedStream - Update processed stream
 * @param {Function} options.parameters.updateKeepBackground - Update persistence
 * @param {Function} options.parameters.updateBackgroundHasChanged - Update change flag
 * @param {Function} options.parameters.updateVirtualStream - Update virtual stream
 * @param {Function} options.parameters.updatePrevKeepBackground - Update prev state
 * @param {Function} options.parameters.updateAppliedBackground - Update applied flag
 * @param {Producer|null} options.parameters.videoProducer - MediaSoup video producer
 * @param {boolean} options.parameters.transportCreated - Transport creation state
 * @param {ProducerOptions} options.parameters.videoParams - Video producer params
 * @param {Function} options.parameters.updateVideoParams - Update producer params
 * @param {boolean} options.parameters.autoClickBackground - Auto-apply on select
 * @param {Function} options.parameters.updateAutoClickBackground - Update auto-apply
 * @param {Function} options.parameters.createSendTransport - Create transport handler
 * @param {Function} options.parameters.connectSendTransportVideo - Connect video handler
 * @param {Function} options.parameters.disconnectSendTransportVideo - Disconnect handler
 * @param {Function} options.parameters.onScreenChanges - Screen change handler
 * @param {Function} options.parameters.sleep - Async delay utility
 * @param {Function} options.parameters.getUpdatedAllParams - Retrieve latest params
 * @param {string} [options.position="topLeft"] - Modal screen position
 * @param {string} [options.backgroundColor="#f5f5f5"] - Modal background color
 * @param {React.ReactNode} [options.title="Background Settings"] - Modal title
 * @param {object} [options.overlayProps] - HTML attributes for overlay
 * @param {object} [options.contentProps] - HTML attributes for content container
 * @param {object} [options.headerProps] - HTML attributes for header
 * @param {object} [options.titleProps] - HTML attributes for title
 * @param {object} [options.closeButtonProps] - HTML attributes for close button
 * @param {React.ReactNode} [options.closeIconComponent] - Custom close icon
 * @param {object} [options.headerDividerProps] - HTML attributes for divider
 * @param {object} [options.bodyProps] - HTML attributes for body
 * @param {object} [options.defaultImagesContainerProps] - HTML attributes for image grid
 * @param {object} [options.uploadWrapperProps] - HTML attributes for upload wrapper
 * @param {object} [options.uploadLabelProps] - HTML attributes for upload label
 * @param {React.ReactNode} [options.uploadLabel] - Custom upload label
 * @param {object} [options.uploadInputProps] - HTML attributes for file input
 * @param {object} [options.mainCanvasProps] - HTML attributes for main canvas
 * @param {object} [options.backgroundCanvasProps] - HTML attributes for bg canvas
 * @param {object} [options.captureVideoProps] - HTML attributes for capture video
 * @param {object} [options.previewVideoProps] - HTML attributes for preview video
 * @param {object} [options.loadingOverlayProps] - HTML attributes for loading overlay
 * @param {React.ReactNode} [options.loadingSpinner] - Custom loading spinner
 * @param {object} [options.buttonsWrapperProps] - HTML attributes for buttons wrapper
 * @param {object} [options.applyButtonProps] - HTML attributes for apply button
 * @param {object} [options.saveButtonProps] - HTML attributes for save button
 * @param {string} [options.applyButtonLabel] - Custom apply button text
 * @param {string} [options.applyButtonAppliedLabel] - Custom applied button text
 * @param {string} [options.saveButtonLabel] - Custom save button text
 * @param {Function} [options.renderHeader] - Custom header renderer
 * @param {Function} [options.renderButtons] - Custom buttons renderer
 * @param {Function} [options.renderBody] - Custom body renderer
 * @param {Function} [options.renderContent] - Custom content renderer
 *
 * @returns {React.JSX.Element | null} Rendered background modal or null if not visible
 *
 * @example
 * // Basic virtual background selector
 * ```tsx
 * import React, { useState } from 'react';
 * import { BackgroundModal } from 'mediasfu-reactjs';
 *
 * function BackgroundControl({ parameters }) {
 *   const [isVisible, setIsVisible] = useState(false);
 *
 *   return (
 *     <>
 *       <button onClick={() => setIsVisible(true)}>
 *         Virtual Background {parameters.appliedBackground ? '✓' : ''}
 *       </button>
 *       <BackgroundModal
 *         isVisible={isVisible}
 *         onClose={() => setIsVisible(false)}
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
 * // Custom styled with preview status
 * ```tsx
 * import { BackgroundModal } from 'mediasfu-reactjs';
 *
 * function BrandedBackground({ isVisible, onClose, parameters }) {
 *   return (
 *     <BackgroundModal
 *       isVisible={isVisible}
 *       onClose={onClose}
 *       parameters={parameters}
 *       backgroundColor="#1e3a8a"
 *       position="topLeft"
 *       contentProps={{
 *         style: {
 *           maxHeight: '90vh',
 *           borderRadius: 20,
 *           border: '2px solid #3b82f6',
 *         },
 *       }}
 *       applyButtonProps={{
 *         style: {
 *           background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
 *           color: 'white',
 *           padding: '12px 28px',
 *           borderRadius: 12,
 *           fontWeight: 600,
 *         },
 *       }}
 *       saveButtonProps={{
 *         style: {
 *           background: 'linear-gradient(135deg, #22c55e 0%, #14532d 100%)',
 *           color: 'white',
 *           padding: '12px 28px',
 *           borderRadius: 12,
 *           fontWeight: 600,
 *         },
 *       }}
 *       title={
 *         <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
 *           <span>Virtual Background</span>
 *           {parameters.appliedBackground && (
 *             <span style={{ fontSize: 14, color: '#22c55e' }}>● Active</span>
 *           )}
 *         </div>
 *       }
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * // Analytics tracking for background changes
 * ```tsx
 * import { BackgroundModal } from 'mediasfu-reactjs';
 *
 * function AnalyticsBackground({ isVisible, onClose, parameters }) {
 *   return (
 *     <BackgroundModal
 *       isVisible={isVisible}
 *       onClose={onClose}
 *       parameters={{
 *         ...parameters,
 *         updateAppliedBackground: (applied) => {
 *           if (applied) {
 *             analytics.track('virtual_background_applied', {
 *               backgroundType: parameters.selectedImage === 'none' ? 'none' :
 *                              parameters.selectedImage === 'blur' ? 'blur' : 'image',
 *               customImage: !!parameters.customImage,
 *             });
 *           }
 *           parameters.updateAppliedBackground(applied);
 *         },
 *       }}
 *       renderBody={({ defaultBody }) => {
 *         return (
 *           <div>
 *             <div style={{
 *               padding: 12,
 *               background: '#f8fafc',
 *               borderRadius: 8,
 *               marginBottom: 16,
 *             }}>
 *               <div style={{ fontWeight: 600, marginBottom: 4 }}>
 *                 Background Status
 *               </div>
 *               <div style={{ fontSize: 14 }}>
 *                 {parameters.appliedBackground
 *                   ? `Active: ${parameters.selectedImage}`
 *                   : 'No background applied'}
 *               </div>
 *             </div>
 *             {defaultBody}
 *           </div>
 *         );
 *       }}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * // Override with MediasfuGeneric uiOverrides
 * ```tsx
 * import { MediasfuGeneric, BackgroundModal } from 'mediasfu-reactjs';
 *
 * const uiOverrides = {
 *   backgroundModal: {
 *     component: (props) => (
 *       <BackgroundModal
 *         {...props}
 *         backgroundColor="#0f172a"
 *         position="topRight"
 *         applyButtonProps={{
 *           style: {
 *             background: '#3b82f6',
 *             borderRadius: 12,
 *             padding: '12px 28px',
 *             fontWeight: 600,
 *           },
 *         }}
 *         saveButtonProps={{
 *           style: {
 *             background: '#22c55e',
 *             borderRadius: 12,
 *             padding: '12px 28px',
 *             fontWeight: 600,
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
declare const BackgroundModal: React.FC<BackgroundModalOptions>;
export default BackgroundModal;
//# sourceMappingURL=BackgroundModal.d.ts.map