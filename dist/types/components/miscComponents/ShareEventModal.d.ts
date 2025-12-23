import React from "react";
import type { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { MeetingIdComponentOptions } from "../menuComponents/MeetingIDComponent";
import { MeetingPasscodeComponentOptions } from "../menuComponents/MeetingPasscodeComponent";
import { ShareButtonsComponentOptions } from "../menuComponents/ShareButtonsComponent";
import { EventType } from "../../@types/types";
import { ModalRenderMode } from '../menuComponents/MenuModal';
export interface ShareEventModalOptions {
    backgroundColor?: string;
    isShareEventModalVisible: boolean;
    onShareEventClose: () => void;
    shareButtons?: boolean;
    position?: "topRight" | "topLeft" | "bottomRight" | "bottomLeft";
    roomName: string;
    adminPasscode?: string;
    islevel?: string;
    eventType: EventType;
    localLink?: string;
    overlayProps?: React.HTMLAttributes<HTMLDivElement>;
    contentProps?: React.HTMLAttributes<HTMLDivElement>;
    headerProps?: React.HTMLAttributes<HTMLDivElement>;
    closeButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    closeIcon?: React.ReactNode;
    closeIconProps?: Partial<FontAwesomeIconProps>;
    dividerProps?: React.HTMLAttributes<HTMLHRElement>;
    bodyProps?: React.HTMLAttributes<HTMLDivElement>;
    meetingPasscodeWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    meetingPasscodeComponentProps?: Partial<MeetingPasscodeComponentOptions>;
    meetingIdWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    meetingIdComponentProps?: Partial<MeetingIdComponentOptions>;
    shareButtonsWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    shareButtonsComponentProps?: Partial<ShareButtonsComponentOptions>;
    renderHeader?: (options: {
        defaultHeader: React.ReactNode;
        closeButton: React.ReactNode;
    }) => React.ReactNode;
    renderCloseButton?: (options: {
        defaultCloseButton: React.ReactNode;
        onClose: () => void;
    }) => React.ReactNode;
    renderDivider?: (options: {
        defaultDivider: React.ReactNode;
    }) => React.ReactNode;
    renderMeetingPasscode?: (options: {
        defaultMeetingPasscode: React.ReactNode;
        adminPasscode?: string;
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
        meetingPasscode: React.ReactNode | null;
        meetingId: React.ReactNode;
        shareButtons: React.ReactNode | null;
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
export type ShareEventModalType = (options: ShareEventModalOptions) => React.JSX.Element;
/**
 * ShareEventModal - A modal component for sharing event/meeting details with participants.
 *
 * This component provides a comprehensive interface for displaying and sharing meeting information including
 * room IDs, passcodes, and integration with social sharing buttons. It intelligently adapts content based on
 * user permissions and event type.
 *
 * **Key Features:**
 * - **Meeting ID Display**: Shows formatted room name/ID with copy functionality via MeetingIdComponent
 * - **Admin Passcode**: Conditionally displays admin passcode for hosts (level "2")
 * - **Share Buttons**: Optional integration with ShareButtonsComponent for social/email sharing
 * - **Event Type Support**: Adapts display for different event types (meeting, webinar, conference, broadcast, chat)
 * - **Flexible Positioning**: Configurable modal position (topRight, topLeft, bottomRight, bottomLeft)
 * - **Local Links**: Support for custom local links for event access
 * - **Component Integration**: Seamless integration with MeetingIdComponent, MeetingPasscodeComponent, ShareButtonsComponent
 * - **HTML Attributes**: Granular control over all UI elements (overlay, content, header, sections)
 * - **Render Hooks**: Complete override capability for header, sections, and layout
 * - **Responsive Design**: Automatic positioning and responsive behavior
 * - **Accessibility**: Semantic structure with clear sections and close functionality
 *
 * @component
 *
 * @param {ShareEventModalOptions} props - Configuration options for ShareEventModal
 * @param {string} [props.backgroundColor="rgba(255, 255, 255, 0.25)"] - Background color for modal content
 * @param {boolean} props.isShareEventModalVisible - Controls modal visibility
 * @param {() => void} props.onShareEventClose - Callback function invoked when modal is closed
 * @param {boolean} [props.shareButtons=true] - Controls visibility of social share buttons
 * @param {"topRight" | "topLeft" | "bottomRight" | "bottomLeft"} [props.position="topRight"] - Modal screen position
 * @param {string} props.roomName - Meeting/room identifier to be shared
 * @param {string} [props.adminPasscode] - Admin passcode for host access (only shown to hosts)
 * @param {string} [props.islevel] - User permission level ("2" = host, shows admin passcode)
 * @param {EventType} props.eventType - Type of event (meeting, webinar, conference, broadcast, chat)
 * @param {string} [props.localLink] - Custom local link for event access
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.overlayProps] - HTML attributes for overlay container
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.contentProps] - HTML attributes for content wrapper
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.headerProps] - HTML attributes for header section
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} [props.closeButtonProps] - HTML attributes for close button
 * @param {React.ReactNode} [props.closeIcon] - Custom close icon component
 * @param {Partial<FontAwesomeIconProps>} [props.closeIconProps] - FontAwesome icon props for close icon
 * @param {React.HTMLAttributes<HTMLHRElement>} [props.dividerProps] - HTML attributes for divider elements
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.bodyProps] - HTML attributes for body section
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.meetingPasscodeWrapperProps] - HTML attributes for passcode wrapper
 * @param {Partial<MeetingPasscodeComponentOptions>} [props.meetingPasscodeComponentProps] - Props for MeetingPasscodeComponent
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.meetingIdWrapperProps] - HTML attributes for meeting ID wrapper
 * @param {Partial<MeetingIdComponentOptions>} [props.meetingIdComponentProps] - Props for MeetingIdComponent
 * @param {React.HTMLAttributes<HTMLDivElement>} [props.shareButtonsWrapperProps] - HTML attributes for share buttons wrapper
 * @param {Partial<ShareButtonsComponentOptions>} [props.shareButtonsComponentProps] - Props for ShareButtonsComponent
 * @param {(options: {defaultHeader: React.ReactNode; closeButton: React.ReactNode}) => React.ReactNode} [props.renderHeader] - Custom render function for header
 * @param {(options: {defaultCloseButton: React.ReactNode; onClose: () => void}) => React.ReactNode} [props.renderCloseButton] - Custom render function for close button
 * @param {(options: {defaultDivider: React.ReactNode}) => React.ReactNode} [props.renderDivider] - Custom render function for divider
 * @param {(options: {defaultMeetingPasscode: React.ReactNode; adminPasscode?: string; isHost: boolean}) => React.ReactNode} [props.renderMeetingPasscode] - Custom render function for meeting passcode section
 * @param {(options: {defaultMeetingId: React.ReactNode; roomName: string}) => React.ReactNode} [props.renderMeetingId] - Custom render function for meeting ID section
 * @param {(options: {defaultShareButtons: React.ReactNode; hasShareButtons: boolean}) => React.ReactNode} [props.renderShareButtons] - Custom render function for share buttons
 * @param {(options: {defaultBody: React.ReactNode; meetingPasscode: React.ReactNode | null; meetingId: React.ReactNode; shareButtons: React.ReactNode | null}) => React.ReactNode} [props.renderBody] - Custom render function for modal body
 * @param {(options: {defaultContent: React.ReactNode}) => React.ReactNode} [props.renderContent] - Custom render function for entire content
 *
 * @returns {React.JSX.Element} The rendered ShareEventModal component
 *
 * @example
 * // Basic usage for sharing meeting details
 * ```tsx
 * import React, { useState } from 'react';
 * import { ShareEventModal } from 'mediasfu-reactjs';
 *
 * const BasicShareModal = () => {
 *   const [showModal, setShowModal] = useState(true);
 *
 *   return (
 *     <ShareEventModal
 *       isShareEventModalVisible={showModal}
 *       onShareEventClose={() => setShowModal(false)}
 *       roomName="meeting-room-123"
 *       eventType="meeting"
 *       islevel="2"
 *       adminPasscode="ADMIN2024"
 *       shareButtons={true}
 *     />
 *   );
 * };
 * ```
 *
 * @example
 * // Custom styled for different event types
 * ```tsx
 * import React, { useState } from 'react';
 * import { ShareEventModal } from 'mediasfu-reactjs';
 *
 * const WebinarShareModal = () => {
 *   const [showModal, setShowModal] = useState(true);
 *
 *   return (
 *     <ShareEventModal
 *       isShareEventModalVisible={showModal}
 *       onShareEventClose={() => setShowModal(false)}
 *       roomName="webinar-2024-ai"
 *       eventType="webinar"
 *       islevel="1"
 *       backgroundColor="rgba(46, 204, 113, 0.3)"
 *       position="bottomRight"
 *       localLink="https://mywebinar.com/join/webinar-2024-ai"
 *       contentProps={{
 *         style: {
 *           borderRadius: '12px',
 *           boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
 *         }
 *       }}
 *       headerProps={{
 *         style: {
 *           background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
 *           color: '#fff',
 *           padding: '16px'
 *         }
 *       }}
 *     />
 *   );
 * };
 * ```
 *
 * @example
 * // Analytics tracking for share interactions
 * ```tsx
 * import React, { useState } from 'react';
 * import { ShareEventModal } from 'mediasfu-reactjs';
 *
 * const AnalyticsShareModal = () => {
 *   const [showModal, setShowModal] = useState(true);
 *
 *   const handleClose = () => {
 *     analytics.track('Share Modal Closed', {
 *       roomName: 'meeting-room-123',
 *       eventType: 'conference'
 *     });
 *     setShowModal(false);
 *   };
 *
 *   return (
 *     <ShareEventModal
 *       isShareEventModalVisible={showModal}
 *       onShareEventClose={handleClose}
 *       roomName="meeting-room-123"
 *       eventType="conference"
 *       islevel="2"
 *       adminPasscode="CONF2024"
 *       renderMeetingId={({ defaultMeetingId, roomName }) => {
 *         // Track when meeting ID is displayed
 *         React.useEffect(() => {
 *           analytics.track('Meeting ID Displayed', { roomName });
 *         }, [roomName]);
 *         return defaultMeetingId;
 *       }}
 *       shareButtonsComponentProps={{
 *         onShareButtonPress: (platform) => {
 *           analytics.track('Share Button Clicked', {
 *             platform,
 *             roomName: 'meeting-room-123'
 *           });
 *         }
 *       }}
 *     />
 *   );
 * };
 * ```
 *
 * @example
 * // Integration with MediasfuGeneric using uiOverrides
 * ```tsx
 * import React, { useState } from 'react';
 * import { MediasfuGeneric, ShareEventModal } from 'mediasfu-reactjs';
 *
 * const CustomShareComponent = (props) => (
 *   <ShareEventModal
 *     {...props}
 *     position="topLeft"
 *     renderBody={({ meetingPasscode, meetingId, shareButtons }) => (
 *       <div className="custom-share-layout">
 *         <div className="share-info-section">
 *           <h3>Join This Meeting</h3>
 *           {meetingId}
 *           {meetingPasscode && (
 *             <div className="host-credentials">
 *               <h4>🔐 Host Credentials</h4>
 *               {meetingPasscode}
 *             </div>
 *           )}
 *         </div>
 *         {shareButtons && (
 *           <div className="share-actions">
 *             <h4>Share with Others</h4>
 *             {shareButtons}
 *           </div>
 *         )}
 *       </div>
 *     )}
 *   />
 * );
 *
 * const App = () => {
 *   const [credentials] = useState({
 *     apiUserName: 'user123',
 *     apiKey: 'your-api-key'
 *   });
 *
 *   return (
 *     <MediasfuGeneric
 *       credentials={credentials}
 *       uiOverrides={{
 *         ShareEventModal: CustomShareComponent
 *       }}
 *     />
 *   );
 * };
 * ```
 *       )}
 *     />
 *   );
 * };
 *
 * export default App;
 * ```
 */
declare const ShareEventModal: React.FC<ShareEventModalOptions>;
export default ShareEventModal;
//# sourceMappingURL=ShareEventModal.d.ts.map