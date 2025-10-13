
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  modifySettings,
  ModifySettingsOptions,
} from "../../methods/settingsMethods/modifySettings";
import "./EventSettingsModal.css";
import { Socket } from "socket.io-client";
import { ShowAlert } from "../../@types/types";

export interface EventSettingOption {
  value: string;
  label: React.ReactNode;
}

export interface EventSettingSectionRenderInfo {
  key: "audio" | "video" | "screenshare" | "chat" | string;
  label: React.ReactNode;
  value: string;
  options: EventSettingOption[];
}

export interface RenderSettingSectionParams {
  defaultSection: React.ReactNode;
  defaultSelect: React.ReactNode;
  section: EventSettingSectionRenderInfo;
  index: number;
  onChange: (value: string) => void;
}

export interface EventSettingsModalOptions {
  isEventSettingsModalVisible: boolean;
  onEventSettingsClose: () => void;
  onModifyEventSettings?: (options: ModifySettingsOptions) => Promise<void>;
  position?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  backgroundColor?: string;
  audioSetting: string;
  videoSetting: string;
  screenshareSetting: string;
  chatSetting: string;
  updateAudioSetting: (setting: string) => void;
  updateVideoSetting: (setting: string) => void;
  updateScreenshareSetting: (setting: string) => void;
  updateChatSetting: (setting: string) => void;
  updateIsSettingsModalVisible: (isVisible: boolean) => void;
  roomName: string;
  socket: Socket;
  showAlert?: ShowAlert;
  title?: React.ReactNode;
  overlayProps?: React.HTMLAttributes<HTMLDivElement>;
  contentProps?: React.HTMLAttributes<HTMLDivElement>;
  headerProps?: React.HTMLAttributes<HTMLDivElement>;
  titleProps?: React.HTMLAttributes<HTMLDivElement>;
  closeButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  closeIconComponent?: React.ReactNode;
  headerDividerProps?: React.HTMLAttributes<HTMLHRElement>;
  bodyProps?: React.HTMLAttributes<HTMLDivElement>;
  settingFieldProps?: React.HTMLAttributes<HTMLDivElement>;
  audioFieldProps?: React.HTMLAttributes<HTMLDivElement>;
  videoFieldProps?: React.HTMLAttributes<HTMLDivElement>;
  screenshareFieldProps?: React.HTMLAttributes<HTMLDivElement>;
  chatFieldProps?: React.HTMLAttributes<HTMLDivElement>;
  settingLabelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
  audioLabelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
  videoLabelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
  screenshareLabelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
  chatLabelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
  settingSelectProps?: React.SelectHTMLAttributes<HTMLSelectElement>;
  audioSelectProps?: React.SelectHTMLAttributes<HTMLSelectElement>;
  videoSelectProps?: React.SelectHTMLAttributes<HTMLSelectElement>;
  screenshareSelectProps?: React.SelectHTMLAttributes<HTMLSelectElement>;
  chatSelectProps?: React.SelectHTMLAttributes<HTMLSelectElement>;
  separatorProps?: React.HTMLAttributes<HTMLDivElement>;
  footerProps?: React.HTMLAttributes<HTMLDivElement>;
  saveButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  saveButtonLabel?: React.ReactNode;
  audioLabel?: React.ReactNode;
  videoLabel?: React.ReactNode;
  screenshareLabel?: React.ReactNode;
  chatLabel?: React.ReactNode;
  disallowOptionLabel?: React.ReactNode;
  allowOptionLabel?: React.ReactNode;
  approvalOptionLabel?: React.ReactNode;
  chatDisallowOptionLabel?: React.ReactNode;
  chatAllowOptionLabel?: React.ReactNode;
  audioOptions?: EventSettingOption[];
  videoOptions?: EventSettingOption[];
  screenshareOptions?: EventSettingOption[];
  chatOptions?: EventSettingOption[];
  renderHeader?: (params: { defaultHeader: React.ReactNode }) => React.ReactNode;
  renderBody?: (params: { defaultBody: React.ReactNode }) => React.ReactNode;
  renderSettings?: (params: {
    defaultSettings: React.ReactNode;
    sections: EventSettingSectionRenderInfo[];
  }) => React.ReactNode;
  renderSettingSection?: (params: RenderSettingSectionParams) => React.ReactNode;
  renderSeparator?: (params: {
    defaultSeparator: React.ReactNode;
    index: number;
  }) => React.ReactNode;
  renderFooter?: (params: { defaultFooter: React.ReactNode }) => React.ReactNode;
  renderContent?: (params: { defaultContent: React.ReactNode }) => React.ReactNode;
}

export type EventSettingsModalType = (options: EventSettingsModalOptions) => React.JSX.Element;

/**
 * EventSettingsModal - Host controls for participant permissions and meeting settings
 * 
 * A comprehensive modal for meeting hosts to configure participant permissions for audio, video,
 * screen sharing, and chat. Provides granular control with allow/disallow/approval options,
 * enabling hosts to manage meeting security and participant interactions effectively.
 * 
 * Features:
 * - Audio permission control (allow, disallow, approval required)
 * - Video permission control (allow, disallow, approval required)
 * - Screen share permission control (allow, disallow, approval required)
 * - Chat permission control (allow, disallow)
 * - Real-time settings synchronization via socket
 * - Customizable permission labels and options
 * - Extensive HTML attributes customization
 * - Custom render hooks for sections
 * - Responsive positioning
 * - Settings validation
 * 
 * @component
 * @param {EventSettingsModalOptions} options - Configuration options
 * @param {boolean} options.isEventSettingsModalVisible - Modal visibility state
 * @param {Function} options.onEventSettingsClose - Callback when modal is closed
 * @param {Function} [options.onModifyEventSettings=modifySettings] - Settings modification handler
 * @param {string} [options.position="topRight"] - Modal screen position
 * @param {string} [options.backgroundColor="#83c0e9"] - Modal background color
 * @param {string} options.audioSetting - Current audio permission ('allow', 'disallow', 'approval')
 * @param {string} options.videoSetting - Current video permission ('allow', 'disallow', 'approval')
 * @param {string} options.screenshareSetting - Current screenshare permission ('allow', 'disallow', 'approval')
 * @param {string} options.chatSetting - Current chat permission ('allow', 'disallow')
 * @param {Function} options.updateAudioSetting - Update audio permission state
 * @param {Function} options.updateVideoSetting - Update video permission state
 * @param {Function} options.updateScreenshareSetting - Update screenshare permission state
 * @param {Function} options.updateChatSetting - Update chat permission state
 * @param {Function} options.updateIsSettingsModalVisible - Update modal visibility state
 * @param {string} options.roomName - Meeting/room identifier
 * @param {Socket} options.socket - Socket.io client instance
 * @param {ShowAlert} [options.showAlert] - Alert display function
 * @param {React.ReactNode} [options.title] - Custom modal title
 * @param {object} [options.overlayProps] - HTML attributes for overlay
 * @param {object} [options.contentProps] - HTML attributes for content container
 * @param {object} [options.headerProps] - HTML attributes for header
 * @param {object} [options.titleProps] - HTML attributes for title
 * @param {object} [options.closeButtonProps] - HTML attributes for close button
 * @param {React.ReactNode} [options.closeIconComponent] - Custom close icon
 * @param {object} [options.headerDividerProps] - HTML attributes for divider
 * @param {object} [options.bodyProps] - HTML attributes for body
 * @param {object} [options.settingFieldProps] - HTML attributes for setting fields
 * @param {object} [options.audioFieldProps] - HTML attributes for audio field
 * @param {object} [options.videoFieldProps] - HTML attributes for video field
 * @param {object} [options.screenshareFieldProps] - HTML attributes for screenshare field
 * @param {object} [options.chatFieldProps] - HTML attributes for chat field
 * @param {object} [options.settingLabelProps] - HTML attributes for labels
 * @param {object} [options.audioLabelProps] - HTML attributes for audio label
 * @param {object} [options.videoLabelProps] - HTML attributes for video label
 * @param {object} [options.screenshareLabelProps] - HTML attributes for screenshare label
 * @param {object} [options.chatLabelProps] - HTML attributes for chat label
 * @param {object} [options.settingSelectProps] - HTML attributes for selects
 * @param {object} [options.audioSelectProps] - HTML attributes for audio select
 * @param {object} [options.videoSelectProps] - HTML attributes for video select
 * @param {object} [options.screenshareSelectProps] - HTML attributes for screenshare select
 * @param {object} [options.chatSelectProps] - HTML attributes for chat select
 * @param {object} [options.separatorProps] - HTML attributes for separator
 * @param {object} [options.footerProps] - HTML attributes for footer
 * @param {object} [options.saveButtonProps] - HTML attributes for save button
 * @param {React.ReactNode} [options.saveButtonLabel] - Custom save button label
 * @param {React.ReactNode} [options.audioLabel] - Custom audio label
 * @param {React.ReactNode} [options.videoLabel] - Custom video label
 * @param {React.ReactNode} [options.screenshareLabel] - Custom screenshare label
 * @param {React.ReactNode} [options.chatLabel] - Custom chat label
 * @param {React.ReactNode} [options.disallowOptionLabel] - Custom disallow option label
 * @param {React.ReactNode} [options.allowOptionLabel] - Custom allow option label
 * @param {React.ReactNode} [options.approvalOptionLabel] - Custom approval option label
 * @param {React.ReactNode} [options.chatDisallowOptionLabel] - Custom chat disallow label
 * @param {React.ReactNode} [options.chatAllowOptionLabel] - Custom chat allow label
 * @param {EventSettingOption[]} [options.audioOptions] - Custom audio permission options
 * @param {EventSettingOption[]} [options.videoOptions] - Custom video permission options
 * @param {EventSettingOption[]} [options.screenshareOptions] - Custom screenshare permission options
 * @param {EventSettingOption[]} [options.chatOptions] - Custom chat permission options
 * @param {Function} [options.renderHeader] - Custom header renderer
 * @param {Function} [options.renderBody] - Custom body renderer
 * @param {Function} [options.renderSettings] - Custom settings renderer
 * @param {Function} [options.renderSettingSection] - Custom section renderer
 * @param {Function} [options.renderSeparator] - Custom separator renderer
 * 
 * @returns {React.JSX.Element} Rendered event settings modal
 * 
 * @example
 * // Basic event settings for host
 * ```tsx
 * import React, { useState } from 'react';
 * import { EventSettingsModal } from 'mediasfu-reactjs';
 * 
 * function HostSettings({ socket, roomName, showAlert }) {
 *   const [isVisible, setIsVisible] = useState(false);
 *   const [audioSetting, setAudioSetting] = useState('allow');
 *   const [videoSetting, setVideoSetting] = useState('approval');
 *   const [screenshareSetting, setScreenshareSetting] = useState('approval');
 *   const [chatSetting, setChatSetting] = useState('allow');
 * 
 *   return (
 *     <>
 *       <button onClick={() => setIsVisible(true)}>
 *         Event Settings
 *       </button>
 *       <EventSettingsModal
 *         isEventSettingsModalVisible={isVisible}
 *         onEventSettingsClose={() => setIsVisible(false)}
 *         audioSetting={audioSetting}
 *         videoSetting={videoSetting}
 *         screenshareSetting={screenshareSetting}
 *         chatSetting={chatSetting}
 *         updateAudioSetting={setAudioSetting}
 *         updateVideoSetting={setVideoSetting}
 *         updateScreenshareSetting={setScreenshareSetting}
 *         updateChatSetting={setChatSetting}
 *         updateIsSettingsModalVisible={setIsVisible}
 *         roomName={roomName}
 *         socket={socket}
 *         showAlert={showAlert}
 *         position="topRight"
 *         backgroundColor="#0f172a"
 *       />
 *     </>
 *   );
 * }
 * ```
 * 
 * @example
 * // Custom styled with permission indicators
 * ```tsx
 * import { EventSettingsModal } from 'mediasfu-reactjs';
 * 
 * function BrandedSettings(props) {
 *   const permissionIcons = {
 *     allow: '✓',
 *     disallow: '✗',
 *     approval: '⚠',
 *   };
 * 
 *   return (
 *     <EventSettingsModal
 *       {...props}
 *       backgroundColor="#1e3a8a"
 *       position="topLeft"
 *       contentProps={{
 *         style: {
 *           borderRadius: 20,
 *           border: '2px solid #3b82f6',
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
 *           <span>Meeting Permissions</span>
 *           <div style={{ fontSize: 12, display: 'flex', gap: 8 }}>
 *             <span>{permissionIcons[props.audioSetting]} Audio</span>
 *             <span>{permissionIcons[props.videoSetting]} Video</span>
 *           </div>
 *         </div>
 *       }
 *     />
 *   );
 * }
 * ```
 * 
 * @example
 * // Analytics tracking for permission changes
 * ```tsx
 * import { EventSettingsModal } from 'mediasfu-reactjs';
 * 
 * function AnalyticsSettings(props) {
 *   const handleModifySettings = async (options) => {
 *     analytics.track('event_settings_modified', {
 *       audioChanged: options.parameters.audioSetting !== props.audioSetting,
 *       videoChanged: options.parameters.videoSetting !== props.videoSetting,
 *       screenshareChanged: options.parameters.screenshareSetting !== props.screenshareSetting,
 *       chatChanged: options.parameters.chatSetting !== props.chatSetting,
 *       newSettings: {
 *         audio: options.parameters.audioSetting,
 *         video: options.parameters.videoSetting,
 *         screenshare: options.parameters.screenshareSetting,
 *         chat: options.parameters.chatSetting,
 *       },
 *     });
 *     return props.onModifyEventSettings?.(options);
 *   };
 * 
 *   return (
 *     <EventSettingsModal
 *       {...props}
 *       onModifyEventSettings={handleModifySettings}
 *     />
 *   );
 * }
 * ```
 * 
 * @example
 * // Override with MediasfuGeneric uiOverrides
 * ```tsx
 * import { MediasfuGeneric, EventSettingsModal } from 'mediasfu-reactjs';
 * 
 * const uiOverrides = {
 *   eventSettingsModal: {
 *     component: (props) => (
 *       <EventSettingsModal
 *         {...props}
 *         backgroundColor="#0f172a"
 *         position="topRight"
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

const EventSettingsModal: React.FC<EventSettingsModalOptions> = ({
  isEventSettingsModalVisible,
  onEventSettingsClose,
  onModifyEventSettings = modifySettings,
  audioSetting,
  videoSetting,
  screenshareSetting,
  chatSetting,
  position = "topRight",
  backgroundColor = "#83c0e9",
  updateAudioSetting,
  updateVideoSetting,
  updateScreenshareSetting,
  updateChatSetting,
  updateIsSettingsModalVisible,
  roomName,
  socket,
  showAlert,
  title = "Event Settings",
  overlayProps,
  contentProps,
  headerProps,
  titleProps,
  closeButtonProps,
  closeIconComponent,
  headerDividerProps,
  bodyProps,
  settingFieldProps,
  audioFieldProps,
  videoFieldProps,
  screenshareFieldProps,
  chatFieldProps,
  settingLabelProps,
  audioLabelProps,
  videoLabelProps,
  screenshareLabelProps,
  chatLabelProps,
  settingSelectProps,
  audioSelectProps,
  videoSelectProps,
  screenshareSelectProps,
  chatSelectProps,
  separatorProps,
  footerProps,
  saveButtonProps,
  saveButtonLabel,
  audioLabel,
  videoLabel,
  screenshareLabel,
  chatLabel,
  disallowOptionLabel,
  allowOptionLabel,
  approvalOptionLabel,
  chatDisallowOptionLabel,
  chatAllowOptionLabel,
  audioOptions,
  videoOptions,
  screenshareOptions,
  chatOptions,
  renderHeader,
  renderBody,
  renderSettings,
  renderSettingSection,
  renderSeparator,
  renderFooter,
  renderContent,
}) => {
  const [audioState, setAudioState] = useState<string>(audioSetting);
  const [videoState, setVideoState] = useState<string>(videoSetting);
  const [screenshareState, setScreenshareState] =
    useState<string>(screenshareSetting);
  const [chatState, setChatState] = useState<string>(chatSetting);

  const overlayWidth =
    typeof window !== "undefined" ? Math.min(window.innerWidth * 0.8, 350) : 320;

  const {
    className: overlayClassName,
    style: overlayStyleOverrides,
    ...restOverlayProps
  } = overlayProps ?? {};

  const overlayClassNames = [
    "mediasfu-event-modal",
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
    display: isEventSettingsModalVisible ? "block" : "none",
    zIndex: 999,
    ...overlayStyleOverrides,
  };

  const {
    className: contentClassName,
    style: contentStyleOverrides,
    ...restContentProps
  } = contentProps ?? {};

  const contentClassNames = [
    "mediasfu-event-modal__content",
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
    width: overlayWidth,
    maxHeight: "65%",
    overflow: "hidden",
    top: position.includes("top") ? 10 : "auto",
    bottom: position.includes("bottom") ? 10 : "auto",
    left: position.includes("Left") ? 10 : "auto",
    right: position.includes("Right") ? 10 : "auto",
    display: "flex",
    flexDirection: "column",
    gap: 16,
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
    "btn-close-settings",
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
      onEventSettingsClose();
    }
  };

  const {
    className: headerDividerClassName,
    style: headerDividerStyleOverrides,
    ...restHeaderDividerProps
  } = headerDividerProps ?? {};

  const headerDividerClassNames = [
    "hr",
    headerDividerClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const headerDividerStyle: React.CSSProperties = {
    height: 1,
    backgroundColor: "black",
    marginTop: 4,
    marginBottom: 4,
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
    gap: 12,
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    paddingRight: 4,
    ...bodyStyleOverrides,
  };

  const {
    className: settingFieldClassName,
    style: settingFieldStyleOverrides,
    ...restSettingFieldProps
  } = settingFieldProps ?? {};

  const baseFieldClassNames = [
    "form-group",
    settingFieldClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const {
    className: settingLabelClassName,
    style: settingLabelStyleOverrides,
    ...restSettingLabelProps
  } = settingLabelProps ?? {};

  const baseLabelClassNames = [
    "label",
    settingLabelClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const {
    className: settingSelectClassName,
    style: settingSelectStyleOverrides,
    ...restSettingSelectProps
  } = settingSelectProps ?? {};

  const baseSelectClassNames = [
    "picker-select",
    settingSelectClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const {
    className: separatorClassName,
    style: separatorStyleOverrides,
    ...restSeparatorProps
  } = separatorProps ?? {};

  const separatorClassNames = [
    "sep",
    separatorClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const separatorStyle: React.CSSProperties = {
    ...separatorStyleOverrides,
  };

  const {
    className: footerClassName,
    style: footerStyleOverrides,
    ...restFooterProps
  } = footerProps ?? {};

  const footerClassNames = [
    "modal-footer",
    footerClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const footerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    ...footerStyleOverrides,
  };

  const {
    className: saveButtonClassName,
    style: saveButtonStyleOverrides,
    onClick: saveButtonOnClick,
    ...restSaveButtonProps
  } = saveButtonProps ?? {};

  const saveButtonClassNames = [
    "btn-apply-settings",
    saveButtonClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const saveButtonStyle: React.CSSProperties = {
    ...saveButtonStyleOverrides,
  };

  useEffect(() => {
    if (isEventSettingsModalVisible) {
      setAudioState(audioSetting);
      setVideoState(videoSetting);
      setScreenshareState(screenshareSetting);
      setChatState(chatSetting);
    }
  }, [
    isEventSettingsModalVisible,
    audioSetting,
    videoSetting,
    screenshareSetting,
    chatSetting,
  ]);

  const handleSaveSettings = async () => {
    await onModifyEventSettings({
      audioSet: audioState,
      videoSet: videoState,
      screenshareSet: screenshareState,
      chatSet: chatState,
      updateAudioSetting: updateAudioSetting,
      updateVideoSetting: updateVideoSetting,
      updateScreenshareSetting: updateScreenshareSetting,
      updateChatSetting: updateChatSetting,
      updateIsSettingsModalVisible: updateIsSettingsModalVisible,
      roomName,
      socket,
      showAlert,
    });
  };

  const handleSaveClick: React.MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    saveButtonOnClick?.(event);
    if (event.defaultPrevented) {
      return;
    }

    await handleSaveSettings();
  };

  const audioLabelNode = audioLabel ?? "User audio:";
  const videoLabelNode = videoLabel ?? "User video:";
  const screenshareLabelNode = screenshareLabel ?? "User screenshare:";
  const chatLabelNode = chatLabel ?? "User chat:";

  const disallowLabelNode = disallowOptionLabel ?? "Disallow";
  const allowLabelNode = allowOptionLabel ?? "Allow";
  const approvalLabelNode = approvalOptionLabel ?? "Upon approval";

  const chatDisallowLabelNode = chatDisallowOptionLabel ?? disallowLabelNode;
  const chatAllowLabelNode = chatAllowOptionLabel ?? allowLabelNode;

  const defaultAudioOptions: EventSettingOption[] = [
    { value: "disallow", label: disallowLabelNode },
    { value: "allow", label: allowLabelNode },
    { value: "approval", label: approvalLabelNode },
  ];

  const defaultVideoOptions: EventSettingOption[] = defaultAudioOptions;
  const defaultScreenshareOptions: EventSettingOption[] = defaultAudioOptions;
  const defaultChatOptions: EventSettingOption[] = [
    { value: "disallow", label: chatDisallowLabelNode },
    { value: "allow", label: chatAllowLabelNode },
  ];

  const audioOptionsList = audioOptions ?? defaultAudioOptions;
  const videoOptionsList = videoOptions ?? defaultVideoOptions;
  const screenshareOptionsList = screenshareOptions ?? defaultScreenshareOptions;
  const chatOptionsList = chatOptions ?? defaultChatOptions;

  const buildFieldProps = (
    specificFieldProps?: React.HTMLAttributes<HTMLDivElement>
  ) => {
    const {
      className: specificClassName,
      style: specificStyleOverrides,
      ...restSpecificProps
    } = specificFieldProps ?? {};

    const classNames = [
      baseFieldClassNames,
      specificClassName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() || undefined;

    const style: React.CSSProperties = {
      ...settingFieldStyleOverrides,
      ...specificStyleOverrides,
    };

    const props = {
      ...restSettingFieldProps,
      ...restSpecificProps,
    };

    return { className: classNames, style, props };
  };

  const buildLabelProps = (
    specificLabelProps?: React.LabelHTMLAttributes<HTMLLabelElement>
  ) => {
    const {
      className: specificClassName,
      style: specificStyleOverrides,
      ...restSpecificProps
    } = specificLabelProps ?? {};

    const classNames = [
      baseLabelClassNames,
      specificClassName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() || undefined;

    const style: React.CSSProperties = {
      ...settingLabelStyleOverrides,
      ...specificStyleOverrides,
    };

    const props = {
      ...restSettingLabelProps,
      ...restSpecificProps,
    };

    return { className: classNames, style, props };
  };

  const buildSelectProps = (
    specificSelectProps?: React.SelectHTMLAttributes<HTMLSelectElement>
  ) => {
    const {
      className: specificClassName,
      style: specificStyleOverrides,
      ...restSpecificProps
    } = specificSelectProps ?? {};

    const classNames = [
      baseSelectClassNames,
      specificClassName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() || undefined;

    const style: React.CSSProperties = {
      ...settingSelectStyleOverrides,
      ...specificStyleOverrides,
    };

    const props = {
      ...restSettingSelectProps,
      ...restSpecificProps,
    };

    return { className: classNames, style, props };
  };

  const audioFieldConfig = buildFieldProps(audioFieldProps);
  const videoFieldConfig = buildFieldProps(videoFieldProps);
  const screenshareFieldConfig = buildFieldProps(screenshareFieldProps);
  const chatFieldConfig = buildFieldProps(chatFieldProps);

  const audioLabelConfig = buildLabelProps(audioLabelProps);
  const videoLabelConfig = buildLabelProps(videoLabelProps);
  const screenshareLabelConfig = buildLabelProps(screenshareLabelProps);
  const chatLabelConfig = buildLabelProps(chatLabelProps);

  const audioSelectConfig = buildSelectProps(audioSelectProps);
  const videoSelectConfig = buildSelectProps(videoSelectProps);
  const screenshareSelectConfig = buildSelectProps(screenshareSelectProps);
  const chatSelectConfig = buildSelectProps(chatSelectProps);

  const sectionRenderInfos: EventSettingSectionRenderInfo[] = [
    {
      key: "audio",
      label: audioLabelNode,
      value: audioState,
      options: audioOptionsList,
    },
    {
      key: "video",
      label: videoLabelNode,
      value: videoState,
      options: videoOptionsList,
    },
    {
      key: "screenshare",
      label: screenshareLabelNode,
      value: screenshareState,
      options: screenshareOptionsList,
    },
    {
      key: "chat",
      label: chatLabelNode,
      value: chatState,
      options: chatOptionsList,
    },
  ];

  const sectionConfigs = [
    {
      renderInfo: sectionRenderInfos[0],
      setValue: setAudioState,
      fieldConfig: audioFieldConfig,
      labelConfig: audioLabelConfig,
      selectConfig: audioSelectConfig,
    },
    {
      renderInfo: sectionRenderInfos[1],
      setValue: setVideoState,
      fieldConfig: videoFieldConfig,
      labelConfig: videoLabelConfig,
      selectConfig: videoSelectConfig,
    },
    {
      renderInfo: sectionRenderInfos[2],
      setValue: setScreenshareState,
      fieldConfig: screenshareFieldConfig,
      labelConfig: screenshareLabelConfig,
      selectConfig: screenshareSelectConfig,
    },
    {
      renderInfo: sectionRenderInfos[3],
      setValue: setChatState,
      fieldConfig: chatFieldConfig,
      labelConfig: chatLabelConfig,
      selectConfig: chatSelectConfig,
    },
  ];

  const sectionsNodes: React.ReactNode[] = sectionConfigs.flatMap(
    ({ renderInfo, setValue, fieldConfig, labelConfig, selectConfig }, index) => {
      const selectElement = (
        <select
          className={selectConfig.className}
          style={selectConfig.style}
          value={renderInfo.value}
          onChange={(e) => setValue(e.target.value)}
          {...selectConfig.props}
        >
          {renderInfo.options.map((option) => (
            <option key={`${renderInfo.key}-${option.value}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );

      const defaultSection = (
        <div
          className={fieldConfig.className}
          style={fieldConfig.style}
          {...fieldConfig.props}
        >
          <label
            className={labelConfig.className}
            style={labelConfig.style}
            {...labelConfig.props}
          >
            {renderInfo.label}
          </label>
          {selectElement}
        </div>
      );

      const sectionNode = renderSettingSection
        ? renderSettingSection({
            defaultSection,
            defaultSelect: selectElement,
            section: renderInfo,
            index,
            onChange: setValue,
          })
        : defaultSection;

      const nodes: React.ReactNode[] = [
        <React.Fragment key={`${renderInfo.key}-section`}>
          {sectionNode}
        </React.Fragment>,
      ];

      if (index < sectionConfigs.length - 1) {
        const defaultSeparatorElement = (
          <div
            className={separatorClassNames}
            style={separatorStyle}
            {...restSeparatorProps}
          />
        );

        const separatorNode = renderSeparator
          ? renderSeparator({
              defaultSeparator: defaultSeparatorElement,
              index,
            })
          : defaultSeparatorElement;

        nodes.push(
          <React.Fragment key={`${renderInfo.key}-separator`}>
            {separatorNode}
          </React.Fragment>
        );
      }

      return nodes;
    }
  );

  const defaultSettings = <>{sectionsNodes}</>;

  const settingsNode = renderSettings
    ? renderSettings({
        defaultSettings,
        sections: sectionRenderInfos,
      })
    : defaultSettings;

  const bodyContent = (
    <div className={bodyClassNames} style={bodyStyle} {...restBodyProps}>
      {settingsNode}
    </div>
  );

  const bodyNode = renderBody ? renderBody({ defaultBody: bodyContent }) : bodyContent;

  const headerContent = (
    <div className={headerClassNames} style={headerStyle} {...restHeaderProps}>
      <div className={titleClassNames} style={titleStyle} {...restTitleProps}>
        {title}
      </div>
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

  const headerNode = renderHeader ? renderHeader({ defaultHeader: headerContent }) : headerContent;

  const defaultFooter = (
    <div className={footerClassNames} style={footerStyle} {...restFooterProps}>
      <button
        type="button"
        className={saveButtonClassNames}
        style={saveButtonStyle}
        onClick={handleSaveClick}
        {...restSaveButtonProps}
      >
        {saveButtonLabel ?? "Save"}
      </button>
    </div>
  );

  const footerNode = renderFooter ? renderFooter({ defaultFooter }) : defaultFooter;

  const defaultContent = (
    <div className={contentClassNames} style={contentStyle} {...restContentProps}>
      {headerNode}
      <hr
        className={headerDividerClassNames}
        style={headerDividerStyle}
        {...restHeaderDividerProps}
      />
      {bodyNode}
      {footerNode}
    </div>
  );

  const contentNode = renderContent
    ? renderContent({
        defaultContent,
      })
    : defaultContent;

  return (
    <div className={overlayClassNames} style={overlayStyle} {...restOverlayProps}>
      {contentNode}
    </div>
  );
};

export default EventSettingsModal;
