
 
import React, { useEffect, useRef, FC } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation"; 
import { ConnectSendTransportVideoType, CreateSendTransportType, CreateSendTransportParameters, OnScreenChangesType,
  DisconnectSendTransportVideoType, OnScreenChangesParameters, ShowAlert, SleepType, VidCons, ConnectSendTransportVideoParameters, DisconnectSendTransportVideoParameters, } from "../../@types/types";
import { Producer, ProducerOptions } from "mediasoup-client/lib/types";

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
  updateSelfieSegmentation: (
    segmentation: SelfieSegmentation | null
  ) => void;
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
  
  // mediasfu functions
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
}

// Export the type definition
export type BackgroundModalType = (props: BackgroundModalOptions) => React.JSX.Element

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

const BackgroundModal: React.FC<BackgroundModalOptions> = ({
  isVisible,
  onClose,
  parameters,
  position = "topLeft",
  backgroundColor = "#f5f5f5",
  title = "Background Settings",
  overlayProps,
  contentProps,
  headerProps,
  titleProps,
  closeButtonProps,
  closeIconComponent,
  headerDividerProps,
  bodyProps,
  defaultImagesContainerProps,
  uploadWrapperProps,
  uploadLabelProps,
  uploadLabel = "Upload Custom Image",
  uploadInputProps,
  mainCanvasProps,
  backgroundCanvasProps,
  captureVideoProps,
  previewVideoProps,
  loadingOverlayProps,
  loadingSpinner,
  buttonsWrapperProps,
  applyButtonProps,
  saveButtonProps,
  applyButtonLabel = "Preview Background",
  applyButtonAppliedLabel = "Apply Background",
  saveButtonLabel = "Save Background",
  renderHeader,
  renderButtons,
  renderBody,
  renderContent,
}) => {

  let {
    customImage,
    selectedImage,
    segmentVideo,
    selfieSegmentation,
    pauseSegmentation,
    processedStream,
    keepBackground,
    backgroundHasChanged,
    virtualStream,
    mainCanvas,
    prevKeepBackground,
    appliedBackground,
    videoAlreadyOn,
    audioOnlyRoom,
    islevel,
    recordStarted,
    recordResumed,
    recordPaused,
    recordStopped,
    recordingMediaOptions,
    mediaDevices,
    showAlert,
    localStreamVideo,
    vidCons,
    frameRate,
    targetResolution,
    updateCustomImage,
    updateSelectedImage,
    updateSegmentVideo,
    updateSelfieSegmentation,
    updatePauseSegmentation,
    updateProcessedStream,
    updateKeepBackground,
    updateBackgroundHasChanged,
    updateVirtualStream,

    updatePrevKeepBackground,
    updateAppliedBackground,
    videoProducer,
    transportCreated,
    videoParams,
    updateVideoParams,
    autoClickBackground,
    updateAutoClickBackground,

    createSendTransport,
    connectSendTransportVideo,
    disconnectSendTransportVideo,
    onScreenChanges,
    sleep,
  } = parameters;

  const defaultImagesContainerRef = useRef<HTMLDivElement>(null);
  const uploadImageInputRef = useRef<HTMLInputElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const captureVideoRef = useRef<HTMLVideoElement>(null);
  const loadingOverlayRef = useRef<HTMLDivElement>(null);
  const applyBackgroundButtonRef = useRef<HTMLButtonElement>(null);
  const saveBackgroundButtonRef = useRef<HTMLButtonElement>(null);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);

  const defaultOverlayWidth =
    typeof window !== "undefined" ? Math.min(window.innerWidth * 0.8, 500) : 360;

  const {
    className: overlayClassName,
    style: overlayStyleOverrides,
    ...restOverlayProps
  } = overlayProps ?? {};

  const overlayClassNames = [
    "mediasfu-background-modal",
    overlayClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: isVisible ? "block" : "none",
    zIndex: 999,
    ...overlayStyleOverrides,
  };

  const {
    className: contentClassName,
    style: contentStyleOverrides,
    ...restContentProps
  } = contentProps ?? {};

  const contentClassNames = [
    "mediasfu-background-modal__content",
    contentClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const contentStyle: React.CSSProperties = {
    position: "fixed",
    backgroundColor,
    borderRadius: 10,
    padding: 16,
    width: defaultOverlayWidth,
    maxWidth: defaultOverlayWidth,
    maxHeight: "75%",
    overflow: "hidden",
    top: position.includes("top") ? 10 : "auto",
    bottom: position.includes("bottom") ? 10 : "auto",
    left: position.includes("Left") ? 10 : "auto",
    right: position.includes("Right") ? 10 : "auto",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
    ...contentStyleOverrides,
  };

  const {
    className: headerClassName,
    style: headerStyleOverrides,
    ...restHeaderProps
  } = headerProps ?? {};

  const headerClassNames = [
    "modal-header",
    headerClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    ...headerStyleOverrides,
  };

  const {
    className: titleClassName,
    style: titleStyleOverrides,
    ...restTitleProps
  } = titleProps ?? {};

  const titleClassNames = [
    "modal-title",
    titleClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "black",
    ...titleStyleOverrides,
  };

  const {
    className: closeButtonClassName,
    style: closeButtonStyleOverrides,
    onClick: closeButtonOnClick,
    ...restCloseButtonProps
  } = closeButtonProps ?? {};

  const closeButtonClassNames = [
    "btn-close-background",
    closeButtonClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const closeButtonStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    padding: 4,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "black",
    ...closeButtonStyleOverrides,
  };

  const defaultCloseIcon = closeIconComponent ?? (
    <FontAwesomeIcon icon={faTimes} className="icon" />
  );

  const handleCloseClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    closeButtonOnClick?.(event);
    if (!event.defaultPrevented) {
      onClose();
    }
  };

  const {
    style: headerDividerStyleOverrides,
    ...restHeaderDividerProps
  } = headerDividerProps ?? {};

  const headerDividerStyle: React.CSSProperties = {
    height: 1,
    backgroundColor: "black",
    marginTop: 5,
    marginBottom: 5,
    border: "none",
    ...headerDividerStyleOverrides,
  };

  const {
    className: bodyClassName,
    style: bodyStyleOverrides,
    ...restBodyProps
  } = bodyProps ?? {};

  const bodyClassNames = [
    "modal-body",
    bodyClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const bodyStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    overflowY: "auto",
    paddingRight: 4,
    ...bodyStyleOverrides,
  };

  const {
    className: imagesContainerClassName,
    style: imagesContainerStyleOverrides,
    ...restImagesContainerProps
  } = defaultImagesContainerProps ?? {};

  const imagesContainerClassNames = [
    "background-modal__thumbnails",
    imagesContainerClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const imagesContainerStyle: React.CSSProperties = {
    maxWidth: "95%",
    overflowX: "auto",
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    ...imagesContainerStyleOverrides,
  };

  const {
    className: uploadWrapperClassName,
    style: uploadWrapperStyleOverrides,
    ...restUploadWrapperProps
  } = uploadWrapperProps ?? {};

  const uploadWrapperClassNames = [
    "background-modal__upload",
    "form-group",
    uploadWrapperClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const uploadWrapperStyle: React.CSSProperties = {
    maxWidth: "70%",
    overflowX: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    ...uploadWrapperStyleOverrides,
  };

  const {
    className: uploadLabelClassName,
    style: uploadLabelStyleOverrides,
    ...restUploadLabelProps
  } = uploadLabelProps ?? {};

  const uploadLabelClassNames = [
    uploadLabelClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const uploadLabelStyle: React.CSSProperties = {
    fontWeight: 600,
    ...uploadLabelStyleOverrides,
  };

  const {
    className: uploadInputClassName,
    style: uploadInputStyleOverrides,
    ...restUploadInputProps
  } = uploadInputProps ?? {};

  const uploadInputClassNames = [
    "form-control",
    uploadInputClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const uploadInputStyle: React.CSSProperties = {
    ...uploadInputStyleOverrides,
  };

  const {
    className: mainCanvasClassName,
    style: mainCanvasStyleOverrides,
    ...restMainCanvasProps
  } = mainCanvasProps ?? {};

  const mainCanvasClassNames = [
    "d-none",
    mainCanvasClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const mainCanvasStyle: React.CSSProperties = {
    ...mainCanvasStyleOverrides,
  };

  const {
    className: backgroundCanvasClassName,
    style: backgroundCanvasStyleOverrides,
    ...restBackgroundCanvasProps
  } = backgroundCanvasProps ?? {};

  const backgroundCanvasClassNames = [
    "d-none",
    backgroundCanvasClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const backgroundCanvasStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "100%",
    height: "auto",
    backgroundColor: "transparent",
    border: "1px solid black",
    ...backgroundCanvasStyleOverrides,
  };

  const {
    className: captureVideoClassName,
    style: captureVideoStyleOverrides,
    ...restCaptureVideoProps
  } = captureVideoProps ?? {};

  const captureVideoClassNames = [
    "d-none",
    captureVideoClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const captureVideoStyle: React.CSSProperties = {
    ...captureVideoStyleOverrides,
  };

  const {
    className: previewVideoClassName,
    style: previewVideoStyleOverrides,
    ...restPreviewVideoProps
  } = previewVideoProps ?? {};

  const previewVideoClassNames = [
    "d-none",
    previewVideoClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const previewVideoStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "400px",
    height: "auto",
    backgroundColor: "transparent",
    border: "1px solid black",
    ...previewVideoStyleOverrides,
  };

  const {
    className: loadingOverlayClassName,
    style: loadingOverlayStyleOverrides,
    ...restLoadingOverlayProps
  } = loadingOverlayProps ?? {};

  const loadingOverlayClassNames = [
    loadingOverlayClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const loadingOverlayStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    ...loadingOverlayStyleOverrides,
  };

  const {
    className: buttonsWrapperClassName,
    style: buttonsWrapperStyleOverrides,
    ...restButtonsWrapperProps
  } = buttonsWrapperProps ?? {};

  const buttonsWrapperClassNames = [
    "background-modal__buttons",
    buttonsWrapperClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const buttonsWrapperStyle: React.CSSProperties = {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
    ...buttonsWrapperStyleOverrides,
  };

  const {
    className: applyButtonClassName,
    style: applyButtonStyleOverrides,
    onClick: applyButtonOnClick,
    ...restApplyButtonProps
  } = applyButtonProps ?? {};

  const applyButtonClassNames = [
    "btn",
    "btn-primary",
    applyButtonClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const applyButtonStyle: React.CSSProperties = {
    ...applyButtonStyleOverrides,
  };

  const {
    className: saveButtonClassName,
    style: saveButtonStyleOverrides,
    onClick: saveButtonOnClick,
    ...restSaveButtonProps
  } = saveButtonProps ?? {};

  const saveButtonClassNames = [
    "btn",
    "btn-success",
    "d-none",
    saveButtonClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const saveButtonStyle: React.CSSProperties = {
    ...saveButtonStyleOverrides,
  };

  const previewLabel = applyButtonLabel ?? "Preview Background";
  const appliedLabel = applyButtonAppliedLabel ?? previewLabel;

  useEffect(() => {
    if (isVisible) {
      if (!selfieSegmentation) {
        preloadModel().catch(() => console.log("Error preloading model:"));
      }
      renderDefaultImages();
      if (selectedImage) {
        loadImageToCanvas(selectedImage, selectedImage);
      } else {
        clearCanvas();
      }
      saveBackgroundButtonRef.current?.classList.add("d-none");
      saveBackgroundButtonRef.current!.disabled = true;
      applyBackgroundButtonRef.current?.classList.remove("d-none");
      applyBackgroundButtonRef.current!.disabled = false;

      if (
        processedStream &&
        prevKeepBackground == keepBackground &&
        keepBackground &&
        appliedBackground
      ) {
        applyBackgroundButtonRef.current!.innerText = appliedLabel;
      } else {
        applyBackgroundButtonRef.current!.innerText = previewLabel;
      }

      if (autoClickBackground) {
        applyBackground().then(async () => {
          await saveBackground();
          autoClickBackground = false;
          updateAutoClickBackground(autoClickBackground);
        });
      }
    } else {
      try {
        if (
          !appliedBackground ||
          (appliedBackground && !keepBackground) ||
          (appliedBackground && !videoAlreadyOn)
        ) {
          const refVideo = captureVideoRef.current;
          pauseSegmentation = true;
          updatePauseSegmentation(true);
          if (!videoAlreadyOn) {
            try {
              if (refVideo) {
                if (refVideo.srcObject instanceof MediaStream) {
                  refVideo.srcObject
                    .getTracks()
                    .forEach((track) => track.stop());
                }
                refVideo.srcObject = null;
              }

              if (segmentVideo) {
                segmentVideo
                  .getTracks()
                  .forEach((track: MediaStreamTrack) => track.stop());
                segmentVideo = null;
              }

              if (virtualStream) {
                virtualStream
                  .getTracks()
                  .forEach((track: MediaStreamTrack) => track.stop());
                virtualStream = null;
              }

              updateSegmentVideo(segmentVideo);
              updateVirtualStream(virtualStream);
            } catch { /* Handle error */}
          }
        }

        videoPreviewRef.current?.classList.add("d-none");
        backgroundCanvasRef.current?.classList.remove("d-none");
      } catch { /* Handle error */}
    }
  }, [isVisible]);

  const clonedStream = useRef<MediaStream | null>(null);
  const clonedTrack = useRef<MediaStreamTrack | null>(null);

  const renderDefaultImages = () => {
    const defaultImages = [
      'wall',
      'wall2',
      'shelf',
      'clock',
      'desert',
      'flower',
    ];

    const defaultImagesContainer = defaultImagesContainerRef.current;
    if (!defaultImagesContainer) return;

    defaultImagesContainer.innerHTML = "";

    defaultImages.forEach((baseName) => {
      const thumb = `https://mediasfu.com/images/backgrounds/${baseName}_thumbnail.jpg`;
      const small = `https://mediasfu.com/images/backgrounds/${baseName}_small.jpg`;
      const large = `https://mediasfu.com/images/backgrounds/${baseName}_large.jpg`;
      const full = `https://mediasfu.com/images/backgrounds/${baseName}.jpg`
      const img = document.createElement("img");
      img.src = thumb;
      img.classList.add("img-thumbnail", "m-1");
      img.style.width = "80px";
      img.style.cursor = "pointer";
      img.addEventListener("click", async () => {
        if (targetResolution == 'fhd' || targetResolution =='qhd') {
             await loadImageToCanvas(small, large);
        } else {
              await loadImageToCanvas(small, full);
        }
      });
      defaultImagesContainer.appendChild(img);
    });

    const noBackgroundImg = document.createElement("div");
    noBackgroundImg.classList.add(
      "img-thumbnail",
      "m-1",
      "d-flex",
      "align-items-center",
      "justify-content-center"
    );
    noBackgroundImg.style.width = "76px";
    noBackgroundImg.style.minHeight = "60px";
    noBackgroundImg.style.cursor = "pointer";
    noBackgroundImg.style.backgroundColor = "#f8f9fa";
    noBackgroundImg.style.border = "1px solid #dee2e6";
    noBackgroundImg.style.position = "relative";
    noBackgroundImg.innerHTML =
      '<span style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); color:#000;">None</span>';
    noBackgroundImg.addEventListener("click", () => {
      selectedImage = "";
      updateSelectedImage(selectedImage);
      updateCustomImage("");

      showLoading(); // Show loading indicator
      videoPreviewRef.current?.classList.add("d-none");
      backgroundCanvasRef.current?.classList.remove("d-none");
      clearCanvas();
      hideLoading(); // Hide loading indicator after loading
    });
    defaultImagesContainer.appendChild(noBackgroundImg);

    // Load custom image if it exists
    if (customImage) {
      const img = document.createElement("img");
      img.src = customImage;
      img.classList.add("img-thumbnail", "m-1");
      img.style.width = "80px";
      img.style.cursor = "pointer";
      img.addEventListener("click", () => {
        if (customImage) {
          loadImageToCanvas(customImage, customImage);
        }
      });
      defaultImagesContainer.appendChild(img);
    }
  };

  async function preloadModel() {
    selfieSegmentation = new SelfieSegmentation({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
    });

    selfieSegmentation.setOptions({
      modelSelection: 1,
      selfieMode: false,
    });

    await selfieSegmentation.initialize();
    updateSelfieSegmentation(selfieSegmentation);
  }

  const showLoading = () => {
    loadingOverlayRef.current?.classList.remove("d-none");
  };

  const hideLoading = () => {
    loadingOverlayRef.current?.classList.add("d-none");
  };

  const clearCanvas = () => {
    const ctx = backgroundCanvasRef.current?.getContext("2d");
    if (!ctx || !backgroundCanvasRef.current) return;
    ctx.clearRect(
      0,
      0,
      backgroundCanvasRef.current.width,
      backgroundCanvasRef.current.height
    );
    ctx.font = "30px Arial";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "No Background",
      backgroundCanvasRef.current.width / 2,
      backgroundCanvasRef.current.height / 2
    );

    saveBackgroundButtonRef.current?.classList.add("d-none");
    applyBackgroundButtonRef.current?.classList.remove("d-none");
    applyBackgroundButtonRef.current!.disabled = false;
    if (
      processedStream &&
      prevKeepBackground == keepBackground &&
      keepBackground &&
      appliedBackground
    ) {
        applyBackgroundButtonRef.current!.innerText = appliedLabel;
    } else {
        applyBackgroundButtonRef.current!.innerText = previewLabel;
    }
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (file) {
        // Validate file size
        if (file.size > 2048 * 2048) {
          // 2MB
          showAlert?.({
            message: "File size must be less than 2MB.",
            type: "danger",
          });
          return;
        }

        
        let minWidth = 1280;
        let minHeight = 1280;
        let maxWidth = 2560;
        let maxHeight = 2560;

        if (targetResolution == 'fhd') {
          minWidth = 1920;
          minHeight = 1920;
        } else if (targetResolution == 'qhd') {
          minWidth = 2560;
          minHeight = 2560;
        } // For other resolutions, stick to the default 1280x1280

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          // Validate image dimensions
          if ((img.width < minWidth || img.height < minHeight) || (img.width > maxWidth || img.height > maxHeight)) {
            showAlert?.({
              message: `Image dimensions must be at least ${minWidth}x${minHeight}.`,
              type: "danger",
            });
            return;
          }

          // Load valid image to canvas and set as custom image
          customImage = img.src;
          updateCustomImage(customImage);
          loadImageToCanvas(img.src, img.src);
        };

        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && e.target.result) {
            img.src = e.target.result.toString();
          }
        };
        reader.readAsDataURL(file);
      }
    } catch { /* Handle error */}
  };

  const loadImageToCanvas = async (src: string, fullSrc: string) => {
    showLoading();
    backgroundCanvasRef.current?.classList.remove("d-none");
    videoPreviewRef.current?.classList.add("d-none");

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = async () => {
      const ctx = backgroundCanvasRef.current?.getContext("2d");
      if (!ctx || !backgroundCanvasRef.current) return;
      backgroundCanvasRef.current.width = img.width;
      backgroundCanvasRef.current.height = img.height;
      ctx.drawImage(img, 0, 0);
      removeBackground(img);
      hideLoading();
    };
    img.src = src;
    selectedImage = fullSrc;
    updateSelectedImage(selectedImage);

    saveBackgroundButtonRef.current?.classList.add("d-none");
    saveBackgroundButtonRef.current!.disabled = true;
    applyBackgroundButtonRef.current?.classList.remove("d-none");
    applyBackgroundButtonRef.current!.disabled = false;

    if (
      processedStream &&
      prevKeepBackground == keepBackground &&
      keepBackground &&
      appliedBackground
    ) {
  applyBackgroundButtonRef.current!.innerText = appliedLabel;
    } else {
  applyBackgroundButtonRef.current!.innerText = previewLabel;
    }
  };

  const removeBackground = (img: HTMLImageElement) => {
    const ctx = backgroundCanvasRef.current?.getContext("2d");
    if (!ctx || !backgroundCanvasRef.current) return;
    ctx.clearRect(
      0,
      0,
      backgroundCanvasRef.current.width,
      backgroundCanvasRef.current.height
    );
    ctx.drawImage(img, 0, 0);
  };

  const applyBackground = async () => {
    if (audioOnlyRoom) {
      showAlert?.({
        message: "You cannot use a background in an audio only event.",
        type: "danger",
      });
      return;
    }

    showLoading();

    videoPreviewRef.current?.classList.remove("d-none");
    backgroundCanvasRef.current?.classList.add("d-none");

    const doSegmentation = !!selectedImage;
    pauseSegmentation = false;
    updatePauseSegmentation(false);
    await selfieSegmentationPreview(doSegmentation);
    hideLoading();

    applyBackgroundButtonRef.current?.classList.add("d-none");
    applyBackgroundButtonRef.current!.disabled = true;

    if (
      processedStream &&
      prevKeepBackground == keepBackground &&
      keepBackground &&
      appliedBackground
    ) {
      saveBackgroundButtonRef.current?.classList.add("d-none");
      saveBackgroundButtonRef.current!.disabled = true;
    } else {
      saveBackgroundButtonRef.current?.classList.remove("d-none");
      saveBackgroundButtonRef.current!.disabled = false;
    }
  };

  const selfieSegmentationPreview = async (doSegmentation: boolean) => {
    const refVideo = captureVideoRef.current;
    const previewVideo = videoPreviewRef.current;
    const virtualImage = new Image();
    virtualImage.crossOrigin = "anonymous";
    virtualImage.src = selectedImage || "";

    if (!mainCanvas) {
      mainCanvas = mainCanvasRef.current;
    }

    if (!mainCanvas || !refVideo || !previewVideo) return;

    const mediaCanvas = mainCanvas;
    mediaCanvas.width = refVideo.videoWidth;
    mediaCanvas.height = refVideo.videoHeight;
    let ctx = mediaCanvas.getContext("2d");

    backgroundHasChanged = true;
    updateBackgroundHasChanged(true);
    prevKeepBackground = keepBackground;
    updatePrevKeepBackground(keepBackground);

    if (!doSegmentation) {
      const tracks = processedStream?.getVideoTracks();
      tracks?.forEach((track: MediaStreamTrack) => track.stop());
      processedStream = null;
      keepBackground = false;
      updateProcessedStream(null);
      updateKeepBackground(false);
      previewVideo.classList.remove("d-none");
    }

    const segmentImage = async (videoElement: HTMLVideoElement) => {
      try {
        const processFrame = () => {
          if (
            !selfieSegmentation ||
            pauseSegmentation ||
            !videoElement ||
            videoElement.videoWidth === 0 ||
            videoElement.videoHeight === 0
          ) {
            return;
          }
          
            selfieSegmentation.send({ image: videoElement });
            requestAnimationFrame(processFrame);
        };

        videoElement.onloadeddata = () => {
          processFrame();
        };

        setTimeout(async () => {
          processedStream = mediaCanvas.captureStream(frameRate || 5);
          previewVideo.srcObject = processedStream;
          updateProcessedStream(processedStream);
          previewVideo.classList.remove("d-none");
          keepBackground = true;
          updateKeepBackground(keepBackground);

          if (previewVideo.paused) {
            try {
              await previewVideo.play();
            } catch { /* Handle error */}
          }
        }, 100);
      } catch { /* Handle error */}
    };

    if (videoAlreadyOn) {
      if (
        clonedTrack.current &&
        clonedTrack.current.readyState === "live" &&
        localStreamVideo!.getVideoTracks()[0]?.label ===
          clonedTrack.current?.label
      ) {
        // Use the cloned track
      } else {
        const localTracks = localStreamVideo!.getVideoTracks()[0];
        clonedTrack.current = localTracks.clone();
        if (clonedTrack.current) {
          clonedStream.current = new MediaStream([clonedTrack.current]);
        }
        segmentVideo = clonedStream.current;
        updateSegmentVideo(segmentVideo);
      }
      refVideo.srcObject = segmentVideo;
      if (refVideo.paused) {
        refVideo.play();
      }
      refVideo.width =
        segmentVideo!.getVideoTracks()[0]?.getSettings().width || 0;
      refVideo.height =
        segmentVideo!.getVideoTracks()[0]?.getSettings().height || 0;
      mediaCanvas.width = refVideo.width;
      mediaCanvas.height = refVideo.height;
      ctx = mediaCanvas.getContext("2d");

      try {
        if (doSegmentation) {
          await segmentImage(refVideo);
        } else {
          previewVideo.srcObject = clonedStream.current || localStreamVideo
        }
      } catch (error) {
        console.log("Error segmenting image:", error);
      }
    } else {
      if (
        segmentVideo &&
        segmentVideo.getVideoTracks()[0]?.readyState === "live"
      ) {
        // Use the existing segment video
      } else {
        try {
          const stream = await mediaDevices.getUserMedia({
            video: { ...vidCons, frameRate: { ideal: frameRate } },
            audio: false,
          });
          segmentVideo = stream;
          updateSegmentVideo(segmentVideo);
          refVideo.srcObject = segmentVideo;
          if (refVideo.paused) {
            refVideo.play();
          }
        } catch {
          // remove the frameRate constraint and try again
          try {
            const stream = await mediaDevices.getUserMedia({
              video: { ...vidCons },
              audio: false,
            });
            segmentVideo = stream;
            updateSegmentVideo(segmentVideo);
            refVideo.srcObject = segmentVideo;
            if (refVideo.paused) {
              refVideo.play();
            }
          } catch (error) {
            console.log("Error getting user media:", error);
          }
        }

        refVideo.width =
          segmentVideo!.getVideoTracks()[0]?.getSettings().width || 0;
        refVideo.height =
          segmentVideo!.getVideoTracks()[0]?.getSettings().height || 0;
        mediaCanvas.width = refVideo.width;
        mediaCanvas.height = refVideo.height;
        ctx = mediaCanvas.getContext("2d");
      }

      try {
        if (doSegmentation) {
          await segmentImage(refVideo);
        } else {
          previewVideo.srcObject = refVideo.srcObject;
        }
      } catch { /* Handle error */}
    }

    let repeatPattern = 'no-repeat';
    try {
      if (virtualImage.width < mediaCanvas.width || virtualImage.height < mediaCanvas.height) {
        repeatPattern = 'repeat'; 
      }
    } catch {
      // Handle error
    }

    const onResults = (results: any) => {
      try {
        if (
          !pauseSegmentation &&
          mediaCanvas &&
          mediaCanvas.width > 0 &&
          mediaCanvas.height > 0 &&
          virtualImage &&
          virtualImage.width > 0 &&
          virtualImage.height > 0
        ) {
          ctx!.save();
          ctx!.clearRect(0, 0, mediaCanvas.width, mediaCanvas.height);
          ctx!.drawImage(
            results.segmentationMask,
            0,
            0,
            mediaCanvas.width,
            mediaCanvas.height
          );

          ctx!.globalCompositeOperation = "source-out";
          const pat = ctx!.createPattern(virtualImage, repeatPattern);
          ctx!.fillStyle = pat || "";
          ctx!.fillRect(0, 0, mediaCanvas.width, mediaCanvas.height);

          ctx!.globalCompositeOperation = "destination-atop";
          ctx!.drawImage(
            results.image,
            0,
            0,
            mediaCanvas.width,
            mediaCanvas.height
          );

          ctx!.restore();
        }
      } catch (error) {
        console.log("Error applying background:", error);
      }
    };

    if (!selfieSegmentation) {
      await preloadModel().catch(() => console.log("Error preloading model: "));
    }

    try {
      selfieSegmentation!.onResults(onResults);
    } catch { /* Handle error */}
  };

  const saveBackground = async () => {
    if (audioOnlyRoom) {
      showAlert?.({
        message: "You cannot use a background in an audio only event.",
        type: "danger",
      });
      return;
    } else if (backgroundHasChanged) {
      if (videoAlreadyOn) {
        if (islevel === "2" && (recordStarted || recordResumed)) {
          if (!(recordPaused || recordStopped)) {
            if (recordingMediaOptions === "video") {
              showAlert?.({
                message:
                  "Please pause the recording before changing the background.",
                type: "danger",
              });
              return;
            }
          }
        }

        if (keepBackground && selectedImage && processedStream) {
          virtualStream = processedStream;
          updateVirtualStream(virtualStream);
          videoParams = { track: virtualStream.getVideoTracks()[0] };
          updateVideoParams(videoParams);
        } else {
          if (
            localStreamVideo &&
            localStreamVideo.getVideoTracks()[0]?.readyState === "live"
          ) {
            videoParams = { track: localStreamVideo.getVideoTracks()[0] };
            updateVideoParams(videoParams);
          } else {
            try {
              if (
                localStreamVideo &&
                localStreamVideo.getVideoTracks()[0]?.readyState !== "live"
              ) {
                localStreamVideo.removeTrack(
                  localStreamVideo.getVideoTracks()[0]
                );
                const clonedTrack = segmentVideo?.getVideoTracks()[0]?.clone();
                if (clonedTrack) {
                  localStreamVideo.addTrack(clonedTrack);
                }
              }
            } catch (error) {
              console.log("Error handling local stream video:", error);
            }

            videoParams = {
              track: clonedStream.current?.getVideoTracks()[0] || undefined,
            };
            updateVideoParams(videoParams);
          }
        }

        if (keepBackground) {
          appliedBackground = true;
          updateAppliedBackground(appliedBackground);
        } else {
          appliedBackground = false;
          updateAppliedBackground(appliedBackground);
        }

        if (!transportCreated) {
          await createSendTransport({
            option: "video",
            parameters: { ...parameters, videoParams },
          });
        } else {
          try {
            if (videoProducer?.id) {
              if (videoProducer.track?.id !== videoParams.track?.id) {
                await disconnectSendTransportVideo({ parameters });
                await sleep({ms: 500});
              }
            }
            await connectSendTransportVideo({ videoParams, parameters });
          } catch { /* Handle error */}
        }
        await onScreenChanges({ changed: true, parameters });
      }
    }

    if (keepBackground) {
      appliedBackground = true;
      updateAppliedBackground(appliedBackground);
    } else {
      appliedBackground = false;
      updateAppliedBackground(appliedBackground);
    }

    saveBackgroundButtonRef.current?.classList.add("d-none");
    saveBackgroundButtonRef.current!.disabled = true;
  };

  const Spinner: FC = () => {
    // Defining the style object with proper typing
    const spinnerStyle: React.CSSProperties = {
      width: "50px",
      height: "50px",
      border: "5px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "50%",
      borderTop: "5px solid white",
      animation: "spin 1s linear infinite",
    };

    const keyframesStyle: string = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

    return (
      <>
        <style>{keyframesStyle}</style>
        <div style={spinnerStyle}></div>
      </>
    );
  };

  const loadingSpinnerNode = loadingSpinner ?? <Spinner />;

  const handleApplyButtonClick: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    applyButtonOnClick?.(event);
    if (!event.defaultPrevented) {
      void applyBackground();
    }
  };

  const handleSaveButtonClick: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    saveButtonOnClick?.(event);
    if (!event.defaultPrevented) {
      void saveBackground();
    }
  };

  const buildHeader = () => {
    const defaultHeader = (
      <div className={headerClassNames} style={headerStyle} {...restHeaderProps}>
        <h2 className={titleClassNames} style={titleStyle} {...restTitleProps}>
          {title}
        </h2>
        <button
          type="button"
          className={closeButtonClassNames}
          style={closeButtonStyle}
          onClick={handleCloseClick}
          {...restCloseButtonProps}
        >
          {defaultCloseIcon}
        </button>
      </div>
    );

    return renderHeader ? renderHeader({ defaultHeader, onClose }) : defaultHeader;
  };

  const buildButtons = () => {
    const defaultButtons = (
      <div
        className={buttonsWrapperClassNames}
        style={buttonsWrapperStyle}
        {...restButtonsWrapperProps}
      >
        <button
          type="button"
          id="applyBackgroundButton"
          ref={applyBackgroundButtonRef}
          className={applyButtonClassNames}
          style={applyButtonStyle}
          onClick={handleApplyButtonClick}
          {...restApplyButtonProps}
        >
          {previewLabel}
        </button>
        <button
          type="button"
          id="saveBackgroundButton"
          ref={saveBackgroundButtonRef}
          className={saveButtonClassNames}
          style={saveButtonStyle}
          onClick={handleSaveButtonClick}
          {...restSaveButtonProps}
        >
          {saveButtonLabel}
        </button>
      </div>
    );

    return renderButtons
      ? renderButtons({
          defaultButtons,
          applyButtonRef: applyBackgroundButtonRef,
          saveButtonRef: saveBackgroundButtonRef,
        })
      : defaultButtons;
  };

  const headerNode = buildHeader();
  const buttonsNode = buildButtons();

  const defaultBody = (
    <div className={bodyClassNames} style={bodyStyle} {...restBodyProps}>
      <div
        id="defaultImages"
        ref={defaultImagesContainerRef}
        className={imagesContainerClassNames}
        style={imagesContainerStyle}
        {...restImagesContainerProps}
      />
      <div
        className={uploadWrapperClassNames}
        style={uploadWrapperStyle}
        {...restUploadWrapperProps}
      >
        <label
          htmlFor="uploadImage"
          className={uploadLabelClassNames}
          style={uploadLabelStyle}
          {...restUploadLabelProps}
        >
          {uploadLabel}
        </label>
        <input
          type="file"
          id="uploadImage"
          className={uploadInputClassNames}
          style={uploadInputStyle}
          ref={uploadImageInputRef}
          onChange={handleImageUpload}
          {...restUploadInputProps}
        />
      </div>
      <canvas
        id="mainCanvas"
        ref={mainCanvasRef}
        className={mainCanvasClassNames}
        style={mainCanvasStyle}
        {...restMainCanvasProps}
      />
      <canvas
        id="backgroundCanvas"
        ref={backgroundCanvasRef}
        className={backgroundCanvasClassNames}
        style={backgroundCanvasStyle}
        {...restBackgroundCanvasProps}
      />
      <video
        id="captureVideo"
        muted
        ref={captureVideoRef}
        className={captureVideoClassNames}
        style={captureVideoStyle}
        autoPlay
        playsInline
        {...restCaptureVideoProps}
      />
      <video
        id="previewVideo"
        muted
        ref={videoPreviewRef}
        className={previewVideoClassNames}
        style={previewVideoStyle}
        autoPlay
        playsInline
        {...restPreviewVideoProps}
      />
      <div
        id="loadingOverlay"
        ref={loadingOverlayRef}
        className={["d-none", loadingOverlayClassNames]
          .filter(Boolean)
          .join(" ")
          .trim() || undefined}
        style={loadingOverlayStyle}
        {...restLoadingOverlayProps}
      >
        {loadingSpinnerNode}
      </div>
      {buttonsNode}
    </div>
  );

  const bodyNode = renderBody ? renderBody({ defaultBody }) : defaultBody;

  const defaultContent = (
    <div className={contentClassNames} style={contentStyle} {...restContentProps}>
      {headerNode}
      <hr style={headerDividerStyle} {...restHeaderDividerProps} />
      {bodyNode}
    </div>
  );

  const contentNode = renderContent
    ? renderContent({ defaultContent })
    : defaultContent;

  return (
    <div className={overlayClassNames} style={overlayStyle} {...restOverlayProps}>
      {contentNode}
    </div>
  );
};

export default BackgroundModal;
