import React from "react";
import type { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { MeetingIdComponentOptions } from "./MeetingIDComponent";
import { MeetingPasscodeComponentOptions } from "./MeetingPasscodeComponent";
import { ShareButtonsComponentOptions } from "./ShareButtonsComponent";
import { CustomButton, CustomButtonsOptions } from "./CustomButtons";
import { EventType } from "../../@types/types";
export interface MenuModalOptions {
    backgroundColor?: string;
    isVisible: boolean;
    onClose: () => void;
    customButtons?: CustomButton[];
    shareButtons?: boolean;
    position?: string;
    roomName: string;
    adminPasscode: string;
    islevel: string;
    eventType: EventType;
    localLink?: string;
    title?: React.ReactNode;
    menuIcon?: React.ReactNode;
    menuIconProps?: Partial<FontAwesomeIconProps>;
    closeIcon?: React.ReactNode;
    closeIconProps?: Partial<FontAwesomeIconProps>;
    overlayProps?: React.HTMLAttributes<HTMLDivElement>;
    contentProps?: React.HTMLAttributes<HTMLDivElement>;
    headerProps?: React.HTMLAttributes<HTMLDivElement>;
    titleWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    badgeWrapperProps?: React.HTMLAttributes<HTMLSpanElement>;
    closeButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    dividerProps?: React.HTMLAttributes<HTMLHRElement>;
    bodyProps?: React.HTMLAttributes<HTMLDivElement>;
    scrollWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    customButtonsWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    customButtonsComponentProps?: Partial<CustomButtonsOptions>;
    meetingPasscodeWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    meetingPasscodeComponentProps?: Partial<MeetingPasscodeComponentOptions>;
    meetingIdWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    meetingIdComponentProps?: Partial<MeetingIdComponentOptions>;
    shareButtonsWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    shareButtonsComponentProps?: Partial<ShareButtonsComponentOptions>;
    sectionsDividerProps?: React.HTMLAttributes<HTMLHRElement>;
    renderHeader?: (options: {
        defaultHeader: React.ReactNode;
        onClose: () => void;
    }) => React.ReactNode;
    renderTitle?: (options: {
        defaultTitle: React.ReactNode;
        menuIcon: React.ReactNode;
        titleContent: React.ReactNode;
    }) => React.ReactNode;
    renderCustomButtons?: (options: {
        defaultCustomButtons: React.ReactNode;
        buttons: CustomButton[];
    }) => React.ReactNode;
    renderMeetingPasscode?: (options: {
        defaultMeetingPasscode: React.ReactNode;
        adminPasscode: string;
        isHost: boolean;
    }) => React.ReactNode;
    renderMeetingId?: (options: {
        defaultMeetingId: React.ReactNode;
        roomName: string;
    }) => React.ReactNode;
    renderShareButtons?: (options: {
        defaultShareButtons: React.ReactNode;
        hasShareButtons: boolean;
    }) => React.ReactNode;
    renderBody?: (options: {
        defaultBody: React.ReactNode;
    }) => React.ReactNode;
    renderContent?: (options: {
        defaultContent: React.ReactNode;
    }) => React.ReactNode;
}
export type MenuModalType = (options: MenuModalOptions) => React.JSX.Element;
/**
 * MenuModal - Quick actions tray with meeting info, sharing, and custom buttons
 *
 * A comprehensive menu modal that provides access to meeting details (ID, passcode),
 * share functionality, and custom action buttons. Perfect for exposing common actions
 * and meeting information in a compact, accessible interface.
 *
 * Features:
 * - Meeting ID display with copy functionality
 * - Admin passcode display (host only)
 * - Configurable share buttons for inviting participants
 * - Custom action buttons with icons and styling
 * - Flexible positioning (bottomRight, topRight, etc.)
 * - Custom render hooks for complete customization
 * - Responsive design with scrollable content
 *
 * @component
 * @param {MenuModalOptions} options - Configuration options
 * @param {string} [options.backgroundColor="#83c0e9"] - Modal content background color
 * @param {boolean} options.isVisible - Modal visibility state
 * @param {Function} options.onClose - Callback when modal is closed
 * @param {CustomButton[]} [options.customButtons=[]] - Array of custom action buttons
 * @param {boolean} [options.shareButtons=true] - Show share buttons section
 * @param {string} [options.position="bottomRight"] - Modal position (bottomRight, topRight, etc.)
 * @param {string} options.roomName - Meeting/room identifier
 * @param {string} options.adminPasscode - Admin passcode (shown to hosts only)
 * @param {string} options.islevel - User level ('2'=host, '1'=co-host, '0'=participant)
 * @param {EventType} options.eventType - Event type (conference, webinar, etc.)
 * @param {string} [options.localLink] - Local server link for self-hosted scenarios
 * @param {React.ReactNode} [options.title="Menu"] - Modal title content
 * @param {React.ReactNode} [options.menuIcon] - Custom menu icon (defaults to faBars)
 * @param {React.ReactNode} [options.closeIcon] - Custom close icon (defaults to faTimes)
 * @param {object} [options.overlayProps] - HTML attributes for overlay div
 * @param {object} [options.contentProps] - HTML attributes for content container
 * @param {object} [options.headerProps] - HTML attributes for header section
 * @param {object} [options.titleWrapperProps] - HTML attributes for title wrapper
 * @param {object} [options.closeButtonProps] - HTML attributes for close button
 * @param {object} [options.bodyProps] - HTML attributes for body section
 * @param {Function} [options.renderHeader] - Custom header renderer
 * @param {Function} [options.renderTitle] - Custom title renderer
 * @param {Function} [options.renderCustomButtons] - Custom buttons section renderer
 * @param {Function} [options.renderMeetingPasscode] - Custom passcode section renderer
 * @param {Function} [options.renderMeetingId] - Custom meeting ID section renderer
 * @param {Function} [options.renderShareButtons] - Custom share buttons renderer
 * @param {Function} [options.renderBody] - Custom body renderer
 * @param {Function} [options.renderContent] - Custom content renderer
 *
 * @returns {React.JSX.Element} Rendered menu modal
 *
 * @example
 * // Basic menu with meeting info and share buttons
 * ```tsx
 * import React, { useState } from 'react';
 * import { MenuModal } from 'mediasfu-reactjs';
 *
 * function MeetingMenu() {
 *   const [isMenuVisible, setIsMenuVisible] = useState(false);
 *
 *   return (
 *     <>
 *       <button onClick={() => setIsMenuVisible(true)}>Open Menu</button>
 *       <MenuModal
 *         isVisible={isMenuVisible}
 *         onClose={() => setIsMenuVisible(false)}
 *         roomName="meeting-123-456"
 *         adminPasscode="1234"
 *         islevel="2"
 *         eventType="conference"
 *         shareButtons={true}
 *         backgroundColor="#0f172a"
 *         position="bottomRight"
 *       />
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * // Menu with custom action buttons
 * ```tsx
 * import { MenuModal } from 'mediasfu-reactjs';
 * import { faRecordVinyl, faUsers, faChartLine } from '@fortawesome/free-solid-svg-icons';
 *
 * function CustomActionsMenu({ isVisible, onClose, onStartRecording, onViewStats }) {
 *   const customButtons = [
 *     {
 *       action: onStartRecording,
 *       show: true,
 *       backgroundColor: "#dc2626",
 *       disabled: false,
 *       icon: faRecordVinyl,
 *       text: "Start Recording",
 *       textStyle: { color: "white", fontWeight: 600 },
 *     },
 *     {
 *       action: onViewStats,
 *       show: true,
 *       backgroundColor: "#3b82f6",
 *       disabled: false,
 *       icon: faChartLine,
 *       text: "View Statistics",
 *       textStyle: { color: "white" },
 *     },
 *     {
 *       action: () => console.log("Manage participants"),
 *       show: true,
 *       backgroundColor: "#22c55e",
 *       icon: faUsers,
 *       text: "Manage Participants",
 *     },
 *   ];
 *
 *   return (
 *     <MenuModal
 *       isVisible={isVisible}
 *       onClose={onClose}
 *       customButtons={customButtons}
 *       shareButtons={false}
 *       roomName="event-789"
 *       adminPasscode="secure123"
 *       islevel="2"
 *       eventType="webinar"
 *       backgroundColor="#1e3a8a"
 *       position="topRight"
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * // Custom rendering with branded styling
 * ```tsx
 * import { MenuModal } from 'mediasfu-reactjs';
 *
 * function BrandedMenu({ isVisible, onClose, roomName, passcode }) {
 *   return (
 *     <MenuModal
 *       isVisible={isVisible}
 *       onClose={onClose}
 *       roomName={roomName}
 *       adminPasscode={passcode}
 *       islevel="2"
 *       eventType="conference"
 *       backgroundColor="transparent"
 *       contentProps={{
 *         style: {
 *           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
 *           borderRadius: 16,
 *           boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
 *         },
 *       }}
 *       renderTitle={({ defaultTitle, titleContent }) => (
 *         <div style={{
 *           display: 'flex',
 *           alignItems: 'center',
 *           gap: 12,
 *           fontSize: 20,
 *           fontWeight: 700,
 *           color: '#ffffff',
 *         }}>
 *           <span>🎯</span>
 *           {titleContent}
 *         </div>
 *       )}
 *       renderMeetingId={({ defaultMeetingId, roomName }) => (
 *         <div style={{
 *           padding: 16,
 *           backgroundColor: 'rgba(255,255,255,0.1)',
 *           borderRadius: 12,
 *           backdropFilter: 'blur(10px)',
 *         }}>
 *           <p style={{ color: '#e2e8f0', fontSize: 12, marginBottom: 4 }}>Meeting ID</p>
 *           <p style={{ color: '#ffffff', fontSize: 16, fontWeight: 600, fontFamily: 'monospace' }}>
 *             {roomName}
 *           </p>
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
 * import { MediasfuGeneric, MenuModal } from 'mediasfu-reactjs';
 *
 * const uiOverrides = {
 *   menuModal: {
 *     component: (props) => (
 *       <MenuModal
 *         {...props}
 *         backgroundColor="#0f172a"
 *         position="topRight"
 *         contentProps={{
 *           style: {
 *             borderRadius: 20,
 *             border: '2px solid #3b82f6',
 *             boxShadow: '0 10px 40px rgba(59,130,246,0.3)',
 *           },
 *         }}
 *         customButtonsComponentProps={{
 *           buttonStyle: {
 *             borderRadius: 12,
 *             padding: '12px 20px',
 *             transition: 'all 0.2s ease',
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
declare const MenuModal: React.FC<MenuModalOptions>;
export default MenuModal;
//# sourceMappingURL=MenuModal.d.ts.map