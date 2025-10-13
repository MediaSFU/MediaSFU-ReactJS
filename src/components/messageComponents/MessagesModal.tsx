import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import MessagePanel from "./MessagePanel";
import {
  sendMessage,
  SendMessageOptions,
} from "../../methods/messageMethods/sendMessage";
import {
  CoHostResponsibility,
  EventType,
  Message,
  Participant,
  ShowAlert,
} from "../../@types/types";
import { Socket } from "socket.io-client";

// Define component props
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
  emptyState?: React.ReactNode | ((context: { type: "direct" | "group" }) => React.ReactNode);
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

export type MessagesModalType = (
  options: MessagesModalOptions
) => React.JSX.Element;

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

const MessagesModal: React.FC<MessagesModalOptions> = ({
  isMessagesModalVisible,
  onMessagesClose,
  onSendMessagePress = sendMessage,
  messages,
  eventType,
  member,
  islevel,
  coHostResponsibility,
  coHost,
  startDirectMessage,
  directMessageDetails,
  updateStartDirectMessage,
  updateDirectMessageDetails,
  showAlert,
  roomName,
  socket,
  chatSetting,
  position = "topRight",
  backgroundColor = "#f5f5f5",
  activeTabBackgroundColor = "#2b7ce5",
  title = "Messages",
  overlayProps,
  contentProps,
  headerProps,
  titleProps,
  tabListProps,
  tabButtonProps,
  closeButtonProps,
  closeIconComponent,
  bodyProps,
  directPanelWrapperProps,
  groupPanelWrapperProps,
  emptyState,
  renderHeader,
  renderTabs,
  renderTabButton,
  renderPanels,
  renderBody,
  renderContent,
}) => {
  const initialTab = useMemo<"direct" | "group">(() => {
    if (eventType === "webinar" || eventType === "conference") {
      return "direct";
    }
    return "group";
  }, [eventType]);

  const [activeTab, setActiveTab] = useState<"direct" | "group">(initialTab);
  const [focusedInput, setFocusedInput] = useState(false);
  const [directMessages, setDirectMessages] = useState<Message[]>([]);
  const [groupMessages, setGroupMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!isMessagesModalVisible) {
      return;
    }

    const chatValue = coHostResponsibility?.find(
      (item: { name: string }) => item.name === "chat"
    )?.value;

    const directMsgs = messages.filter(
      (message) =>
        !message.group &&
        (message.sender === member ||
          message.receivers.includes(member) ||
          islevel === "2" ||
          (coHost === member && chatValue === true))
    );
    const groupMsgs = messages.filter((message) => message.group);

    setDirectMessages(directMsgs);
    setGroupMessages(groupMsgs);
  }, [
    coHost,
    coHostResponsibility,
    isMessagesModalVisible,
    islevel,
    member,
    messages,
  ]);

  useEffect(() => {
    if (startDirectMessage && directMessageDetails) {
      if (eventType === "webinar" || eventType === "conference") {
        setActiveTab("direct");
        setFocusedInput(true);
      }
    } else if (eventType === "broadcast" || eventType === "chat") {
      setActiveTab("group");
    }
  }, [startDirectMessage, directMessageDetails, eventType]);

  const defaultOverlayWidth =
    typeof window !== "undefined" ? Math.min(window.innerWidth * 0.85, 420) : 360;

  const {
    className: overlayClassName,
    style: overlayStyleOverrides,
    ...restOverlayProps
  } = overlayProps ?? {};

  const overlayClassNames = [
    "mediasfu-messages-modal",
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
    display: isMessagesModalVisible ? "block" : "none",
    zIndex: 999,
    ...overlayStyleOverrides,
  };

  const {
    className: contentClassName,
    style: contentStyleOverrides,
    ...restContentProps
  } = contentProps ?? {};

  const contentClassNames = [
    "mediasfu-messages-modal__content",
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
    display: "flex",
    alignItems: "center",
    gap: 8,
    margin: 0,
    ...titleStyleOverrides,
  };

  const {
    className: tabListClassName,
    style: tabListStyleOverrides,
    ...restTabListProps
  } = tabListProps ?? {};

  const tabListClassNames = [
    "messages-tabs",
    tabListClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const tabListStyle: React.CSSProperties = {
    display: "flex",
    gap: 8,
    ...tabListStyleOverrides,
  };

  const {
    className: tabButtonClassName,
    style: tabButtonStyleOverrides,
    ...restTabButtonProps
  } = tabButtonProps ?? {};

  const baseTabButtonStyle: React.CSSProperties = {
    padding: "6px 12px",
    fontWeight: "bold",
    borderRadius: 4,
    border: "none",
    cursor: "pointer",
    backgroundColor: "transparent",
  };

  const {
    className: closeButtonClassName,
    style: closeButtonStyleOverrides,
    onClick: closeButtonOnClick,
    ...restCloseButtonProps
  } = closeButtonProps ?? {};

  const closeButtonClassNames = [
    "btn-close-messages",
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
      onMessagesClose();
    }
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
    ...bodyStyleOverrides,
  };

  const {
    className: directPanelClassName,
    style: directPanelStyleOverrides,
    ...restDirectPanelProps
  } = directPanelWrapperProps ?? {};

  const directPanelClassNames = [
    "messages-panel messages-panel--direct",
    directPanelClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const {
    className: groupPanelClassName,
    style: groupPanelStyleOverrides,
    ...restGroupPanelProps
  } = groupPanelWrapperProps ?? {};

  const groupPanelClassNames = [
    "messages-panel messages-panel--group",
    groupPanelClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;

  const switchToDirect = () => {
    setActiveTab("direct");
    setFocusedInput(true);
  };

  const switchToGroup = () => {
    setActiveTab("group");
    setFocusedInput(false);
  };

  const buildTabButton = (type: "direct" | "group") => {
    const isActive = activeTab === type;
    const switchTo = type === "direct" ? switchToDirect : switchToGroup;

    const defaultButton = (
      <button
        type="button"
        className={tabButtonClassName}
        style={{
          ...baseTabButtonStyle,
          ...(isActive && {
            color: "#ffffff",
            backgroundColor: activeTabBackgroundColor,
          }),
          ...tabButtonStyleOverrides,
        }}
        onClick={(event) => {
          restTabButtonProps?.onClick?.(event);
          if (!event.defaultPrevented) {
            switchTo();
          }
        }}
        {...restTabButtonProps}
      >
        {type === "direct" ? "Direct" : "Group"}
      </button>
    );

    if (renderTabButton) {
      return renderTabButton({
        type,
        isActive,
        defaultButton,
        switchTo,
      });
    }

    return defaultButton;
  };

  const defaultTabs = (eventType === "webinar" || eventType === "conference")
    ? (
        <div
          className={tabListClassNames}
          style={tabListStyle}
          {...restTabListProps}
        >
          {buildTabButton("direct")}
          {buildTabButton("group")}
        </div>
      )
    : null;

  const tabsNode = renderTabs
    ? renderTabs({
        defaultTabs,
        activeTab,
        switchToDirect,
        switchToGroup,
      })
    : defaultTabs;

  const defaultHeader = (
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

  const headerNode = renderHeader
    ? renderHeader({
        defaultHeader,
        activeTab,
        onClose: onMessagesClose,
      })
    : defaultHeader;

  const renderPanelContent = (
    type: "direct" | "group",
    panelMessages: Message[],
    panelProps: React.HTMLAttributes<HTMLDivElement>,
    panelClassNames: string | undefined,
    panelStyleOverrides: React.CSSProperties | undefined,
    panelEmptyState: React.ReactNode
  ) => (
    <div
      className={panelClassNames}
      style={{
        display: activeTab === type ? "block" : "none",
        overflowY: "auto",
        maxHeight: "100%",
        ...panelStyleOverrides,
      }}
      {...panelProps}
    >
      {activeTab === type ? (
        <>
          {!panelMessages.length && panelEmptyState}
          <MessagePanel
            messages={panelMessages}
            messagesLength={messages.length}
            type={type}
            onSendMessagePress={onSendMessagePress}
            username={member}
            backgroundColor={backgroundColor}
            focusedInput={type === "direct" ? focusedInput : false}
            showAlert={showAlert}
            eventType={eventType}
            member={member}
            islevel={islevel}
            coHostResponsibility={coHostResponsibility}
            coHost={coHost}
            directMessageDetails={directMessageDetails}
            updateStartDirectMessage={updateStartDirectMessage}
            updateDirectMessageDetails={updateDirectMessageDetails}
            roomName={roomName}
            socket={socket}
            chatSetting={chatSetting}
            startDirectMessage={startDirectMessage}
          />
        </>
      ) : null}
    </div>
  );

  const directEmpty = emptyState
    ? typeof emptyState === "function"
      ? emptyState({ type: "direct" })
      : emptyState
    : <div className="messages-empty">No direct messages yet.</div>;

  const groupEmpty = emptyState
    ? typeof emptyState === "function"
      ? emptyState({ type: "group" })
      : emptyState
    : <div className="messages-empty">No group messages yet.</div>;

  const defaultPanels = (
    <>
      {renderPanelContent(
        "direct",
        directMessages,
        restDirectPanelProps ?? {},
        directPanelClassNames,
        directPanelStyleOverrides,
        directEmpty
      )}
      {renderPanelContent(
        "group",
        groupMessages,
        restGroupPanelProps ?? {},
        groupPanelClassNames,
        groupPanelStyleOverrides,
        groupEmpty
      )}
    </>
  );

  const panelsNode = renderPanels
    ? renderPanels({
        defaultPanels,
        activeTab,
      })
    : defaultPanels;

  const defaultBody = (
    <div className={bodyClassNames} style={bodyStyle} {...restBodyProps}>
      {tabsNode}
      <div className="messages-panels" style={{ flex: 1, minHeight: 0 }}>
        {panelsNode}
      </div>
    </div>
  );

  const bodyNode = renderBody
    ? renderBody({
        defaultBody,
        activeTab,
      })
    : defaultBody;

  const defaultContent = (
    <div className={contentClassNames} style={contentStyle} {...restContentProps}>
      {headerNode}
      <hr className="hr" />
      {bodyNode}
    </div>
  );

  const contentNode = renderContent
    ? renderContent({
        defaultContent,
        activeTab,
      })
    : defaultContent;

  return (
    <div className={overlayClassNames} style={overlayStyle} {...restOverlayProps}>
      {contentNode}
    </div>
  );
};

export default MessagesModal;
