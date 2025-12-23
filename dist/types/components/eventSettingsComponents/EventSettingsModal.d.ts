import React from "react";
import { ModifySettingsOptions } from "../../methods/settingsMethods/modifySettings";
import "./EventSettingsModal.css";
import { Socket } from "socket.io-client";
import { ShowAlert } from "../../@types/types";
import { ModalRenderMode } from '../menuComponents/MenuModal';
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
    renderHeader?: (params: {
        defaultHeader: React.ReactNode;
    }) => React.ReactNode;
    renderBody?: (params: {
        defaultBody: React.ReactNode;
    }) => React.ReactNode;
    renderSettings?: (params: {
        defaultSettings: React.ReactNode;
        sections: EventSettingSectionRenderInfo[];
    }) => React.ReactNode;
    renderSettingSection?: (params: RenderSettingSectionParams) => React.ReactNode;
    renderSeparator?: (params: {
        defaultSeparator: React.ReactNode;
        index: number;
    }) => React.ReactNode;
    renderFooter?: (params: {
        defaultFooter: React.ReactNode;
    }) => React.ReactNode;
    renderContent?: (params: {
        defaultContent: React.ReactNode;
    }) => React.ReactNode;
    /** Theme control - whether dark mode is active */
    isDarkMode?: boolean;
    /** Enable glassmorphism effects (modern UI) */
    enableGlassmorphism?: boolean;
    /** Render mode: modal (default overlay), sidebar (inline for desktop), inline (no wrapper) */
    renderMode?: ModalRenderMode;
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
declare const EventSettingsModal: React.FC<EventSettingsModalOptions>;
export default EventSettingsModal;
//# sourceMappingURL=EventSettingsModal.d.ts.map