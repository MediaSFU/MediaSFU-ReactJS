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

  if(!selfieSegmentation){
    selfieSegmentation = parameters.getUpdatedAllParams().selfieSegmentation;
  }

  // Suppress unused position warning - kept for API compatibility
  void _position;

  const defaultImagesContainerRef = useRef<HTMLDivElement>(null);
  const uploadImageInputRef = useRef<HTMLInputElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const captureVideoRef = useRef<HTMLVideoElement>(null);
  const loadingOverlayRef = useRef<HTMLDivElement>(null);
  const applyBackgroundButtonRef = useRef<HTMLButtonElement>(null);
  const saveBackgroundButtonRef = useRef<HTMLButtonElement>(null);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);

  // Modern modal width - similar to sidebar
  const modalWidth = typeof window !== "undefined" ? Math.min(window.innerWidth * 0.85, 420) : 380;

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
    borderRadius: isModal ? 0 : 18, // No border radius for full-height panel
    padding: 16,
    width: isSidebar || isInline ? "100%" : modalWidth,
    minWidth: isModal ? 300 : undefined,
    maxWidth: isSidebar || isInline ? "100%" : modalWidth,
    height: isModal ? "100%" : undefined,
    maxHeight: isSidebar || isInline ? "100%" : undefined,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    boxShadow: isModal 
      ? "-4px 0 20px rgba(0, 0, 0, 0.25)" // Left shadow for right-side panel
      : (enableGlow ? "0 20px 60px rgba(0,0,0,0.35)" : "0 12px 30px rgba(0,0,0,0.25)"),
    ...(isModal
      ? { borderLeft: `1px solid ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}` }
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
    padding: isModal ? "12px 16px" : undefined,
    marginBottom: isModal ? 0 : undefined,
    borderBottom: isModal 
      ? `1px solid ${isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`
      : undefined,
    backgroundColor: isModal 
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
    fontSize: 16,
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
    overflowY: "auto",
    padding: isModal ? "16px" : undefined,
    paddingRight: isModal ? 16 : 4,
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
    maxWidth: "95%",
    overflowX: "auto",
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    minHeight: "50px",
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
    background: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
    border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"}`,
    color: isDarkMode ? "#e5e7eb" : "#0f172a",
    ...uploadInputStyleOverrides,
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
    boxShadow: enableGlow ? "0 10px 30px rgba(37,99,235,0.35)" : undefined,
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
    boxShadow: enableGlow ? "0 10px 30px rgba(34,197,94,0.35)" : undefined,
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

      if (autoClickBackground) {
        // Wait for DOM refs to be ready before auto-clicking
        const waitForRefsAndApply = async () => {
          // Wait for refs to mount (up to 2 seconds)
          let attempts = 0;
          while (attempts < 20 && (!captureVideoRef.current || !videoPreviewRef.current || !mainCanvasRef.current)) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
          }
          
          if (!captureVideoRef.current || !videoPreviewRef.current || !mainCanvasRef.current) {
            console.error("Background modal refs not ready after waiting");
            autoClickBackground = false;
            updateAutoClickBackground(false);
            onClose();
            return;
          }

          try {
            await applyBackground();
            await saveBackground();
          } catch (error) {
            console.error("Error auto-applying background:", error);
          } finally {
            autoClickBackground = false;
            updateAutoClickBackground(autoClickBackground);
            // Close modal after auto-apply completes
            onClose();
          }
        };
        waitForRefsAndApply();
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
    noBackgroundImg.style.backgroundColor = isDarkMode ? "rgba(255,255,255,0.1)" : "#f8f9fa";
    noBackgroundImg.style.border = `1px solid ${isDarkMode ? "rgba(255,255,255,0.2)" : "#dee2e6"}`;
    noBackgroundImg.style.borderRadius = "8px";
    noBackgroundImg.style.position = "relative";
    noBackgroundImg.innerHTML =
      `<span style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); color:${isDarkMode ? "#e5e7eb" : "#000"}; font-weight:500;">None</span>`;
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
    ctx.clearRect(0, 0, backgroundCanvasRef.current.width, backgroundCanvasRef.current.height);
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
    
    // Wait for processedStream to be set up (selfieSegmentationPreview uses setTimeout internally)
    if (doSegmentation) {
      let waitAttempts = 0;
      while (!processedStream && waitAttempts < 30) {
        await new Promise(resolve => setTimeout(resolve, 100));
        // Re-fetch from updated params in case it was set
        const updatedParams = parameters.getUpdatedAllParams();
        processedStream = updatedParams.processedStream;
        waitAttempts++;
      }
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
            } catch {
              /* ignore */
            }
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
        refVideo.play();
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
            refVideo.play();
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
              refVideo.play();
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
        }
      } catch {
        /* ignore */
      }
    }

    let repeatPattern = "no-repeat";
    try {
      if (virtualImage.width < mediaCanvas.width || virtualImage.height < mediaCanvas.height) {
        repeatPattern = "repeat";
      }
    } catch {
      // ignore
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
          ctx!.drawImage(results.image, 0, 0, mediaCanvas.width, mediaCanvas.height);

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
    } catch {
      /* ignore */
    }
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
                message: "Please pause the recording before changing the background.",
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
          if (localStreamVideo && localStreamVideo.getVideoTracks()[0]?.readyState === "live") {
            videoParams = { track: localStreamVideo.getVideoTracks()[0] };
            updateVideoParams(videoParams);
          } else {
            try {
              if (localStreamVideo && localStreamVideo.getVideoTracks()[0]?.readyState !== "live") {
                localStreamVideo.removeTrack(localStreamVideo.getVideoTracks()[0]);
                const clonedTrackLocal = segmentVideo?.getVideoTracks()[0]?.clone();
                if (clonedTrackLocal) {
                  localStreamVideo.addTrack(clonedTrackLocal);
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
                await sleep({ ms: 500 });
              }
            }
            await connectSendTransportVideo({ videoParams, parameters });
          } catch {
            /* ignore */
          }
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
        <span style={{ fontSize: 18 }}>📷</span>
        <span
          style={{
            fontSize: 13,
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
          fontSize: 12,
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
        <span style={{ fontSize: 12 }}>🔒</span>
        <span
          style={{
            fontSize: 11,
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
  const savedBackgroundIndicator = !videoAlreadyOn && (selectedImage || customImage) && (
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
      <span style={{ fontSize: 14 }}>✓</span>
      <span
        style={{
          fontSize: 12,
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
        ref={defaultImagesContainerRef}
        className={imagesContainerClassNames}
        style={imagesContainerStyle}
        {...restImagesContainerProps}
      />
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
