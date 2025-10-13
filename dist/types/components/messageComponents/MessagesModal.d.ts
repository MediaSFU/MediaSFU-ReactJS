import React from "react";
import { SendMessageOptions } from "../../methods/messageMethods/sendMessage";
import { CoHostResponsibility, EventType, Message, Participant, ShowAlert } from "../../@types/types";
import { Socket } from "socket.io-client";
export interface MessagesModalOptions {
    isMessagesModalVisible: boolean;
    onMessagesClose: () => void;
    onSendMessagePress?: (options: SendMessageOptions) => Promise<void>;
    messages: Message[];
    eventType: EventType;
    member: string;
    islevel: string;
    coHostResponsibility: CoHostResponsibility[];
    coHost: string;
    startDirectMessage: boolean;
    directMessageDetails: Participant | null;
    updateStartDirectMessage: (start: boolean) => void;
    updateDirectMessageDetails: (participant: Participant | null) => void;
    showAlert?: ShowAlert;
    roomName: string;
    socket: Socket;
    chatSetting: string;
    position?: string;
    backgroundColor?: string;
    activeTabBackgroundColor?: string;
    title?: React.ReactNode;
    overlayProps?: React.HTMLAttributes<HTMLDivElement>;
    contentProps?: React.HTMLAttributes<HTMLDivElement>;
    headerProps?: React.HTMLAttributes<HTMLDivElement>;
    titleProps?: React.HTMLAttributes<HTMLDivElement>;
    tabListProps?: React.HTMLAttributes<HTMLDivElement>;
    tabButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    closeButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    closeIconComponent?: React.ReactNode;
    bodyProps?: React.HTMLAttributes<HTMLDivElement>;
    directPanelWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    groupPanelWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    emptyState?: React.ReactNode | ((context: {
        type: "direct" | "group";
    }) => React.ReactNode);
    renderHeader?: (options: {
        defaultHeader: React.ReactNode;
        activeTab: "direct" | "group";
        onClose: () => void;
    }) => React.ReactNode;
    renderTabs?: (options: {
        defaultTabs: React.ReactNode;
        activeTab: "direct" | "group";
        switchToDirect: () => void;
        switchToGroup: () => void;
    }) => React.ReactNode;
    renderTabButton?: (options: {
        type: "direct" | "group";
        isActive: boolean;
        defaultButton: React.ReactNode;
        switchTo: () => void;
    }) => React.ReactNode;
    renderPanels?: (options: {
        defaultPanels: React.ReactNode;
        activeTab: "direct" | "group";
    }) => React.ReactNode;
    renderBody?: (options: {
        defaultBody: React.ReactNode;
        activeTab: "direct" | "group";
    }) => React.ReactNode;
    renderContent?: (options: {
        defaultContent: React.ReactNode;
        activeTab: "direct" | "group";
    }) => React.ReactNode;
}
export type MessagesModalType = (options: MessagesModalOptions) => React.JSX.Element;
/**
 * MessagesModal - Tabbed chat interface for direct and group messaging
 *
 * A comprehensive messaging modal with support for both direct (1-on-1) and group chat.
 * Features tabbed navigation, message history display, and configurable chat permissions
 * based on event settings and user roles.
 *
 * Features:
 * - Dual-tab interface (Direct/Group messages)
 * - Direct message initiation from participant list
 * - Message history with timestamp display
 * - Role-based chat permissions (host/co-host/participant)
 * - Chat enable/disable based on event settings
 * - Custom tab styling and active states
 * - Message composition with send functionality
 * - Empty state handling for no messages
 * - Custom render hooks for complete UI flexibility
 *
 * @component
 * @param {MessagesModalOptions} options - Configuration options
 * @param {boolean} options.isMessagesModalVisible - Modal visibility state
 * @param {Function} options.onMessagesClose - Callback when modal is closed
 * @param {Function} [options.onSendMessagePress] - Handler for sending messages (defaults to built-in)
 * @param {Message[]} options.messages - Array of all messages (direct + group)
 * @param {EventType} options.eventType - Event type (conference, webinar, etc.)
 * @param {string} options.member - Current user's member ID
 * @param {string} options.islevel - User level ('2'=host, '1'=co-host, '0'=participant)
 * @param {CoHostResponsibility[]} options.coHostResponsibility - Co-host permissions array
 * @param {string} options.coHost - Co-host ID
 * @param {boolean} options.startDirectMessage - Whether to open in direct message mode
 * @param {Participant|null} options.directMessageDetails - Participant for direct messaging
 * @param {Function} options.updateStartDirectMessage - Update direct message mode state
 * @param {Function} options.updateDirectMessageDetails - Update direct message participant
 * @param {ShowAlert} [options.showAlert] - Alert display function
 * @param {string} options.roomName - Meeting/room identifier
 * @param {Socket} options.socket - Socket.io client instance
 * @param {string} options.chatSetting - Chat permission setting ('allow', 'disallow')
 * @param {string} [options.position] - Modal position on screen
 * @param {string} [options.backgroundColor] - Modal background color
 * @param {string} [options.activeTabBackgroundColor] - Active tab background color
 * @param {React.ReactNode} [options.title] - Modal title content
 * @param {object} [options.overlayProps] - HTML attributes for overlay div
 * @param {object} [options.contentProps] - HTML attributes for content container
 * @param {object} [options.headerProps] - HTML attributes for header section
 * @param {object} [options.titleProps] - HTML attributes for title element
 * @param {object} [options.tabListProps] - HTML attributes for tab list container
 * @param {object} [options.tabButtonProps] - HTML attributes for tab buttons
 * @param {object} [options.closeButtonProps] - HTML attributes for close button
 * @param {React.ReactNode} [options.closeIconComponent] - Custom close icon
 * @param {object} [options.bodyProps] - HTML attributes for body section
 * @param {object} [options.directPanelWrapperProps] - HTML attributes for direct message panel wrapper
 * @param {object} [options.groupPanelWrapperProps] - HTML attributes for group message panel wrapper
 * @param {React.ReactNode|Function} [options.emptyState] - Content when no messages exist
 * @param {Function} [options.renderHeader] - Custom header renderer
 * @param {Function} [options.renderTabs] - Custom tabs renderer
 * @param {Function} [options.renderTabButton] - Custom individual tab button renderer
 * @param {Function} [options.renderPanels] - Custom message panels renderer
 * @param {Function} [options.renderBody] - Custom body renderer
 * @param {Function} [options.renderContent] - Custom content renderer
 *
 * @returns {React.JSX.Element} Rendered messages modal
 *
 * @example
 * // Basic chat modal with default styling
 * ```tsx
 * import React, { useState } from 'react';
 * import { MessagesModal } from 'mediasfu-reactjs';
 *
 * function ChatInterface({ messages, socket, roomName, member }) {
 *   const [isVisible, setIsVisible] = useState(false);
 *   const [startDirect, setStartDirect] = useState(false);
 *   const [directDetails, setDirectDetails] = useState(null);
 *
 *   return (
 *     <>
 *       <button onClick={() => setIsVisible(true)}>
 *         Open Chat ({messages.length})
 *       </button>
 *       <MessagesModal
 *         isMessagesModalVisible={isVisible}
 *         onMessagesClose={() => setIsVisible(false)}
 *         messages={messages}
 *         eventType="conference"
 *         member={member}
 *         islevel="2"
 *         coHostResponsibility={[]}
 *         coHost=""
 *         startDirectMessage={startDirect}
 *         directMessageDetails={directDetails}
 *         updateStartDirectMessage={setStartDirect}
 *         updateDirectMessageDetails={setDirectDetails}
 *         roomName={roomName}
 *         socket={socket}
 *         chatSetting="allow"
 *         backgroundColor="#0f172a"
 *         position="topRight"
 *       />
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * // Custom tab styling with gradient active state
 * ```tsx
 * import { MessagesModal } from 'mediasfu-reactjs';
 *
 * function StyledChat({ messages, socket, roomName, member }) {
 *   return (
 *     <MessagesModal
 *       isMessagesModalVisible={true}
 *       onMessagesClose={() => {}}
 *       messages={messages}
 *       eventType="webinar"
 *       member={member}
 *       islevel="2"
 *       coHostResponsibility={[]}
 *       coHost=""
 *       startDirectMessage={false}
 *       directMessageDetails={null}
 *       updateStartDirectMessage={() => {}}
 *       updateDirectMessageDetails={() => {}}
 *       roomName={roomName}
 *       socket={socket}
 *       chatSetting="allow"
 *       backgroundColor="#1e3a8a"
 *       activeTabBackgroundColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
 *       contentProps={{
 *         style: {
 *           borderRadius: 20,
 *           border: '2px solid #3b82f6',
 *           boxShadow: '0 20px 60px rgba(59,130,246,0.3)',
 *         },
 *       }}
 *       tabButtonProps={{
 *         style: {
 *           borderRadius: '12px 12px 0 0',
 *           padding: '12px 24px',
 *           fontWeight: 600,
 *           transition: 'all 0.2s ease',
 *         },
 *       }}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * // Custom rendering with analytics and empty states
 * ```tsx
 * import { MessagesModal } from 'mediasfu-reactjs';
 *
 * function AnalyticsChat({ messages, socket, roomName, member }) {
 *   return (
 *     <MessagesModal
 *       isMessagesModalVisible={true}
 *       onMessagesClose={() => {}}
 *       messages={messages}
 *       eventType="conference"
 *       member={member}
 *       islevel="2"
 *       coHostResponsibility={[]}
 *       coHost=""
 *       startDirectMessage={false}
 *       directMessageDetails={null}
 *       updateStartDirectMessage={() => {}}
 *       updateDirectMessageDetails={() => {}}
 *       roomName={roomName}
 *       socket={socket}
 *       chatSetting="allow"
 *       onSendMessagePress={async (options) => {
 *         analytics.track('message_sent', {
 *           type: options.type,
 *           length: options.message.length,
 *         });
 *         return sendMessage(options);
 *       }}
 *       emptyState={({ type }) => (
 *         <div style={{
 *           textAlign: 'center',
 *           padding: 40,
 *           color: '#9ca3af',
 *         }}>
 *           <h3>No {type} messages yet</h3>
 *           <p>Start a conversation!</p>
 *         </div>
 *       )}
 *       renderTabButton={({ type, isActive, defaultButton, switchTo }) => (
 *         <button
 *           onClick={() => {
 *             analytics.track('chat_tab_switched', { to: type });
 *             switchTo();
 *           }}
 *           style={{
 *             background: isActive
 *               ? 'linear-gradient(135deg, #22c55e 0%, #14532d 100%)'
 *               : 'transparent',
 *             color: isActive ? 'white' : '#9ca3af',
 *             padding: '10px 20px',
 *             borderRadius: '8px 8px 0 0',
 *             border: 'none',
 *             cursor: 'pointer',
 *             fontWeight: isActive ? 700 : 400,
 *             transition: 'all 0.2s ease',
 *           }}
 *         >
 *           {type === 'direct' ? '💬 Direct' : '👥 Group'}
 *         </button>
 *       )}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * // Override with MediasfuGeneric uiOverrides
 * ```tsx
 * import { MediasfuGeneric, MessagesModal } from 'mediasfu-reactjs';
 *
 * const uiOverrides = {
 *   messagesModal: {
 *     component: (props) => (
 *       <MessagesModal
 *         {...props}
 *         backgroundColor="#0f172a"
 *         activeTabBackgroundColor="#3b82f6"
 *         position="topRight"
 *         contentProps={{
 *           style: {
 *             maxHeight: '80vh',
 *             borderRadius: 20,
 *             border: '2px solid #3b82f6',
 *           },
 *         }}
 *         tabListProps={{
 *           style: {
 *             borderBottom: '2px solid #1e3a8a',
 *             padding: '0 16px',
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
declare const MessagesModal: React.FC<MessagesModalOptions>;
export default MessagesModal;
//# sourceMappingURL=MessagesModal.d.ts.map