/**
 * Modern Messages Modal with glassmorphic design.
 *
 * A premium-styled messaging modal with tabs for direct and group messages,
 * featuring glassmorphic effects and smooth animations.
 * Uses the same MessagesModalOptions as the original component.
 *
 * @example
 * ```tsx
 * <ModernMessagesModal
 *   isMessagesModalVisible={showMessages}
 *   onMessagesClose={() => setShowMessages(false)}
 *   messages={messages}
 *   eventType="conference"
 *   member="user123"
 *   islevel="1"
 * />
 * ```
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faComments,
  faUser,
  faUsers,
  faPaperPlane,
  faReply,
  faUserFriends,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { MessagesModalOptions } from '../../components/messageComponents/MessagesModal';
import { ModalRenderMode } from '../../components/menuComponents/MenuModal';
import { Message } from '../../@types/types';
import { sendMessage } from '../../methods/messageMethods/sendMessage';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';
import { MediasfuAnimations } from '../core/theme/MediasfuAnimations';
import { MediasfuBorders } from '../core/theme/MediasfuBorders';
import { GlassmorphicContainer } from '../core/widgets/GlassmorphicContainer';
import { PremiumButton } from '../core/widgets/PremiumButton';
import { ModernTooltip } from '../core/widgets/ModernTooltip';

export interface ModernMessagesModalProps extends MessagesModalOptions {
  /** Use dark mode styling */
  isDarkMode?: boolean;
  /** Enable glassmorphism effects */
  enableGlassmorphism?: boolean;
  /** Enable glow effects */
  enableGlow?: boolean;
  /** Render mode: modal (default overlay), sidebar (inline for desktop), inline (no wrapper) */
  renderMode?: ModalRenderMode;
}

export type ModernMessagesModalType = (
  options: ModernMessagesModalProps
) => React.JSX.Element;

/**
 * ModernMessagesModal displays chat messages with premium styling.
 */
export const ModernMessagesModal: React.FC<ModernMessagesModalProps> = ({
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
  position = 'topRight',
  title,
  // Modern-specific props
  isDarkMode = true,
  enableGlassmorphism = true,
  enableGlow = true,
  renderMode = 'modal',
  // Render props
  renderHeader,
  renderTabs,
  renderPanels,
  renderBody,
  renderContent,
}) => {
  // Determine initial tab based on event type (same logic as original)
  const initialTab = useMemo<'direct' | 'group'>(() => {
    if (eventType === 'webinar' || eventType === 'conference') {
      return 'direct';
    }
    return 'group';
  }, [eventType]);

  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'direct' | 'group'>(initialTab);
  const [directMessageText, setDirectMessageText] = useState('');
  const [groupMessageText, setGroupMessageText] = useState('');
  const [focusedInput, setFocusedInput] = useState(false);
  const [replyInfo, setReplyInfo] = useState<{ text: string; username: string } | null>(null);
  const [senderId, setSenderId] = useState<string | null>(null);
  const [directMessages, setDirectMessages] = useState<Message[]>([]);
  const [groupMessages, setGroupMessages] = useState<Message[]>([]);
  const [lastViewedDirectCount, setLastViewedDirectCount] = useState(0);
  const [lastViewedGroupCount, setLastViewedGroupCount] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mount animation
  useEffect(() => {
    if (isMessagesModalVisible) {
      const timer = setTimeout(() => setIsMounted(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsMounted(false);
    }
  }, [isMessagesModalVisible]);

  // Filter messages based on permissions (same logic as original)
  useEffect(() => {
    if (!isMessagesModalVisible) {
      return;
    }

    const chatValue = coHostResponsibility?.find(
      (item: { name: string }) => item.name === 'chat'
    )?.value;

    // Direct messages: filter by sender/receiver or if user has permission
    const directMsgs = messages.filter(
      (message) =>
        !message.group &&
        (message.sender === member ||
          message.receivers.includes(member) ||
          islevel === '2' ||
          (coHost === member && chatValue === true))
    );
    // Group messages: all messages where group is true
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

  // Handle direct message initiation - switch tabs and set focus state
  useEffect(() => {
    if (startDirectMessage && directMessageDetails) {
      if (eventType === 'webinar' || eventType === 'conference') {
        setActiveTab('direct');
        setFocusedInput(true);
        // Note: replyInfo and senderId are set in the next useEffect
      }
    } else if (eventType === 'broadcast' || eventType === 'chat') {
      setActiveTab('group');
    }
  }, [startDirectMessage, directMessageDetails, eventType]);

  // Focus input and set up reply info when direct message starts (matches original MessagePanel)
  useEffect(() => {
    if (startDirectMessage && directMessageDetails && focusedInput) {
      inputRef.current?.focus();
      // Set up reply info from directMessageDetails (auto-populate the recipient)
      const replyInfoContainer = {
        text: 'Replying to: ',
        username: directMessageDetails.name,
      };
      setReplyInfo(replyInfoContainer);
      setSenderId(directMessageDetails.name);
    } else {
      // Only clear reply info display, but allow manual selection of recipient
      setReplyInfo(null);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }, [directMessageDetails, focusedInput, startDirectMessage]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [directMessages, groupMessages]);

  // Get current messages based on active tab
  const currentMessages = activeTab === 'direct' ? directMessages : groupMessages;
  const currentMessageText = activeTab === 'direct' ? directMessageText : groupMessageText;

  // Handle text input change
  const handleTextInputChange = useCallback((text: string) => {
    if (activeTab === 'direct') {
      setDirectMessageText(text);
    } else {
      setGroupMessageText(text);
    }
  }, [activeTab]);

  // Open reply input for direct messages
  const openReplyInput = useCallback((senderName: string) => {
    setReplyInfo({
      text: 'Replying to: ',
      username: senderName,
    });
    setSenderId(senderName);
  }, []);

  // Handle send message with full validation (same logic as original MessagePanel)
  const handleSend = useCallback(async () => {
    const message = activeTab === 'direct' ? directMessageText : groupMessageText;

    if (!message) {
      showAlert?.({
        message: 'Please enter a message',
        type: 'danger',
        duration: 3000,
      });
      return;
    }

    if (message.length > 350) {
      showAlert?.({
        message: 'Message is too long',
        type: 'danger',
        duration: 3000,
      });
      return;
    }

    if (message.trim() === '') {
      showAlert?.({
        message: 'Message is not valid.',
        type: 'danger',
        duration: 3000,
      });
      return;
    }

    // For direct messages, require a recipient (unless host level 2)
    if (activeTab === 'direct' && !senderId && islevel === '2') {
      showAlert?.({
        message: 'Please select a message to reply to',
        type: 'danger',
        duration: 3000,
      });
      return;
    }

    await onSendMessagePress({
      message,
      receivers: activeTab === 'direct' ? [senderId!] : [],
      group: activeTab === 'group',
      messagesLength: messages.length,
      member,
      sender: member,
      islevel,
      showAlert,
      coHostResponsibility,
      coHost,
      roomName,
      socket,
      chatSetting,
    });

    // Clear message text
    if (activeTab === 'direct') {
      setDirectMessageText('');
    } else {
      setGroupMessageText('');
    }

    // Clear reply info
    if (replyInfo) {
      setReplyInfo(null);
      setSenderId(null);
    }

    // Clear direct message state if focused input
    if (focusedInput) {
      updateDirectMessageDetails(null);
      updateStartDirectMessage(false);
      setFocusedInput(false);
    }
  }, [
    activeTab,
    directMessageText,
    groupMessageText,
    senderId,
    islevel,
    showAlert,
    onSendMessagePress,
    messages.length,
    member,
    coHostResponsibility,
    coHost,
    roomName,
    socket,
    chatSetting,
    replyInfo,
    focusedInput,
    updateDirectMessageDetails,
    updateStartDirectMessage,
  ]);

  // Tab switch handlers - update last viewed count to clear badge
  const switchToDirect = useCallback(() => {
    setActiveTab('direct');
    setFocusedInput(true);
    setLastViewedDirectCount(directMessages.length);
  }, [directMessages.length]);

  const switchToGroup = useCallback(() => {
    setActiveTab('group');
    setFocusedInput(false);
    setLastViewedGroupCount(groupMessages.length);
  }, [groupMessages.length]);

  // Calculate new message counts
  const newDirectCount = Math.max(0, directMessages.length - lastViewedDirectCount);
  const newGroupCount = Math.max(0, groupMessages.length - lastViewedGroupCount);

  // Update viewed count when on the active tab
  useEffect(() => {
    if (activeTab === 'direct') {
      setLastViewedDirectCount(directMessages.length);
    } else {
      setLastViewedGroupCount(groupMessages.length);
    }
  }, [activeTab, directMessages.length, groupMessages.length]);

  // Position styles
  const getPositionStyles = (): React.CSSProperties => {
    const positions: Record<string, React.CSSProperties> = {
      topRight: { top: MediasfuSpacing.lg, right: MediasfuSpacing.lg },
      topLeft: { top: MediasfuSpacing.lg, left: MediasfuSpacing.lg },
      bottomRight: { bottom: MediasfuSpacing.lg, right: MediasfuSpacing.lg },
      bottomLeft: { bottom: MediasfuSpacing.lg, left: MediasfuSpacing.lg },
      center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
    };
    return positions[position] || positions.topRight;
  };

  // For sidebar or inline mode, skip visibility check
  if (renderMode !== 'sidebar' && renderMode !== 'inline') {
    if (!isMessagesModalVisible) return null;
  }

  // Styles
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: MediasfuColors.alertBackdrop(isDarkMode),
    backdropFilter: enableGlassmorphism ? 'blur(2px)' : undefined,
    WebkitBackdropFilter: enableGlassmorphism ? 'blur(2px)' : undefined,
    opacity: isMounted ? 1 : 0,
    transition: `opacity ${MediasfuAnimations.normal}ms ${MediasfuAnimations.smooth}`,
    zIndex: 1000,
  };

  const modalStyle: React.CSSProperties = {
    position: 'fixed',
    ...getPositionStyles(),
    width: 'min(450px, calc(100vw - 32px))',
    height: 'min(600px, calc(100vh - 100px))',
    opacity: isMounted ? 1 : 0,
    transform: isMounted
      ? position === 'center'
        ? 'translate(-50%, -50%) scale(1)'
        : 'scale(1) translateY(0)'
      : position === 'center'
        ? 'translate(-50%, -50%) scale(0.95)'
        : 'scale(0.95) translateY(-10px)',
    transition: `all ${MediasfuAnimations.normal}ms ${MediasfuAnimations.snappy}`,
    zIndex: 1001,
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${MediasfuSpacing.md}px`,
    borderBottom: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
  };

  const titleStyle: React.CSSProperties = {
    ...MediasfuTypography.getTitleMedium(isDarkMode),
    display: 'flex',
    alignItems: 'center',
    gap: `${MediasfuSpacing.sm}px`,
    margin: 0,
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: MediasfuSpacing.xs,
    borderRadius: MediasfuBorders.sm,
    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
  };

  const tabsStyle: React.CSSProperties = {
    display: 'flex',
    gap: `${MediasfuSpacing.xs}px`,
    padding: `${MediasfuSpacing.sm}px`,
    background: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
    overflow: 'hidden',
  };

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    flex: 1,
    minWidth: 0,
    padding: `${MediasfuSpacing.sm}px`,
    background: isActive
      ? MediasfuColors.brandGradient(isDarkMode)
      : 'transparent',
    border: 'none',
    borderRadius: MediasfuBorders.sm,
    cursor: 'pointer',
    color: isActive ? '#FFFFFF' : isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
    fontWeight: isActive ? 600 : 400,
    fontSize: 14,
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: `${MediasfuSpacing.xs}px`,
    overflow: 'hidden',
  });

  const messagesContainerStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: `${MediasfuSpacing.md}px`,
    display: 'flex',
    flexDirection: 'column',
    gap: `${MediasfuSpacing.sm}px`,
  };

  const messageStyle = (isMine: boolean): React.CSSProperties => ({
    maxWidth: '80%',
    alignSelf: isMine ? 'flex-end' : 'flex-start',
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
    borderRadius: MediasfuBorders.md,
    background: isMine
      ? MediasfuColors.brandGradient(isDarkMode)
      : isDarkMode
        ? 'rgba(255,255,255,0.1)'
        : 'rgba(0,0,0,0.05)',
    color: isMine ? '#FFFFFF' : isDarkMode ? '#FFFFFF' : '#1F2937',
  });

  const messageHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
    gap: MediasfuSpacing.sm,
  };

  const senderStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    opacity: 0.8,
  };

  const receiversStyle: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 600,
    opacity: 0.7,
    marginLeft: 6,
  };

  const messageTextStyle: React.CSSProperties = {
    ...MediasfuTypography.getBodyMedium(isDarkMode),
    margin: 0,
    wordBreak: 'break-word',
  };

  const timestampStyle: React.CSSProperties = {
    fontSize: 10,
    opacity: 0.5,
  };

  const replyButtonStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 2,
    marginLeft: 5,
    borderRadius: 2,
    color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
  };

  const replyInfoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: `${MediasfuSpacing.xs}px ${MediasfuSpacing.sm}px`,
    background: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)',
    borderRadius: MediasfuBorders.sm,
    marginBottom: MediasfuSpacing.xs,
    fontSize: 12,
    border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
  };

  // Info box style for helpful messages
  const infoBoxStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    padding: '10px 12px',
    borderRadius: MediasfuBorders.md,
    backgroundColor: isDarkMode 
      ? 'rgba(59, 130, 246, 0.12)' 
      : 'rgba(59, 130, 246, 0.08)',
    border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.25)' : 'rgba(59, 130, 246, 0.15)'}`,
    marginBottom: MediasfuSpacing.sm,
  };

  const infoBoxHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    fontWeight: 600,
    color: isDarkMode ? '#93c5fd' : '#2563eb',
  };

  const infoBoxTextStyle: React.CSSProperties = {
    margin: 0,
    fontSize: 11,
    lineHeight: 1.4,
    color: isDarkMode ? '#cbd5e1' : '#475569',
  };

  const inputContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: `${MediasfuSpacing.sm}px`,
    padding: `${MediasfuSpacing.md}px`,
    borderTop: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const inputRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: `${MediasfuSpacing.sm}px`,
    alignItems: 'center',
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
    background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
    borderRadius: MediasfuBorders.md,
    color: isDarkMode ? '#FFFFFF' : '#1F2937',
    fontSize: 14,
    outline: 'none',
  };

  // Determine if tabs should be shown (only for webinar/conference)
  const showTabs = eventType === 'webinar' || eventType === 'conference';

  // Get placeholder text based on current state
  const getPlaceholder = () => {
    if (activeTab === 'direct') {
      // Show recipient if we have one (either from directMessageDetails or manual reply selection)
      if (senderId) {
        return `Send a direct message to ${senderId}`;
      }
      // If host level, they need to select someone to reply to
      if (islevel === '2') {
        return 'Select a message to reply to';
      }
      return 'Send a direct message';
    }
    return eventType === 'chat' ? 'Send a message' : 'Send a message to everyone';
  };

  // Default header with tooltip on close button
  const defaultHeader = (
    <div style={headerStyle}>
      <h2 style={titleStyle}>
        <FontAwesomeIcon icon={faComments} />
        {title || 'Messages'}
      </h2>
      <ModernTooltip message="Close messages" isDarkMode={isDarkMode}>
        <button style={closeButtonStyle} onClick={onMessagesClose}>
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>
      </ModernTooltip>
    </div>
  );

  // Badge style for message counts
  const badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 18,
    height: 18,
    padding: '0 5px',
    borderRadius: 9,
    fontSize: 11,
    fontWeight: 700,
    marginLeft: 6,
  };

  const activeBadgeStyle: React.CSSProperties = {
    ...badgeStyle,
    background: 'rgba(255,255,255,0.3)',
    color: '#FFFFFF',
  };

  const inactiveBadgeStyle: React.CSSProperties = {
    ...badgeStyle,
    background: MediasfuColors.primary,
    color: '#FFFFFF',
  };

  // Default tabs (only shown for webinar/conference) with message counts and tooltips
  const defaultTabs = showTabs ? (
    <div style={tabsStyle}>
      <ModernTooltip 
        message={`Direct messages (${directMessages.length})${newDirectCount > 0 ? ` - ${newDirectCount} new` : ''}`}
        isDarkMode={isDarkMode}
        position="bottom"
      >
        <button
          style={tabStyle(activeTab === 'direct')}
          onClick={switchToDirect}
        >
          <FontAwesomeIcon icon={faUser} />
          Direct
          {directMessages.length > 0 && (
            <span style={activeTab === 'direct' ? activeBadgeStyle : inactiveBadgeStyle}>
              {activeTab !== 'direct' && newDirectCount > 0 ? `+${newDirectCount}` : directMessages.length}
            </span>
          )}
        </button>
      </ModernTooltip>
      <ModernTooltip
        message={`Group messages (${groupMessages.length})${newGroupCount > 0 ? ` - ${newGroupCount} new` : ''}`}
        isDarkMode={isDarkMode}
        position="bottom"
      >
        <button
          style={tabStyle(activeTab === 'group')}
          onClick={switchToGroup}
        >
          <FontAwesomeIcon icon={faUsers} />
          Group
          {groupMessages.length > 0 && (
            <span style={activeTab === 'group' ? activeBadgeStyle : inactiveBadgeStyle}>
              {activeTab !== 'group' && newGroupCount > 0 ? `+${newGroupCount}` : groupMessages.length}
            </span>
          )}
        </button>
      </ModernTooltip>
    </div>
  ) : null;

  // Host needs to select recipient indicator
  const hostNeedsRecipientIndicator = activeTab === 'direct' && islevel === '2' && !senderId && (
    <div style={infoBoxStyle}>
      <div style={infoBoxHeaderStyle}>
        <FontAwesomeIcon icon={faUserFriends} />
        <span>Select a recipient</span>
      </div>
      <p style={infoBoxTextStyle}>
        To send a direct message, either reply to an existing message above, or go to the <strong>Participants</strong> panel and click the message icon next to a participant&apos;s name.
      </p>
    </div>
  );

  // Direct message visibility notice (for non-hosts)
  const directMessageVisibilityNotice = activeTab === 'direct' && islevel !== '2' && (
    <div style={{
      ...infoBoxStyle,
      backgroundColor: isDarkMode 
        ? 'rgba(234, 179, 8, 0.12)' 
        : 'rgba(234, 179, 8, 0.08)',
      border: `1px solid ${isDarkMode ? 'rgba(234, 179, 8, 0.25)' : 'rgba(234, 179, 8, 0.15)'}`,
    }}>
      <div style={{
        ...infoBoxHeaderStyle,
        color: isDarkMode ? '#fcd34d' : '#b45309',
      }}>
        <FontAwesomeIcon icon={faLock} />
        <span>Private Messages</span>
      </div>
      <p style={infoBoxTextStyle}>
        Your direct messages are only visible to you and the host/co-host.
      </p>
    </div>
  );

  // Default panels with full message rendering (similar to original MessagePanel)
  const defaultPanels = (
    <div style={messagesContainerStyle}>
      {/* Info boxes at the top */}
      {hostNeedsRecipientIndicator}
      {directMessageVisibilityNotice}
      
      {currentMessages.length === 0 ? (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: MediasfuSpacing.sm,
          color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
          textAlign: 'center',
          padding: MediasfuSpacing.lg,
        }}>
          <FontAwesomeIcon 
            icon={activeTab === 'direct' ? faUser : faUsers} 
            style={{ fontSize: 32, opacity: 0.4 }} 
          />
          <span style={{ fontSize: 14 }}>
            {activeTab === 'direct' 
              ? 'No direct messages yet'
              : 'No group messages yet'
            }
          </span>
          {activeTab === 'direct' && islevel === '2' && (
            <span style={{ fontSize: 12, opacity: 0.7 }}>
              Start a conversation from the Participants panel
            </span>
          )}
          {activeTab === 'group' && (
            <span style={{ fontSize: 12, opacity: 0.7 }}>
              Send a message to everyone in the room
            </span>
          )}
        </div>
      ) : (
        currentMessages.map((msg: Message, index: number) => {
          const isMine = msg.sender === member;
          return (
            <div key={index} style={messageStyle(isMine)}>
              <div style={messageHeaderStyle}>
                {/* Show "To: receivers" for outgoing direct messages */}
                {isMine && !msg.group && (
                  <span style={receiversStyle}>
                    To: {msg.receivers.join(', ')}
                  </span>
                )}
                {/* Show sender name for incoming messages */}
                {!isMine && (
                  <span style={senderStyle}>{msg.sender}</span>
                )}
                {/* Timestamp */}
                <span style={timestampStyle}>{msg.timestamp}</span>
                {/* Reply button for incoming direct messages */}
                {!isMine && !msg.group && (
                  <ModernTooltip message={`Reply to ${msg.sender}`} isDarkMode={isDarkMode}>
                    <button
                      style={replyButtonStyle}
                      onClick={() => openReplyInput(msg.sender)}
                      aria-label={`Reply to ${msg.sender}`}
                    >
                      <FontAwesomeIcon icon={faReply} size="xs" />
                    </button>
                  </ModernTooltip>
                )}
              </div>
              <p style={messageTextStyle}>{msg.message}</p>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );

  // Input section with reply info
  const inputSection = (
    <div style={inputContainerStyle}>
      {/* Reply info banner */}
      {replyInfo && (
        <div style={replyInfoStyle}>
          <FontAwesomeIcon 
            icon={faReply} 
            style={{ 
              marginRight: 6, 
              color: isDarkMode ? '#93c5fd' : '#2563eb',
              fontSize: 11,
            }} 
          />
          <span style={{ 
            fontWeight: 600, 
            marginRight: 4,
            color: isDarkMode ? '#93c5fd' : '#2563eb',
          }}>
            {replyInfo.text}
          </span>
          <span style={{ 
            color: isDarkMode ? '#fbbf24' : '#d97706',
            fontWeight: 600,
          }}>
            {replyInfo.username}
          </span>
        </div>
      )}
      <div style={inputRowStyle}>
        <input
          ref={inputRef}
          type="text"
          placeholder={getPlaceholder()}
          value={currentMessageText}
          onChange={(e) => handleTextInputChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          style={inputStyle}
          maxLength={350}
        />
        <ModernTooltip 
          message={activeTab === 'direct' && senderId ? `Send to ${senderId}` : 'Send message'}
          isDarkMode={isDarkMode}
        >
          <PremiumButton
            variant="gradient"
            size="md"
            onPress={handleSend}
            isDarkMode={isDarkMode}
            disabled={!currentMessageText.trim()}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </PremiumButton>
        </ModernTooltip>
      </div>
    </div>
  );

  // Default body
  const defaultBody = (
    <>
      {renderTabs
        ? renderTabs({
            defaultTabs,
            activeTab,
            switchToDirect,
            switchToGroup,
          })
        : defaultTabs}
      {renderPanels ? renderPanels({ defaultPanels, activeTab }) : defaultPanels}
      {inputSection}
    </>
  );

  // For sidebar/inline mode, render content directly without modal wrapper
  if (renderMode === 'sidebar' || renderMode === 'inline') {
    const sidebarContent = (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {renderHeader
          ? renderHeader({ defaultHeader, activeTab, onClose: onMessagesClose })
          : defaultHeader}
        {renderBody ? renderBody({ defaultBody, activeTab }) : defaultBody}
      </div>
    );
    return renderContent
      ? <>{renderContent({ defaultContent: sidebarContent, activeTab })}</>
      : sidebarContent;
  }

  // Default content for modal mode
  const defaultContent = (
    <GlassmorphicContainer
      isDarkMode={isDarkMode}
      borderRadius={MediasfuBorders.xl}
      blur={enableGlassmorphism ? 20 : 0}
      padding={0}
      elevation={4}
      style={{
        ...modalStyle,
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)',
        boxShadow: enableGlow
          ? `${MediasfuColors.elevation(4, isDarkMode)}, ${MediasfuColors.glowPrimary}`
          : MediasfuColors.elevation(4, isDarkMode),
      }}
    >
      {renderHeader
        ? renderHeader({ defaultHeader, activeTab, onClose: onMessagesClose })
        : defaultHeader}
      {renderBody ? renderBody({ defaultBody, activeTab }) : defaultBody}
    </GlassmorphicContainer>
  );

  return (
    <>
      <div style={overlayStyle} onClick={onMessagesClose} />
      {renderContent ? renderContent({ defaultContent, activeTab }) : defaultContent}
    </>
  );
};

export default ModernMessagesModal;
