import React, { useEffect, useRef, FC } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import { selfieSegmentationService } from "../utils/SelfieSegmentationService";
import {
  ConnectSendTransportVideoType,
  CreateSendTransportType,
  CreateSendTransportParameters,
  OnScreenChangesType,
  DisconnectSendTransportVideoType,
  OnScreenChangesParameters,
  ShowAlert,
  SleepType,
  VidCons,
  ConnectSendTransportVideoParameters,
  DisconnectSendTransportVideoParameters,
} from "../../@types/types";
import { Producer, ProducerOptions } from "mediasoup-client/lib/types";
import { ModalRenderMode } from "../../components/menuComponents/MenuModal";
import { ModernTooltip } from "../core/widgets/ModernTooltip";
import { compositeVirtualBackgroundFrame } from "../../methods/utils/virtualBackgroundCompositor";
import { MediasfuTypography } from '../core/theme/MediasfuTypography';

export interface ModernBackgroundModalParameters
  extends CreateSendTransportParameters,
    ConnectSendTransportVideoParameters,
    DisconnectSendTransportVideoParameters,
    OnScreenChangesParameters {
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

  getUpdatedAllParams: () => ModernBackgroundModalParameters;
  [key: string]: any;
}

export interface ModernBackgroundModalOptions {
  isVisible: boolean;
  onClose: () => void;
  parameters: ModernBackgroundModalParameters;
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
  renderHeader?: (options: { defaultHeader: React.ReactNode; onClose: () => void }) => React.ReactNode;
  renderButtons?: (options: {
    defaultButtons: React.ReactNode;
    applyButtonRef: React.RefObject<HTMLButtonElement | null>;
    saveButtonRef: React.RefObject<HTMLButtonElement | null>;
  }) => React.ReactNode;
  renderBody?: (options: { defaultBody: React.ReactNode }) => React.ReactNode;
  renderContent?: (options: { defaultContent: React.ReactNode }) => React.ReactNode;
  /** Theme control - whether dark mode is active */
  isDarkMode?: boolean;
  /** Enable glassmorphism effects (modern UI) */
  enableGlassmorphism?: boolean;
  /** Render mode: modal (default overlay), sidebar (inline for desktop), inline (no wrapper) */
  renderMode?: ModalRenderMode;
  /** Enable glow effects for buttons/content */
  enableGlow?: boolean;
}
export type ModernBackgroundModalType = (props: ModernBackgroundModalOptions) => React.JSX.Element;

/**
 * ModernBackgroundModal - Copies the original BackgroundModal logic verbatim while
 * applying theme-aware, glassmorphic styling and sidebar/inline render modes.
 */
const ModernBackgroundModal: React.FC<ModernBackgroundModalOptions> = ({
  isVisible,
  onClose,
  parameters,
  position: _position = "topLeft", // Kept for API compatibility, not used in modern layout
  backgroundColor,
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
  // Modern styling
  isDarkMode = true,
  enableGlassmorphism = true,
  enableGlow = true,
  renderMode = "modal",
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
    updateVideoParams,
    autoClickBackground,
    updateAutoClickBackground,
  } = parameters;

  const getCurrentParameters = (): any => (parameters as any).getCurrentParams?.() ?? parameters;
  // Hidden and visible renders must read without republishing room state.
  if (!selfieSegmentation) selfieSegmentation = getCurrentParameters().selfieSegmentation;

  // Suppress unused position warning - kept for API compatibility
  void _position;

  const uploadImageInputRef = useRef<HTMLInputElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const captureVideoRef = useRef<HTMLVideoElement>(null);
  const loadingOverlayRef = useRef<HTMLDivElement>(null);
  const applyBackgroundButtonRef = useRef<HTMLButtonElement>(null);
  const saveBackgroundButtonRef = useRef<HTMLButtonElement>(null);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewLoopVersionRef = useRef(0);
  const previewAnimationFrameIdRef = useRef<number | null>(null);
  const previewCaptureTimeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [uploadFileName, setUploadFileName] = React.useState("No file selected");
  const [isAutoApplyingBackground, setIsAutoApplyingBackground] = React.useState(false);
  const autoApplyInFlightRef = useRef(false);

  // Modern modal width - similar to sidebar
  const modalWidth = typeof window !== "undefined" ? Math.min(window.innerWidth * 0.85, 420) : 380;
  const isCompactViewport = typeof window !== "undefined" ? window.innerWidth < 560 : false;

  const resolvedBackgroundColor =
    backgroundColor ?? (isDarkMode 
      ? "rgba(30, 41, 59, 0.98)"  // Match sidebar dark background
      : "rgba(241, 245, 249, 0.98)"); // Match sidebar light background

  const isSidebar = renderMode === "sidebar";
  const isInline = renderMode === "inline";
  const isModal = renderMode === "modal";

  const {
    className: overlayClassName,
    style: overlayStyleOverrides,
    ...restOverlayProps
  } = overlayProps ?? {};

  const overlayClassNames = [
    "mediasfu-background-modal",
    isModal ? "mediasfu-background-modal--modal" : "",
    isSidebar ? "mediasfu-background-modal--sidebar" : "",
    isInline ? "mediasfu-background-modal--inline" : "",
    overlayClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  // Modal mode: Modern sidebar-like panel on the right side
  // Inline/Sidebar mode: Relative positioning within container
  const overlayStyle: React.CSSProperties = {
    position: isSidebar || isInline ? "relative" : "fixed",
    top: isSidebar || isInline ? undefined : 0,
    right: isModal ? 0 : undefined,
    bottom: isModal ? 0 : undefined,
    left: isSidebar || isInline ? undefined : undefined,
    width: isSidebar || isInline ? "100%" : "auto",
    height: isSidebar || isInline ? "100%" : "100%",
    minHeight: 0,
    overflow: isSidebar || isInline ? "hidden" : undefined,
    backgroundColor: "transparent", // No backdrop - floating panel like sidebar
    display: isVisible ? "flex" : "none",
    flexDirection: "column",
    justifyContent: isModal ? "flex-start" : undefined,
    alignItems: isModal ? "flex-end" : (isSidebar || isInline ? "stretch" : undefined),
    zIndex: 1000,
    pointerEvents: isModal ? "none" : undefined, // Allow clicking through to content behind
    ...overlayStyleOverrides,
  };

  const {
    className: contentClassName,
    style: contentStyleOverrides,
    ...restContentProps
  } = contentProps ?? {};

  const contentClassNames = [
    "mediasfu-background-modal__content",
    "modern",
    contentClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  // Modern content styling - sidebar-like panel
  const contentBase: React.CSSProperties = {
    background: resolvedBackgroundColor,
    borderRadius: isModal || isSidebar || isInline ? 0 : 18,
    padding: 16,
    width: isSidebar || isInline ? "100%" : modalWidth,
    minWidth: isModal ? 300 : undefined,
    maxWidth: isSidebar || isInline ? "100%" : modalWidth,
    height: isSidebar || isInline ? "100%" : isModal ? "100%" : undefined,
    minHeight: 0,
    maxHeight: isSidebar || isInline ? "100%" : undefined,
    overflowX: "hidden",
    overflowY: "hidden",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    boxShadow: isSidebar || isInline
      ? "none"
      : isModal 
      ? "-4px 0 20px rgba(0, 0, 0, 0.25)" // Left shadow for right-side panel
      : (enableGlow ? "0 20px 60px rgba(0,0,0,0.35)" : "0 12px 30px rgba(0,0,0,0.25)"),
    ...(isModal
      ? { borderLeft: `1px solid ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}` }
      : isSidebar || isInline
      ? { border: "none" }
      : !isModal && enableGlassmorphism
      ? { border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"}` }
      : {}),
    pointerEvents: "auto", // Re-enable pointer events for content
    animation: isModal ? "slideInFromRight 300ms cubic-bezier(0.16, 1, 0.3, 1)" : undefined,
  };

  const contentStyle: React.CSSProperties = {
    position: "relative",
    ...contentBase,
    ...contentStyleOverrides,
  };

  const {
    className: headerClassName,
    style: headerStyleOverrides,
    ...restHeaderProps
  } = headerProps ?? {};

  const headerClassNames = ["modal-header", headerClassName]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  // Modern header style - matches sidebar header with bottom border
  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    padding: "12px 16px",
    marginBottom: isModal ? 0 : undefined,
    borderBottom: isModal || isSidebar || isInline
      ? `1px solid ${isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`
      : undefined,
    backgroundColor: isModal || isSidebar || isInline
      ? (isDarkMode ? "rgba(15, 23, 42, 0.5)" : "rgba(248, 250, 252, 0.5)")
      : undefined,
    color: isDarkMode ? "#e5e7eb" : "#0f172a",
    ...headerStyleOverrides,
  };

  const {
    className: titleClassName,
    style: titleStyleOverrides,
    ...restTitleProps
  } = titleProps ?? {};

  const titleClassNames = ["modal-title", titleClassName]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "1.2rem",
    fontWeight: 700,
    color: isDarkMode ? "#f8fafc" : "#0f172a",
    ...titleStyleOverrides,
  };

  const {
    className: closeButtonClassName,
    style: closeButtonStyleOverrides,
    onClick: closeButtonOnClick,
    ...restCloseButtonProps
  } = closeButtonProps ?? {};

  const closeButtonClassNames = ["btn-close-background", closeButtonClassName]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  // Modern close button - larger hit area and hover effect
  const closeButtonStyle: React.CSSProperties = {
    background: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
    border: "none",
    padding: 8,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: isDarkMode ? "#94a3b8" : "#64748b",
    borderRadius: 8,
    transition: "all 150ms ease",
    fontSize: MediasfuTypography.sizeTitleSmall,
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

  // Hide divider in modal mode since header has bottom border
  const headerDividerStyle: React.CSSProperties = {
    display: isModal ? "none" : undefined,
    height: 1,
    backgroundColor: isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
    marginTop: 4,
    marginBottom: 8,
    border: "none",
    ...headerDividerStyleOverrides,
  };

  const {
    className: bodyClassName,
    style: bodyStyleOverrides,
    ...restBodyProps
  } = bodyProps ?? {};

  const bodyClassNames = ["modal-body", bodyClassName]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  // Modern body style with proper padding for modal mode
  const bodyStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    overflowX: "hidden",
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    pointerEvents: isAutoApplyingBackground ? "none" : undefined,
    opacity: isAutoApplyingBackground ? 0.72 : 1,
    color: isDarkMode ? "#e5e7eb" : "#0f172a",
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
    width: "100%",
    minHeight: 140,
    minWidth: 0,
    maxWidth: "100%",
    overflowX: "hidden",
    display: "grid",
    gridTemplateColumns: isCompactViewport
      ? "repeat(auto-fit, minmax(58px, 1fr))"
      : "repeat(4, minmax(0, 1fr))",
    gap: 6,
    padding: 10,
    borderRadius: 12,
    border: `1px solid ${isDarkMode ? "rgba(148,163,184,0.16)" : "rgba(148,163,184,0.22)"}`,
    background: isDarkMode
      ? "rgba(15, 23, 42, 0.42)"
      : "rgba(255, 255, 255, 0.76)",
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
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    overflow: "visible",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    ...uploadWrapperStyleOverrides,
  };

  const {
    className: uploadLabelClassName,
    style: uploadLabelStyleOverrides,
    ...restUploadLabelProps
  } = uploadLabelProps ?? {};

  const uploadLabelClassNames = [uploadLabelClassName]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const uploadLabelStyle: React.CSSProperties = {
    fontWeight: 600,
    color: isDarkMode ? "#e5e7eb" : "#0f172a",
    ...uploadLabelStyleOverrides,
  };

  const {
    className: uploadInputClassName,
    style: uploadInputStyleOverrides,
    ...restUploadInputProps
  } = uploadInputProps ?? {};

  const uploadInputClassNames = ["form-control", uploadInputClassName]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const uploadInputStyle: React.CSSProperties = {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
    opacity: 0,
    pointerEvents: "none",
    ...uploadInputStyleOverrides,
  };

  const uploadPickerRowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    padding: 10,
    borderRadius: 12,
    border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"}`,
    background: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.82)",
    boxSizing: "border-box",
  };

  const uploadPickerButtonStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    minHeight: 38,
    padding: "0 14px",
    borderRadius: 10,
    background: isDarkMode ? "rgba(59, 130, 246, 0.18)" : "rgba(59, 130, 246, 0.12)",
    border: `1px solid ${isDarkMode ? "rgba(96,165,250,0.35)" : "rgba(59,130,246,0.18)"}`,
    color: isDarkMode ? "#dbeafe" : "#1d4ed8",
    fontSize: MediasfuTypography.sizeBodyCompact,
    fontWeight: 700,
    cursor: "pointer",
  };

  const uploadFileNameStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    fontSize: MediasfuTypography.sizeBodyCompact,
    lineHeight: 1.4,
    color: isDarkMode ? "#cbd5e1" : "#334155",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const uploadHelperTextStyle: React.CSSProperties = {
    margin: 0,
    fontSize: MediasfuTypography.sizeBodySmall,
    lineHeight: 1.45,
    color: isDarkMode ? "#94a3b8" : "#64748b",
  };

  const {
    className: mainCanvasClassName,
    style: mainCanvasStyleOverrides,
    ...restMainCanvasProps
  } = mainCanvasProps ?? {};

  const mainCanvasClassNames = ["d-none", mainCanvasClassName]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const mainCanvasStyle: React.CSSProperties = {
    width: "100%",
    maxHeight: "300px",
    borderRadius: 12,
    objectFit: "contain",
    ...mainCanvasStyleOverrides,
  };

  const {
    className: backgroundCanvasClassName,
    style: backgroundCanvasStyleOverrides,
    ...restBackgroundCanvasProps
  } = backgroundCanvasProps ?? {};

  const backgroundCanvasClassNames = ["d-none", backgroundCanvasClassName]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const backgroundCanvasStyle: React.CSSProperties = {
    width: "100%",
    maxHeight: "300px",
    borderRadius: 12,
    objectFit: "contain",
    ...backgroundCanvasStyleOverrides,
  };

  const {
    className: captureVideoClassName,
    style: captureVideoStyleOverrides,
    ...restCaptureVideoProps
  } = captureVideoProps ?? {};

  const captureVideoClassNames = ["d-none", captureVideoClassName]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const captureVideoStyle: React.CSSProperties = {
    width: "100%",
    maxHeight: "300px",
    borderRadius: 12,
    objectFit: "contain",
    ...captureVideoStyleOverrides,
  };

  const {
    className: previewVideoClassName,
    style: previewVideoStyleOverrides,
    ...restPreviewVideoProps
  } = previewVideoProps ?? {};

  const previewVideoClassNames = ["d-none", previewVideoClassName]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const previewVideoStyle: React.CSSProperties = {
    width: "100%",
    borderRadius: 12,
    boxShadow: enableGlow ? "0 10px 30px rgba(0,0,0,0.25)" : undefined,
    ...previewVideoStyleOverrides,
  };

  const {
    className: loadingOverlayClassName,
    style: loadingOverlayStyleOverrides,
    ...restLoadingOverlayProps
  } = loadingOverlayProps ?? {};

  const loadingOverlayClassNames = ["loading-overlay", loadingOverlayClassName]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const loadingOverlayStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0,0,0,0.35)",
    ...loadingOverlayStyleOverrides,
  };

  const {
    className: buttonsWrapperClassName,
    style: buttonsWrapperStyleOverrides,
    ...restButtonsWrapperProps
  } = buttonsWrapperProps ?? {};

  const buttonsWrapperClassNames = [
    "buttons-wrapper",
    buttonsWrapperClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const buttonsWrapperStyle: React.CSSProperties = {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    ...buttonsWrapperStyleOverrides,
  };

  const {
    className: applyButtonClassName,
    style: applyButtonStyleOverrides,
    onClick: applyButtonOnClick,
    ...restApplyButtonProps
  } = applyButtonProps ?? {};

  const applyButtonClassNames = ["btn", "btn-primary", applyButtonClassName]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const applyButtonStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 140,
    background: enableGlassmorphism
      ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
      : "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 12,
    padding: "12px 16px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: enableGlow ? "0 4px 16px rgba(0,0,0,0.3)" : undefined,
    ...applyButtonStyleOverrides,
  };

  const {
    className: saveButtonClassName,
    style: saveButtonStyleOverrides,
    onClick: saveButtonOnClick,
    ...restSaveButtonProps
  } = saveButtonProps ?? {};

  const saveButtonClassNames = ["btn", "btn-success", saveButtonClassName]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const saveButtonStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 140,
    background: enableGlassmorphism
      ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
      : "#16a34a",
    color: "white",
    border: "none",
    borderRadius: 12,
    padding: "12px 16px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: enableGlow ? "0 4px 16px rgba(0,0,0,0.3)" : undefined,
    ...saveButtonStyleOverrides,
  };

  const previewLabel = applyButtonLabel ?? "Preview Background";
  const appliedLabel = applyButtonAppliedLabel ?? previewLabel;
  const defaultBackgroundEntries = ["wall", "wall2", "shelf", "clock", "desert", "flower"] as const;

  const thumbnailButtonStyle = (active: boolean, isNone = false): React.CSSProperties => ({
    width: "100%",
    minWidth: 0,
    minHeight: isCompactViewport ? 50 : 56,
    aspectRatio: isNone ? "1.3 / 1" : "16 / 10",
    padding: 0,
    borderRadius: 10,
    border: active
      ? `2px solid ${isDarkMode ? "rgba(96, 165, 250, 0.95)" : "#2563eb"}`
      : `1px solid ${isDarkMode ? "rgba(148,163,184,0.18)" : "rgba(148,163,184,0.22)"}`,
    background: isNone
      ? (isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.92)")
      : (isDarkMode ? "rgba(15, 23, 42, 0.6)" : "rgba(255, 255, 255, 0.92)"),
    boxShadow: active
      ? (isDarkMode ? "0 0 0 3px rgba(59,130,246,0.22)" : "0 0 0 3px rgba(37,99,235,0.16)")
      : "none",
    boxSizing: "border-box",
    overflow: "hidden",
    cursor: "pointer",
    display: "block",
    appearance: "none",
    WebkitAppearance: "none",
  });

  const thumbnailImageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    pointerEvents: "none",
  };

  const thumbnailLabelStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    fontWeight: 600,
    fontSize: "0.85rem",
    color: isDarkMode ? "#cbd5e1" : "#334155",
  };

  useEffect(() => {
    if (isVisible) {
      if (!selfieSegmentation) {
        preloadModel().catch(() => console.log("Error preloading model:"));
      }
      if (selectedImage) {
        loadImageToCanvas(selectedImage, selectedImage);
      } else {
        clearCanvas();
      }
      saveBackgroundButtonRef.current?.classList.add("d-none");
      if (saveBackgroundButtonRef.current) saveBackgroundButtonRef.current.disabled = true;
      applyBackgroundButtonRef.current?.classList.remove("d-none");
      if (applyBackgroundButtonRef.current) applyBackgroundButtonRef.current.disabled = false;

      if (
        processedStream &&
        prevKeepBackground == keepBackground &&
        keepBackground &&
        appliedBackground
      ) {
        if (applyBackgroundButtonRef.current) applyBackgroundButtonRef.current.innerText = appliedLabel;
      } else {
        if (applyBackgroundButtonRef.current) applyBackgroundButtonRef.current.innerText = previewLabel;
      }

    } else {
      try {
        if (
          !appliedBackground ||
          (appliedBackground && !keepBackground) ||
          (appliedBackground && !videoAlreadyOn)
        ) {
          previewLoopVersionRef.current += 1;

          if (previewAnimationFrameIdRef.current !== null) {
            cancelAnimationFrame(previewAnimationFrameIdRef.current);
            previewAnimationFrameIdRef.current = null;
          }

          if (previewCaptureTimeoutIdRef.current !== null) {
            clearTimeout(previewCaptureTimeoutIdRef.current);
            previewCaptureTimeoutIdRef.current = null;
          }

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

  // Restoration can be requested while the picker is already visible.
  useEffect(() => {
    if (isVisible && autoClickBackground) void handleAutoClickBackground();
  }, [isVisible, autoClickBackground]);

  const clonedStream = useRef<MediaStream | null>(null);
  const clonedTrack = useRef<MediaStreamTrack | null>(null);

  async function preloadModel() {
    // Use singleton service to get the shared model instance
    const model = await selfieSegmentationService.getModel();
    if (model) {
      selfieSegmentation = model;
      updateSelfieSegmentation(selfieSegmentation);
    }else{
      setTimeout(async () => {
        const model = await selfieSegmentationService.getModel();
        if (model) {
          selfieSegmentation = model;
          updateSelfieSegmentation(selfieSegmentation);
        }
      }, 500);
    }
  }

  // async function preloadModel() {
  //   selfieSegmentation = new SelfieSegmentation({
  //     locateFile: (file) =>
  //       `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
  //   });

  //   selfieSegmentation.setOptions({
  //     modelSelection: 1,
  //     selfieMode: false,
  //   });

  //   await selfieSegmentation.initialize();
  //   updateSelfieSegmentation(selfieSegmentation);
  // }

  const showLoading = () => {
    loadingOverlayRef.current?.classList.remove("d-none");
  };

  const hideLoading = () => {
    loadingOverlayRef.current?.classList.add("d-none");
  };

  const playMediaSafely = async (element: HTMLMediaElement | null) => {
    if (!element) {
      return;
    }

    try {
      await element.play();
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        console.log("Error playing media element:", error);
      }
    }
  };

  const getLiveVideoTrack = (stream: MediaStream | null | undefined) =>
    stream?.getVideoTracks().find((track) => track.readyState === "live") ?? null;

  const waitForProcessedStream = async (): Promise<MediaStream | null> => {
    let attempts = 0;
    while (attempts < 40) {
      const latestProcessedStream = getCurrentParameters().processedStream ?? processedStream ?? null;
      if (latestProcessedStream) {
        processedStream = latestProcessedStream;
      }

      if (getLiveVideoTrack(processedStream)) {
        return processedStream;
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts += 1;
    }

    return getLiveVideoTrack(processedStream) ? processedStream : null;
  };

  const waitForBackgroundPublishCompletion = async (
    expectedTrackId: string | undefined,
    requiresAsyncPublish: boolean,
  ) => {
    if (!requiresAsyncPublish || !expectedTrackId) {
      return;
    }

    for (let attempts = 0; attempts < 14; attempts += 1) {
      const currentParameters = getCurrentParameters();
      const producerTrack = currentParameters.videoProducer?.track ?? null;

      if (
        currentParameters.transportCreated &&
        producerTrack?.readyState === "live" &&
        producerTrack.id === expectedTrackId
      ) {
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    console.warn("Virtual background publish did not settle before the modal closed.");
  };

  const interactiveViewReady = () => Boolean(
    captureVideoRef.current &&
      videoPreviewRef.current &&
      mainCanvasRef.current &&
      applyBackgroundButtonRef.current &&
      saveBackgroundButtonRef.current,
  );

  const waitForInteractiveView = async () => {
    for (let attempts = 0; attempts < 12; attempts += 1) {
      if (interactiveViewReady()) {
        return true;
      }

      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    return interactiveViewReady();
  };

  const resetProcessedStreamForAutoApply = () => {
    if (!selectedImage || !processedStream) {
      return;
    }

    processedStream.getVideoTracks().forEach((track) => track.stop());
    processedStream = null;
    updateProcessedStream(null);
  };

  const ensureLiveProcessedStream = async (): Promise<MediaStream> => {
    let currentProcessedStream = await waitForProcessedStream();
    if (getLiveVideoTrack(currentProcessedStream)) {
      return currentProcessedStream as MediaStream;
    }

    resetProcessedStreamForAutoApply();
    await applyBackground();
    currentProcessedStream = await waitForProcessedStream();

    if (getLiveVideoTrack(currentProcessedStream)) {
      return currentProcessedStream as MediaStream;
    }

    throw new Error("Virtual background stream was not ready after the camera turned on.");
  };

  const clearCanvas = () => {
    const ctx = backgroundCanvasRef.current?.getContext("2d");
    if (!ctx || !backgroundCanvasRef.current) return;

    // Reset to a reasonable landscape size for the placeholder text
    // This prevents the canvas from retaining a large portrait dimension (e.g. from mobile camera)
    backgroundCanvasRef.current.width = 640;
    backgroundCanvasRef.current.height = 360;

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
        setUploadFileName(file.name);
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
      } else {
        setUploadFileName("No file selected");
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
    ctx.clearRect(0, 0, backgroundCanvasRef.current.width, backgroundCanvasRef.current.height);
    ctx.drawImage(img, 0, 0);
  };

  const resolveDefaultBackgroundSources = (baseName: typeof defaultBackgroundEntries[number]) => {
    const thumb = `https://mediasfu.com/images/backgrounds/${baseName}_thumbnail.jpg`;
    const previewSrc = `https://mediasfu.com/images/backgrounds/${baseName}_small.jpg`;
    const fullSrc =
      targetResolution == "fhd" || targetResolution == "qhd"
        ? `https://mediasfu.com/images/backgrounds/${baseName}_large.jpg`
        : `https://mediasfu.com/images/backgrounds/${baseName}.jpg`;

    return { thumb, previewSrc, fullSrc };
  };

  const handleClearBackgroundSelection = async () => {
    selectedImage = "";
    updateSelectedImage(selectedImage);
    updateCustomImage("");

    showLoading();
    videoPreviewRef.current?.classList.add("d-none");
    backgroundCanvasRef.current?.classList.remove("d-none");
    clearCanvas();
    hideLoading();
  };

  const renderThumbnailTiles = () => {
    const tiles = defaultBackgroundEntries.map((baseName) => {
      const { thumb, previewSrc, fullSrc } = resolveDefaultBackgroundSources(baseName);
      const isActive = selectedImage.includes(baseName);

      return (
        <button
          key={baseName}
          type="button"
          style={thumbnailButtonStyle(isActive)}
          onClick={() => {
            void loadImageToCanvas(previewSrc, fullSrc);
          }}
        >
          <img src={thumb} alt={`${baseName} background`} style={thumbnailImageStyle} />
        </button>
      );
    });

    tiles.push(
      <button
        key="none"
        type="button"
        style={thumbnailButtonStyle(!selectedImage, true)}
        onClick={() => {
          void handleClearBackgroundSelection();
        }}
      >
        <span style={thumbnailLabelStyle}>None</span>
      </button>,
    );

    if (customImage) {
      tiles.push(
        <button
          key="custom"
          type="button"
          style={thumbnailButtonStyle(selectedImage === customImage)}
          onClick={() => {
            void loadImageToCanvas(customImage, customImage);
          }}
        >
          <img src={customImage} alt="Custom background" style={thumbnailImageStyle} />
        </button>,
      );
    }

    return tiles;
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

    if (doSegmentation) {
      await waitForProcessedStream();
    }

    hideLoading();

    applyBackgroundButtonRef.current?.classList.add("d-none");
    if (applyBackgroundButtonRef.current) applyBackgroundButtonRef.current.disabled = true;

    if (
      processedStream &&
      prevKeepBackground == keepBackground &&
      keepBackground &&
      appliedBackground
    ) {
      saveBackgroundButtonRef.current?.classList.add("d-none");
      if (saveBackgroundButtonRef.current) saveBackgroundButtonRef.current.disabled = true;
    } else {
      saveBackgroundButtonRef.current?.classList.remove("d-none");
      if (saveBackgroundButtonRef.current) saveBackgroundButtonRef.current.disabled = false;
    }
  };

  const selfieSegmentationPreview = async (doSegmentation: boolean) => {
    const refVideo = captureVideoRef.current;
    const previewVideo = videoPreviewRef.current;
    const virtualImage = new Image();
    virtualImage.crossOrigin = "anonymous";
    virtualImage.src = selectedImage || "";

    if (doSegmentation && selectedImage) {
      await new Promise<void>((resolve) => {
        if (virtualImage.complete && virtualImage.naturalWidth > 0) {
          resolve();
          return;
        }

        virtualImage.onload = () => resolve();
        virtualImage.onerror = () => resolve();
      });
    }

    if (!mainCanvas) {
      mainCanvas = mainCanvasRef.current;
    }

    if (!mainCanvas || !refVideo || !previewVideo) return;

    const mediaCanvas = mainCanvas;
    mediaCanvas.width = refVideo.videoWidth;
    mediaCanvas.height = refVideo.videoHeight;
    let ctx = mediaCanvas.getContext("2d");
    let firstFrameResolved = !doSegmentation;
    let resolveFirstFrame: (() => void) | null = null;
    const firstFrameRendered = new Promise<void>((resolve) => {
      resolveFirstFrame = resolve;
    });

    const markFirstFrameRendered = () => {
      if (firstFrameResolved) {
        return;
      }

      firstFrameResolved = true;
      resolveFirstFrame?.();
      resolveFirstFrame = null;
    };

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
          const repeatPattern =
            virtualImage.width < mediaCanvas.width || virtualImage.height < mediaCanvas.height
              ? "repeat"
              : "no-repeat";
          compositeVirtualBackgroundFrame({
            ctx: ctx!,
            segmentationMask: results.segmentationMask,
            sourceImage: results.image,
            backgroundImage: virtualImage,
            width: mediaCanvas.width,
            height: mediaCanvas.height,
            repeatPattern,
          });
          markFirstFrameRendered();
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
    } catch {
      /* ignore */
    }

    const segmentImage = async (videoElement: HTMLVideoElement) => {
      try {
        previewLoopVersionRef.current += 1;

        if (previewAnimationFrameIdRef.current !== null) {
          cancelAnimationFrame(previewAnimationFrameIdRef.current);
          previewAnimationFrameIdRef.current = null;
        }

        if (previewCaptureTimeoutIdRef.current !== null) {
          clearTimeout(previewCaptureTimeoutIdRef.current);
          previewCaptureTimeoutIdRef.current = null;
        }

        const loopVersion = previewLoopVersionRef.current;
        let startedProcessing = false;

        const processFrame = () => {
          if (
            loopVersion !== previewLoopVersionRef.current ||
            !selfieSegmentation ||
            pauseSegmentation ||
            !videoElement ||
            videoElement.videoWidth === 0 ||
            videoElement.videoHeight === 0
          ) {
            return;
          }

          void selfieSegmentation.send({ image: videoElement }).catch(() => undefined);
          previewAnimationFrameIdRef.current = requestAnimationFrame(processFrame);
        };

        const startProcessing = () => {
          if (startedProcessing) {
            return;
          }

          startedProcessing = true;
          processFrame();
        };

        videoElement.onloadeddata = startProcessing;
        if (videoElement.readyState >= 2 && videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
          startProcessing();
        }

        previewCaptureTimeoutIdRef.current = setTimeout(async () => {
          previewCaptureTimeoutIdRef.current = null;

          if (loopVersion !== previewLoopVersionRef.current) {
            return;
          }

          await Promise.race([
            firstFrameRendered,
            new Promise<void>((resolve) => setTimeout(resolve, 1200)),
          ]);

          if (loopVersion !== previewLoopVersionRef.current) {
            return;
          }

          processedStream = mediaCanvas.captureStream(frameRate || 5);
          previewVideo.srcObject = processedStream;
          updateProcessedStream(processedStream);
          previewVideo.classList.remove("d-none");
          keepBackground = true;
          updateKeepBackground(keepBackground);

          if (previewVideo.paused) {
            await playMediaSafely(previewVideo);
          }
        }, 100);
      } catch {
        /* ignore */
      }
    };

    if (videoAlreadyOn) {
      if (
        clonedTrack.current &&
        clonedTrack.current.readyState === "live" &&
        localStreamVideo!.getVideoTracks()[0]?.label === clonedTrack.current?.label
      ) {
        // Use cloned track
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
        void playMediaSafely(refVideo);
      }
      refVideo.width = segmentVideo!.getVideoTracks()[0]?.getSettings().width || 0;
      refVideo.height = segmentVideo!.getVideoTracks()[0]?.getSettings().height || 0;
      mediaCanvas.width = refVideo.width;
      mediaCanvas.height = refVideo.height;
      ctx = mediaCanvas.getContext("2d");

      try {
        if (doSegmentation) {
          await segmentImage(refVideo);
        } else {
          previewVideo.srcObject = clonedStream.current || localStreamVideo;
          if (previewVideo.paused) {
            await playMediaSafely(previewVideo);
          }
        }
      } catch (error) {
        console.log("Error segmenting image:", error);
      }
    } else {
      if (segmentVideo && segmentVideo.getVideoTracks()[0]?.readyState === "live") {
        // Use existing
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
            void playMediaSafely(refVideo);
          }
        } catch {
          try {
            const stream = await mediaDevices.getUserMedia({
              video: { ...vidCons },
              audio: false,
            });
            segmentVideo = stream;
            updateSegmentVideo(segmentVideo);
            refVideo.srcObject = segmentVideo;
            if (refVideo.paused) {
              void playMediaSafely(refVideo);
            }
          } catch (error) {
            console.log("Error getting user media:", error);
          }
        }

        refVideo.width = segmentVideo!.getVideoTracks()[0]?.getSettings().width || 0;
        refVideo.height = segmentVideo!.getVideoTracks()[0]?.getSettings().height || 0;
        mediaCanvas.width = refVideo.width;
        mediaCanvas.height = refVideo.height;
        ctx = mediaCanvas.getContext("2d");
      }

      try {
        if (doSegmentation) {
          await segmentImage(refVideo);
        } else {
          previewVideo.srcObject = refVideo.srcObject;
          if (previewVideo.paused) {
            await playMediaSafely(previewVideo);
          }
        }
      } catch {
        /* ignore */
      }
    }
  };

  const saveBackground = async (): Promise<{ expectedTrackId?: string; requiresAsyncPublish: boolean }> => {
    const currentParameters = getCurrentParameters();

    if (currentParameters.audioOnlyRoom) {
      currentParameters.showAlert?.({
        message: "You cannot use a background in an audio only event.",
        type: "danger",
      });
      return { requiresAsyncPublish: false };
    }

    let expectedTrackId: string | undefined;
    let requiresAsyncPublish = false;

    if (backgroundHasChanged && currentParameters.videoAlreadyOn) {
      if (
        currentParameters.islevel === "2" &&
        (currentParameters.recordStarted || currentParameters.recordResumed) &&
        !(currentParameters.recordPaused || currentParameters.recordStopped) &&
        currentParameters.recordingMediaOptions === "video"
      ) {
        currentParameters.showAlert?.({
          message: "Please pause the recording before changing the background.",
          type: "danger",
        });
        return { requiresAsyncPublish: false };
      }

      let nextVideoParams = currentParameters.videoParams ?? {};
      const requiresProcessedBackground = keepBackground && Boolean(selectedImage);
      const processedBackgroundStream = requiresProcessedBackground
        ? await ensureLiveProcessedStream()
        : null;

      if (keepBackground && selectedImage && processedBackgroundStream) {
        processedStream = processedBackgroundStream;
        updateProcessedStream(processedBackgroundStream);
        virtualStream = processedBackgroundStream;
        updateVirtualStream(virtualStream);
        nextVideoParams = { track: virtualStream.getVideoTracks()[0] };
        updateVideoParams(nextVideoParams);
      } else if (currentParameters.localStreamVideo?.getVideoTracks()[0]?.readyState === "live") {
        nextVideoParams = { track: currentParameters.localStreamVideo.getVideoTracks()[0] };
        updateVideoParams(nextVideoParams);
      } else {
        try {
          if (
            currentParameters.localStreamVideo &&
            currentParameters.localStreamVideo.getVideoTracks()[0]?.readyState !== "live"
          ) {
            const originalTrack = currentParameters.localStreamVideo.getVideoTracks()[0];
            if (originalTrack) {
              currentParameters.localStreamVideo.removeTrack(originalTrack);
            }

            const clonedTrackLocal = segmentVideo?.getVideoTracks()[0]?.clone();
            if (clonedTrackLocal) {
              currentParameters.localStreamVideo.addTrack(clonedTrackLocal);
            }
          }
        } catch (error) {
          console.log("Error handling local stream video:", error);
        }

        nextVideoParams = {
          track: clonedStream.current?.getVideoTracks()[0] || undefined,
        };
        updateVideoParams(nextVideoParams);
      }

      const nextTrack = (nextVideoParams as { track?: MediaStreamTrack }).track;
      expectedTrackId = nextTrack?.id;
      requiresAsyncPublish = !currentParameters.transportCreated;

      if (keepBackground) {
        appliedBackground = true;
        updateAppliedBackground(true);
      } else {
        appliedBackground = false;
        updateAppliedBackground(false);
      }

      if (!currentParameters.transportCreated) {
        await currentParameters.createSendTransport?.({
          option: "video",
          parameters: { ...currentParameters, videoParams: nextVideoParams },
        });
      } else {
        try {
          if (
            currentParameters.videoProducer?.id &&
            currentParameters.videoProducer.track?.id !== nextTrack?.id
          ) {
            await currentParameters.disconnectSendTransportVideo?.({ parameters: currentParameters });
            await currentParameters.sleep?.({ ms: 500 });
          }

          await currentParameters.connectSendTransportVideo?.({
            videoParams: nextVideoParams,
            parameters: currentParameters,
          });
        } catch {
          /* ignore */
        }
      }

      await currentParameters.onScreenChanges?.({ changed: true, parameters: currentParameters });
    }

    if (keepBackground) {
      appliedBackground = true;
      updateAppliedBackground(true);
    } else {
      appliedBackground = false;
      updateAppliedBackground(false);
    }

    saveBackgroundButtonRef.current?.classList.add("d-none");
    if (saveBackgroundButtonRef.current) {
      saveBackgroundButtonRef.current.disabled = true;
    }

    return { expectedTrackId, requiresAsyncPublish };
  };

  const handleAutoClickBackground = async () => {
    if (!autoClickBackground || !isVisible || autoApplyInFlightRef.current) {
      return;
    }

    autoApplyInFlightRef.current = true;
    setIsAutoApplyingBackground(true);
    const refsReady = await waitForInteractiveView();

    if (!refsReady) {
      console.error("Background modal refs not ready after waiting");
      updateAutoClickBackground(false);
      setIsAutoApplyingBackground(false);
      autoApplyInFlightRef.current = false;
      onClose();
      return;
    }

    let shouldClose = true;

    try {
      resetProcessedStreamForAutoApply();
      await applyBackground();
      const publishResult = await saveBackground();
      await waitForBackgroundPublishCompletion(
        publishResult.expectedTrackId,
        publishResult.requiresAsyncPublish,
      );
    } catch (error) {
      shouldClose = false;
      getCurrentParameters().showAlert?.({
        message: "Virtual background could not finish applying automatically. Please review the preview and save again.",
        type: "danger",
      });
      console.error("Error auto-applying background:", error);
    } finally {
      autoApplyInFlightRef.current = false;
      updateAutoClickBackground(false);
      setIsAutoApplyingBackground(false);
      if (shouldClose) {
        onClose();
      }
    }
  };

  const Spinner: FC = () => {
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
    @keyframes slideInFromRight {
      from { 
        transform: translateX(100%); 
        opacity: 0;
      }
      to { 
        transform: translateX(0); 
        opacity: 1;
      }
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

  const handleApplyButtonClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    applyButtonOnClick?.(event);
    if (!event.defaultPrevented) {
      void applyBackground();
    }
  };

  const handleSaveButtonClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
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
      <div className={buttonsWrapperClassNames} style={buttonsWrapperStyle} {...restButtonsWrapperProps}>
        <ModernTooltip message={previewLabel} position="top" isDarkMode={isDarkMode}>
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
        </ModernTooltip>
        <ModernTooltip message={saveButtonLabel} position="top" isDarkMode={isDarkMode}>
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
        </ModernTooltip>
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

  // Camera status indicator - show helpful message when camera is off
  const cameraOffIndicator = !videoAlreadyOn && (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '12px 16px',
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: isDarkMode 
          ? 'rgba(59, 130, 246, 0.15)' 
          : 'rgba(59, 130, 246, 0.1)',
        border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
      }}
    >
      {/* Camera off notice */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={{ fontSize: MediasfuTypography.sizeTitleMedium }}>📷</span>
        <span
          style={{
            fontSize: MediasfuTypography.sizeBodyCompact,
            fontWeight: 600,
            color: isDarkMode ? '#93c5fd' : '#2563eb',
          }}
        >
          Camera is currently off
        </span>
      </div>
      
      {/* Helpful message */}
      <p
        style={{
          margin: 0,
          fontSize: MediasfuTypography.sizeBodySmall,
          lineHeight: 1.5,
          color: isDarkMode ? '#cbd5e1' : '#475569',
        }}
      >
        You can still choose a background now! It will be applied automatically when you turn on your camera.
      </p>

      {/* Privacy indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginTop: 4,
          padding: '6px 10px',
          borderRadius: 8,
          backgroundColor: isDarkMode 
            ? 'rgba(34, 197, 94, 0.15)' 
            : 'rgba(34, 197, 94, 0.1)',
          border: `1px solid ${isDarkMode ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)'}`,
          alignSelf: 'flex-start',
        }}
      >
        <span style={{ fontSize: MediasfuTypography.sizeBodySmall }}>🔒</span>
        <span
          style={{
            fontSize: MediasfuTypography.sizeCaption,
            fontWeight: 500,
            color: isDarkMode ? '#86efac' : '#16a34a',
          }}
        >
          Only visible to you
        </span>
      </div>
    </div>
  );

  // Saved background indicator when camera is off but background is selected
  const savedBackgroundIndicator = !videoAlreadyOn && appliedBackground && keepBackground && (selectedImage || customImage) && (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        marginTop: 8,
        borderRadius: 8,
        backgroundColor: isDarkMode 
          ? 'rgba(34, 197, 94, 0.15)' 
          : 'rgba(34, 197, 94, 0.08)',
        border: `1px solid ${isDarkMode ? 'rgba(34, 197, 94, 0.25)' : 'rgba(34, 197, 94, 0.15)'}`,
      }}
    >
      <span style={{ fontSize: MediasfuTypography.sizeBodyMedium }}>✓</span>
      <span
        style={{
          fontSize: MediasfuTypography.sizeBodySmall,
          color: isDarkMode ? '#86efac' : '#15803d',
          fontWeight: 500,
        }}
      >
        Background saved — will apply when camera turns on
      </span>
    </div>
  );

  const defaultBody = (
    <div className={bodyClassNames} style={bodyStyle} {...restBodyProps}>
      {/* Camera off indicator */}
      {cameraOffIndicator}
      
      <div
        id="defaultImages"
        className={imagesContainerClassNames}
        style={imagesContainerStyle}
        {...restImagesContainerProps}
      >
        {renderThumbnailTiles()}
      </div>
      <div style={{ 
        fontSize: "0.65rem", 
        color: isDarkMode ? "#94a3b8" : "#64748b", 
        marginTop: 4, 
        marginBottom: 8,
        fontStyle: "italic",
        textAlign: "right"
      }}>
        Black screen? Change the selected image to update/clear.
      </div>
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
        <div style={uploadPickerRowStyle}>
          <label htmlFor="uploadImage" style={uploadPickerButtonStyle}>
            Choose image
          </label>
          <span style={uploadFileNameStyle}>{uploadFileName}</span>
        </div>
        <p style={uploadHelperTextStyle}>PNG and JPG files up to 2MB work best.</p>
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
        className={["d-none", loadingOverlayClassNames].filter(Boolean).join(" ").trim() || undefined}
        style={loadingOverlayStyle}
        {...restLoadingOverlayProps}
      >
        {loadingSpinnerNode}
      </div>
      {buttonsNode}
      {/* Saved background indicator - shows when camera is off and background is selected */}
      {savedBackgroundIndicator}
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

  const contentNode = renderContent ? renderContent({ defaultContent }) : defaultContent;

  // Keyframes for slide-in animation
  const animationKeyframes = `
    @keyframes slideInFromRight {
      from { 
        transform: translateX(100%); 
        opacity: 0;
      }
      to { 
        transform: translateX(0); 
        opacity: 1;
      }
    }
  `;

  return (
    <div className={overlayClassNames} style={overlayStyle} {...restOverlayProps}>
      {isModal && <style>{animationKeyframes}</style>}
      {contentNode}
    </div>
  );
};

  export { ModernBackgroundModal };
export default ModernBackgroundModal;
