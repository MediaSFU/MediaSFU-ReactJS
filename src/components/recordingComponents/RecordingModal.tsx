import React from "react";
import StandardPanelComponent from "./StandardPanelComponent";
import AdvancedPanelComponent from "./AdvancedPanelComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  EventType,
  ConfirmRecordingType,
  StartRecordingType,
  ConfirmRecordingParameters,
  StartRecordingParameters,
} from "../../@types/types";

export interface RecordingModalParameters
  extends ConfirmRecordingParameters,
    StartRecordingParameters {
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

  // mediasfu functions
  getUpdatedAllParams: () => RecordingModalParameters;
  [key: string]: any;
}

export interface RecordingModalOptions {
  isRecordingModalVisible: boolean;
  onClose: () => void;
  backgroundColor?: string;
  position?: string;

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
  renderBody?: (options: { defaultBody: React.ReactNode }) => React.ReactNode;
  renderContent?: (options: { defaultContent: React.ReactNode }) => React.ReactNode;
}

export type RecordingModalType = (
  options: RecordingModalOptions
) => React.JSX.Element;

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


const RecordingModal: React.FC<RecordingModalOptions> = ({
  isRecordingModalVisible,
  onClose,
  backgroundColor = "#83c0e9",
  position = "bottomRight",
  confirmRecording,
  startRecording,
  parameters,
  title = "Recording Settings",
  overlayProps,
  contentProps,
  headerProps,
  titleProps,
  closeButtonProps,
  closeIconComponent,
  headerDividerProps,
  bodyProps,
  panelsWrapperProps,
  panelsScrollProps,
  panelsContainerProps,
  panelsActionsDividerProps,
  actionsWrapperProps,
  confirmButtonProps,
  startButtonProps,
  confirmButtonLabel = "Confirm",
  startButtonLabel = (
    <>
      Start <i className="fas fa-play" />
    </>
  ),
  renderHeader,
  renderPanels,
  renderActions,
  renderBody,
  renderContent,
}) => {
  const { recordPaused } = parameters;

  const defaultOverlayWidth =
    typeof window !== "undefined" ? Math.min(window.innerWidth * 0.8, 350) : 320;

  const {
    className: overlayClassName,
    style: overlayStyleOverrides,
    ...restOverlayProps
  } = overlayProps ?? {};

  const overlayClassNames = [
    "mediasfu-recording-modal",
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
    display: isRecordingModalVisible ? "block" : "none",
    zIndex: 999,
    ...overlayStyleOverrides,
  };

  const {
    className: contentClassName,
    style: contentStyleOverrides,
    ...restContentProps
  } = contentProps ?? {};

  const contentClassNames = [
    "mediasfu-recording-modal__content",
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
    maxHeight: "85%",
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
    "btn-close-recording",
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
    flex: 1,
    minHeight: 0,
    ...bodyStyleOverrides,
  };

  const {
    className: panelsWrapperClassName,
    style: panelsWrapperStyleOverrides,
    ...restPanelsWrapperProps
  } = panelsWrapperProps ?? {};

  const panelsWrapperClassNames = [
    "recording-modal__panels-wrapper",
    panelsWrapperClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const panelsWrapperStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
    ...panelsWrapperStyleOverrides,
  };

  const {
    className: panelsScrollClassName,
    style: panelsScrollStyleOverrides,
    ...restPanelsScrollProps
  } = panelsScrollProps ?? {};

  const panelsScrollClassNames = [
    "recording-modal__panels-scroll",
    panelsScrollClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const panelsScrollStyle: React.CSSProperties = {
    overflowY: "auto",
    maxHeight: "calc(100% - 120px)",
    padding: 0,
    ...panelsScrollStyleOverrides,
  };

  const {
    className: panelsContainerClassName,
    style: panelsContainerStyleOverrides,
    ...restPanelsContainerProps
  } = panelsContainerProps ?? {};

  const panelsContainerClassNames = [
    "recording-modal__panels",
    panelsContainerClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const panelsContainerStyle: React.CSSProperties = {
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    ...panelsContainerStyleOverrides,
  };

  const {
    className: panelsActionsDividerClassName,
    style: panelsActionsDividerStyleOverrides,
    ...restPanelsActionsDividerProps
  } = panelsActionsDividerProps ?? {};

  const panelsActionsDividerClassNames = [
    "recording-modal__divider",
    panelsActionsDividerClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const panelsActionsDividerStyle: React.CSSProperties = {
    height: 1,
    backgroundColor: "white",
    marginTop: 0,
    marginBottom: 0,
    ...panelsActionsDividerStyleOverrides,
  };

  const {
    className: actionsWrapperClassName,
    style: actionsWrapperStyleOverrides,
    ...restActionsWrapperProps
  } = actionsWrapperProps ?? {};

  const actionsWrapperClassNames = [
    "recording-modal__actions",
    actionsWrapperClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const actionsWrapperStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 16,
    flexWrap: "wrap",
    ...actionsWrapperStyleOverrides,
  };

  const {
    className: confirmButtonClassName,
    style: confirmButtonStyleOverrides,
    onClick: confirmButtonOnClick,
    ...restConfirmButtonProps
  } = confirmButtonProps ?? {};

  const confirmButtonClassNames = [
    "recording-modal__confirm",
    confirmButtonClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const confirmButtonStyle: React.CSSProperties = {
    flex: 1,
    padding: 8,
    borderRadius: 5,
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 10px",
    background: "#4CAF50",
    cursor: "pointer",
    border: "none",
    color: "black",
    fontSize: 14,
    ...confirmButtonStyleOverrides,
  };

  const handleConfirm = () => {
    confirmRecording({ parameters: { ...parameters } });
  };

  const handleConfirmClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    confirmButtonOnClick?.(event);
    if (!event.defaultPrevented) {
      handleConfirm();
    }
  };

  const {
    className: startButtonClassName,
    style: startButtonStyleOverrides,
    onClick: startButtonOnClick,
    ...restStartButtonProps
  } = startButtonProps ?? {};

  const startButtonClassNames = [
    "recording-modal__start",
    startButtonClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const startButtonStyle: React.CSSProperties = {
    flex: 1,
    padding: 8,
    borderRadius: 5,
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 10px",
    background: "#f44336",
    cursor: "pointer",
    border: "none",
    color: "black",
    fontSize: 14,
    ...startButtonStyleOverrides,
  };

  const handleStart = () => {
    startRecording({ parameters: { ...parameters } });
  };

  const handleStartClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    startButtonOnClick?.(event);
    if (!event.defaultPrevented) {
      handleStart();
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

  const buildPanels = () => {
    const defaultPanels = (
      <div
        className={panelsWrapperClassNames}
        style={panelsWrapperStyle}
        {...restPanelsWrapperProps}
      >
        <div
          className={panelsScrollClassNames}
          style={panelsScrollStyle}
          {...restPanelsScrollProps}
        >
          <div
            className={panelsContainerClassNames}
            style={panelsContainerStyle}
            {...restPanelsContainerProps}
          >
            <StandardPanelComponent parameters={parameters} />
            <AdvancedPanelComponent parameters={parameters} />
          </div>
        </div>
      </div>
    );

    return renderPanels
      ? renderPanels({ defaultPanels, parameters })
      : defaultPanels;
  };

  const buildActions = () => {
    const defaultActions = (
      <div
        className={actionsWrapperClassNames}
        style={actionsWrapperStyle}
        {...restActionsWrapperProps}
      >
        <button
          type="button"
          className={confirmButtonClassNames}
          style={confirmButtonStyle}
          onClick={handleConfirmClick}
          {...restConfirmButtonProps}
        >
          {confirmButtonLabel}
        </button>
        {!recordPaused && (
          <button
            type="button"
            className={startButtonClassNames}
            style={startButtonStyle}
            onClick={handleStartClick}
            {...restStartButtonProps}
          >
            {startButtonLabel}
          </button>
        )}
      </div>
    );

    return renderActions
      ? renderActions({
          defaultActions,
          recordPaused,
          handleConfirm,
          handleStart,
        })
      : defaultActions;
  };

  const headerNode = buildHeader();
  const panelsNode = buildPanels();
  const actionsNode = buildActions();

  const defaultBody = (
    <div className={bodyClassNames} style={bodyStyle} {...restBodyProps}>
      {panelsNode}
      <div
        className={panelsActionsDividerClassNames}
        style={panelsActionsDividerStyle}
        {...restPanelsActionsDividerProps}
      />
      {actionsNode}
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

export default RecordingModal;
