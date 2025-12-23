/**
 * Modern Participants Modal with glassmorphic design.
 *
 * A premium-styled participants list modal with search, filtering,
 * and host controls with glassmorphic effects.
 * Uses the same ParticipantsModalOptions as the original component.
 *
 * @example
 * ```tsx
 * <ModernParticipantsModal
 *   isParticipantsModalVisible={showParticipants}
 *   onParticipantsClose={() => setShowParticipants(false)}
 *   onParticipantsFilterChange={handleFilter}
 *   participantsCounter={participants.length}
 *   parameters={params}
 * />
 * ```
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faSearch,
  faUsers,
  faMicrophone,
  faMicrophoneSlash,
  faComment,
  faUserMinus,
  faCrown,
  faDotCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  ParticipantsModalOptions,
} from '../../components/participantsComponents/ParticipantsModal';
import { ModalRenderMode } from '../../components/menuComponents/MenuModal';
import { Participant } from '../../@types/types';
import { muteParticipants } from '../../methods/participantsMethods/muteParticipants';
import { messageParticipants } from '../../methods/participantsMethods/messageParticipants';
import { removeParticipants } from '../../methods/participantsMethods/removeParticipants';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';
import { MediasfuAnimations } from '../core/theme/MediasfuAnimations';
import { MediasfuBorders } from '../core/theme/MediasfuBorders';
import { GlassmorphicContainer } from '../core/widgets/GlassmorphicContainer';
import { ModernTooltip } from '../core/widgets/ModernTooltip';

export interface ModernParticipantsModalProps extends ParticipantsModalOptions {
  /** Use dark mode styling */
  isDarkMode?: boolean;
  /** Enable glassmorphism effects */
  enableGlassmorphism?: boolean;
  /** Enable glow effects */
  enableGlow?: boolean;
  /** Render mode: modal (default overlay), sidebar (inline for desktop), inline (no wrapper) */
  renderMode?: ModalRenderMode;
}

export type ModernParticipantsModalType = (
  options: ModernParticipantsModalProps
) => React.JSX.Element;

/**
 * ModernParticipantsModal displays participants with premium styling.
 */
export const ModernParticipantsModal: React.FC<ModernParticipantsModalProps> = ({
  isParticipantsModalVisible,
  onParticipantsClose,
  onParticipantsFilterChange,
  participantsCounter,
  onMuteParticipants = muteParticipants,
  onMessageParticipants = messageParticipants,
  onRemoveParticipants = removeParticipants,
  parameters,
  position = 'topRight',
  title,
  // Modern-specific props
  isDarkMode = true,
  enableGlassmorphism = true,
  enableGlow = true,
  renderMode = 'modal',
  // Render props
  renderHeader,
  renderSearch,
  renderLists,
  renderBody,
  renderContent,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [rerenderToggle, setRerenderToggle] = useState(false);

  // Mount animation
  useEffect(() => {
    if (isParticipantsModalVisible) {
      const timer = setTimeout(() => setIsMounted(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsMounted(false);
    }
  }, [isParticipantsModalVisible]);

  // Get parameters - use getUpdatedAllParams for fresh data
  const params = useMemo(() => {
    return parameters?.getUpdatedAllParams?.() || parameters;
  }, [parameters, rerenderToggle]);

  // Destructure key params for clarity
  const {
    coHostResponsibility,
    coHost,
    member,
    islevel,
    participants: allParticipants,
    eventType,
    socket,
    showAlert,
    roomName,
    updateIsMessagesModalVisible,
    updateDirectMessageDetails,
    updateStartDirectMessage,
    updateParticipants,
    filteredParticipants: paramFilteredParticipants,
  } = params || {};

  // Check if event is a broadcast (affects which action buttons are shown)
  const isBroadcast = eventType === 'broadcast';

  // Determine if user can moderate participants (host or co-host with permission)
  const canModerate = useMemo(() => {
    try {
      const responsibility = coHostResponsibility?.find(
        (item: { name: string; value: boolean }) => item.name === 'participants'
      );
      const participantsValue = responsibility?.value ?? false;
      return (
        (allParticipants && islevel === '2') ||
        (coHost === member && participantsValue === true)
      );
    } catch {
      return (allParticipants && islevel === '2') || false;
    }
  }, [coHostResponsibility, allParticipants, islevel, coHost, member]);

  // Get initial participants list
  const initialParticipants = useMemo(() => {
    return paramFilteredParticipants || allParticipants || [];
  }, [paramFilteredParticipants, allParticipants]);

  // Participants state for local management
  const [participantsState, setParticipantsState] = useState<Participant[]>(initialParticipants);

  // Update participants state when params change
  useEffect(() => {
    const updatedParams = parameters?.getUpdatedAllParams?.() || parameters;
    const newParticipants = updatedParams?.filteredParticipants || updatedParams?.participants || [];
    setParticipantsState(newParticipants);
  }, [parameters, rerenderToggle]);

  // Filter participants based on search query
  const filteredParticipants = useMemo(() => {
    if (!searchQuery) return participantsState;
    return participantsState.filter((p: Participant) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [participantsState, searchQuery]);

  // Handle search
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    onParticipantsFilterChange?.(value);
    setRerenderToggle((prev) => !prev);
  }, [onParticipantsFilterChange]);

  // Handle mute - respects co-host responsibilities
  const handleMute = useCallback(async (participant: Participant) => {
    if (params) {
      await onMuteParticipants({
        socket: socket,
        coHostResponsibility: coHostResponsibility,
        participant,
        member: member,
        islevel: islevel,
        showAlert: showAlert,
        coHost: coHost,
        roomName: roomName,
      });
    }
  }, [onMuteParticipants, params, socket, coHostResponsibility, member, islevel, showAlert, coHost, roomName]);

  // Handle message - respects co-host responsibilities  
  const handleMessage = useCallback(async (participant: Participant) => {
    if (params) {
      await onMessageParticipants({
        coHostResponsibility: coHostResponsibility,
        participant,
        member: member,
        islevel: islevel,
        showAlert: showAlert,
        coHost: coHost,
        updateIsMessagesModalVisible: updateIsMessagesModalVisible,
        updateDirectMessageDetails: updateDirectMessageDetails,
        updateStartDirectMessage: updateStartDirectMessage,
      });
    }
  }, [onMessageParticipants, params, coHostResponsibility, member, islevel, showAlert, coHost, updateIsMessagesModalVisible, updateDirectMessageDetails, updateStartDirectMessage]);

  // Handle remove - respects co-host responsibilities
  const handleRemove = useCallback(async (participant: Participant) => {
    if (params) {
      await onRemoveParticipants({
        coHostResponsibility: coHostResponsibility,
        participant,
        member: member,
        islevel: islevel,
        showAlert: showAlert,
        coHost: coHost,
        participants: allParticipants,
        socket: socket,
        roomName: roomName,
        updateParticipants: updateParticipants,
      });
      // Trigger re-render after removal
      setRerenderToggle((prev) => !prev);
    }
  }, [onRemoveParticipants, params, coHostResponsibility, member, islevel, showAlert, coHost, allParticipants, socket, roomName, updateParticipants]);

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
    if (!isParticipantsModalVisible) return null;
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
    width: 'min(420px, calc(100vw - 32px))',
    maxHeight: 'calc(100vh - 100px)',
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

  const badgeStyle: React.CSSProperties = {
    background: MediasfuColors.brandGradient(isDarkMode),
    padding: `2px ${MediasfuSpacing.sm}px`,
    borderRadius: MediasfuBorders.full,
    fontSize: 12,
    fontWeight: 600,
    color: '#FFFFFF',
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

  const bodyStyle: React.CSSProperties = {
    padding: `${MediasfuSpacing.md}px`,
    overflowY: 'auto',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: `${MediasfuSpacing.md}px`,
  };

  const searchStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: `${MediasfuSpacing.sm}px`,
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
    background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    borderRadius: MediasfuBorders.md,
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
  };

  const searchInputStyle: React.CSSProperties = {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: isDarkMode ? '#FFFFFF' : '#1F2937',
    fontSize: 14,
  };

  const participantStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
    background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    borderRadius: MediasfuBorders.sm,
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
  };

  const participantInfoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: `${MediasfuSpacing.sm}px`,
  };

  const avatarStyle: React.CSSProperties = {
    width: 36,
    height: 36,
    borderRadius: MediasfuBorders.full,
    background: MediasfuColors.brandGradient(isDarkMode),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontWeight: 600,
    fontSize: 14,
  };

  const nameStyle: React.CSSProperties = {
    ...MediasfuTypography.getBodyMedium(isDarkMode),
    display: 'flex',
    alignItems: 'center',
    gap: `${MediasfuSpacing.xs}px`,
  };

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: `${MediasfuSpacing.xs}px`,
  };

  const actionButtonStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: MediasfuSpacing.xs,
    borderRadius: MediasfuBorders.xs,
    color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
  };

  // Default header
  const defaultHeader = (
    <div style={headerStyle}>
      <h2 style={titleStyle}>
        <FontAwesomeIcon icon={faUsers} />
        {title || 'Participants'}
        <span style={badgeStyle}>{participantsCounter}</span>
      </h2>
      <button style={closeButtonStyle} onClick={onParticipantsClose}>
        <FontAwesomeIcon icon={faTimes} size="lg" />
      </button>
    </div>
  );

  // Default search
  const defaultSearch = (
    <div style={searchStyle}>
      <FontAwesomeIcon
        icon={faSearch}
        style={{ color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}
      />
      <input
        type="text"
        placeholder="Search participants..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        style={searchInputStyle}
      />
    </div>
  );

  // Default participant list - shows different controls based on canModerate and isBroadcast
  const defaultLists = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: MediasfuSpacing.xs }}>
      {filteredParticipants.length === 0 ? (
        <div style={{ textAlign: 'center', padding: MediasfuSpacing.xl, color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
          No participants found
        </div>
      ) : (
        filteredParticipants.map((participant: Participant, index: number) => (
          <div key={participant.id || index} style={participantStyle}>
            <div style={participantInfoStyle}>
              <div style={avatarStyle}>
                {participant.name?.charAt(0).toUpperCase()}
              </div>
              <span style={nameStyle}>
                {participant.islevel === '2'
                  ? `${participant.name} (host)`
                  : participant.name}
                {participant.islevel === '2' && (
                  <FontAwesomeIcon icon={faCrown} style={{ color: MediasfuColors.warning, fontSize: 12 }} />
                )}
              </span>
            </div>
            {/* Moderator controls - only shown when user canModerate */}
            {canModerate && participant.islevel !== '2' && (
              <div style={actionsStyle}>
                {/* Mute status indicator */}
                {!isBroadcast && (
                  <FontAwesomeIcon
                    icon={faDotCircle}
                    style={{
                      fontSize: 12,
                      color: participant.muted ? MediasfuColors.danger : MediasfuColors.success,
                      marginRight: MediasfuSpacing.xs,
                    }}
                  />
                )}
                {/* Mute button - hidden in broadcast mode */}
                {!isBroadcast && (
                  <ModernTooltip 
                    message={participant.muted ? 'Already muted (cannot unmute remotely)' : 'Mute'} 
                    isDarkMode={isDarkMode}
                  >
                    <button
                      style={{
                        ...actionButtonStyle,
                        opacity: participant.muted ? 0.5 : 1,
                        cursor: participant.muted ? 'not-allowed' : 'pointer',
                      }}
                      onClick={() => !participant.muted && handleMute(participant)}
                      aria-label={participant.muted ? 'Already muted' : 'Mute'}
                      disabled={participant.muted}
                    >
                      <FontAwesomeIcon icon={participant.muted ? faMicrophoneSlash : faMicrophone} />
                    </button>
                  </ModernTooltip>
                )}
                {/* Message button - hidden in broadcast mode */}
                {!isBroadcast && (
                  <ModernTooltip message="Direct Message" isDarkMode={isDarkMode}>
                    <button
                      style={actionButtonStyle}
                      onClick={() => handleMessage(participant)}
                      aria-label="Direct Message"
                    >
                      <FontAwesomeIcon icon={faComment} />
                    </button>
                  </ModernTooltip>
                )}
                {/* Remove button - always shown for moderators (even in broadcast) */}
                <ModernTooltip message="Remove from room" isDarkMode={isDarkMode}>
                  <button
                    style={{ ...actionButtonStyle, color: MediasfuColors.danger }}
                    onClick={() => handleRemove(participant)}
                    aria-label="Remove from room"
                  >
                    <FontAwesomeIcon icon={faUserMinus} />
                  </button>
                </ModernTooltip>
              </div>
            )}
            {/* Non-moderator view - just show mute status if not broadcast */}
            {!canModerate && !isBroadcast && (
              <div style={actionsStyle}>
                <FontAwesomeIcon
                  icon={faDotCircle}
                  style={{
                    fontSize: 12,
                    color: participant.muted ? MediasfuColors.danger : MediasfuColors.success,
                  }}
                />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  // Default body
  const defaultBody = (
    <div style={bodyStyle}>
      {renderSearch ? renderSearch({ defaultSearch, onFilter: handleSearch }) : defaultSearch}
      {renderLists
        ? renderLists({ defaultLists, participants: filteredParticipants, hasModeratorControls: canModerate })
        : defaultLists}
    </div>
  );

  // For sidebar/inline mode, render content directly without modal wrapper
  if (renderMode === 'sidebar' || renderMode === 'inline') {
    const sidebarContent = (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {renderHeader
          ? renderHeader({ defaultHeader, counter: participantsCounter, onClose: onParticipantsClose })
          : defaultHeader}
        {renderBody ? renderBody({ defaultBody, counter: participantsCounter }) : defaultBody}
      </div>
    );
    return renderContent
      ? <>{renderContent({ defaultContent: sidebarContent, counter: participantsCounter })}</>
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
        ? renderHeader({ defaultHeader, counter: participantsCounter, onClose: onParticipantsClose })
        : defaultHeader}
      {renderBody ? renderBody({ defaultBody, counter: participantsCounter }) : defaultBody}
    </GlassmorphicContainer>
  );

  return (
    <>
      <div style={overlayStyle} onClick={onParticipantsClose} />
      {renderContent ? renderContent({ defaultContent, counter: participantsCounter }) : defaultContent}
    </>
  );
};

export default ModernParticipantsModal;
