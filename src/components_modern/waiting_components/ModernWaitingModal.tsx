/**
 * Modern Waiting Room Modal with glassmorphic design.
 *
 * A premium-styled waiting room modal for managing participants,
 * featuring glassmorphic effects and smooth animations.
 * Uses the same WaitingRoomModalOptions as the original component.
 *
 * @example
 * ```tsx
 * <ModernWaitingModal
 *   isWaitingModalVisible={showWaiting}
 *   onWaitingRoomClose={() => setShowWaiting(false)}
 *   waitingRoomList={waitingList}
 *   isDarkMode={true}
 * />
 * ```
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faClock,
  faCheck,
  faBan,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { WaitingRoomModalOptions } from '../../components/waitingComponents/WaitingModal';
import { ModalRenderMode } from '../../components/menuComponents/MenuModal';
import { respondToWaiting } from '../../methods/waitingMethods/respondToWaiting';
import { WaitingRoomParticipant } from '../../@types/types';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';
import { MediasfuAnimations } from '../core/theme/MediasfuAnimations';
import { MediasfuBorders } from '../core/theme/MediasfuBorders';
import { GlassmorphicContainer } from '../core/widgets/GlassmorphicContainer';
import { ModernTooltip } from '../core/widgets/ModernTooltip';

export interface ModernWaitingModalProps extends WaitingRoomModalOptions {
  /** Use dark mode styling */
  isDarkMode?: boolean;
  /** Enable glassmorphism effects */
  enableGlassmorphism?: boolean;
  /** Enable glow effects */
  enableGlow?: boolean;
  /** Render mode: modal (default overlay), sidebar (inline for desktop), inline (no wrapper) */
  renderMode?: ModalRenderMode;
}

export type ModernWaitingModalType = (
  options: ModernWaitingModalProps
) => React.JSX.Element;

/**
 * ModernWaitingModal displays the waiting room with premium styling.
 */
export const ModernWaitingModal: React.FC<ModernWaitingModalProps> = ({
  isWaitingModalVisible,
  onWaitingRoomClose,
  waitingRoomCounter,
  onWaitingRoomFilterChange,
  onWaitingRoomItemPress = respondToWaiting,
  waitingRoomList,
  updateWaitingList,
  roomName,
  socket,
  parameters,
  position = 'topRight',
  title,
  // Modern-specific props
  isDarkMode = true,
  enableGlassmorphism = true,
  enableGlow = true,
  renderMode = 'modal',
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Get filtered list
  const filteredList = useMemo(() => {
    const updatedParams = parameters.getUpdatedAllParams?.();
    const baseList = updatedParams?.filteredWaitingRoomList || waitingRoomList;
    if (!searchText.trim()) return baseList;
    return baseList.filter(
      (p: WaitingRoomParticipant) =>
        p.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [parameters, waitingRoomList, searchText]);

  // Mount animation
  useEffect(() => {
    if (isWaitingModalVisible) {
      const timer = setTimeout(() => setIsMounted(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsMounted(false);
    }
  }, [isWaitingModalVisible]);

  // Handle filter change
  const handleFilterChange = useCallback(
    (text: string) => {
      setSearchText(text);
      onWaitingRoomFilterChange(text);
    },
    [onWaitingRoomFilterChange]
  );

  // Handle waiting response
  const handleResponse = useCallback(
    async (participant: WaitingRoomParticipant, type: boolean) => {
      await onWaitingRoomItemPress({
        participantId: participant.id,
        participantName: participant.name,
        updateWaitingList,
        waitingList: waitingRoomList,
        type,
        roomName,
        socket,
      });
    },
    [onWaitingRoomItemPress, updateWaitingList, waitingRoomList, roomName, socket]
  );

  // Position styles
  const getPositionStyles = (): React.CSSProperties => {
    const positions: Record<string, React.CSSProperties> = {
      topRight: { top: MediasfuSpacing.lg, right: MediasfuSpacing.lg },
      topLeft: { top: MediasfuSpacing.lg, left: MediasfuSpacing.lg },
      bottomRight: { bottom: MediasfuSpacing.lg, right: MediasfuSpacing.lg },
      bottomLeft: { bottom: MediasfuSpacing.lg, left: MediasfuSpacing.lg },
    };
    return positions[position] || positions.topRight;
  };

  // For sidebar or inline mode, skip visibility check
  if (renderMode !== 'sidebar' && renderMode !== 'inline') {
    if (!isWaitingModalVisible) return null;
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
    width: 'min(400px, calc(100vw - 32px))',
    maxHeight: 'min(500px, calc(100vh - 100px))',
    opacity: isMounted ? 1 : 0,
    transform: isMounted ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-10px)',
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
    color: '#FFFFFF',
    borderRadius: MediasfuBorders.full,
    padding: `2px ${MediasfuSpacing.sm}px`,
    fontSize: 12,
    fontWeight: 600,
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

  const searchContainerStyle: React.CSSProperties = {
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
    borderBottom: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
  };

  const searchInputStyle: React.CSSProperties = {
    width: '100%',
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
    paddingLeft: 36,
    background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
    borderRadius: MediasfuBorders.md,
    color: isDarkMode ? '#FFFFFF' : '#1F2937',
    fontSize: 14,
    outline: 'none',
  };

  const listStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: `${MediasfuSpacing.md}px`,
    display: 'flex',
    flexDirection: 'column',
    gap: `${MediasfuSpacing.sm}px`,
  };

  const itemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${MediasfuSpacing.sm}px ${MediasfuSpacing.md}px`,
    background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
    borderRadius: MediasfuBorders.md,
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
  };

  const nameStyle: React.CSSProperties = {
    ...MediasfuTypography.getBodyMedium(isDarkMode),
    flex: 1,
  };

  const actionButtonsStyle: React.CSSProperties = {
    display: 'flex',
    gap: `${MediasfuSpacing.xs}px`,
  };

  const actionButtonStyle = (isAccept: boolean): React.CSSProperties => ({
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: isAccept
      ? 'linear-gradient(135deg, #10B981, #059669)'
      : 'linear-gradient(135deg, #EF4444, #DC2626)',
    border: 'none',
    borderRadius: MediasfuBorders.sm,
    cursor: 'pointer',
    color: '#FFFFFF',
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
  });

  const emptyStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
    padding: MediasfuSpacing.xl,
    textAlign: 'center',
  };

  // Build content components
  const headerContent = (
    <div style={headerStyle}>
      <h2 style={titleStyle}>
        <FontAwesomeIcon icon={faClock} />
        {title || 'Waiting Room'}
        {waitingRoomCounter > 0 && (
          <span style={badgeStyle}>{waitingRoomCounter}</span>
        )}
      </h2>
      <button style={closeButtonStyle} onClick={onWaitingRoomClose}>
        <FontAwesomeIcon icon={faTimes} size="lg" />
      </button>
    </div>
  );

  const searchContent = (
    <div style={searchContainerStyle}>
      <div style={{ position: 'relative' }}>
        <FontAwesomeIcon
          icon={faSearch}
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
          }}
        />
        <input
          type="text"
          placeholder="Search waiting list..."
          value={searchText}
          onChange={(e) => handleFilterChange(e.target.value)}
          style={searchInputStyle}
        />
      </div>
    </div>
  );

  const listContent = (
    <div style={listStyle}>
      {filteredList.length === 0 ? (
        <div style={emptyStyle}>
          No one is waiting
        </div>
      ) : (
        filteredList.map((participant: WaitingRoomParticipant, index: number) => (
          <div key={`${participant.id}-${index}`} style={itemStyle}>
            <span style={nameStyle}>{participant.name}</span>
            <div style={actionButtonsStyle}>
              <ModernTooltip
                message={`Admit ${participant.name}`}
                isDarkMode={isDarkMode}
              >
                <button
                  style={actionButtonStyle(true)}
                  onClick={() => handleResponse(participant, true)}
                  aria-label={`Admit ${participant.name}`}
                >
                  <FontAwesomeIcon icon={faCheck} />
                </button>
              </ModernTooltip>
              <ModernTooltip
                message={`Reject ${participant.name}`}
                isDarkMode={isDarkMode}
              >
                <button
                  style={actionButtonStyle(false)}
                  onClick={() => handleResponse(participant, false)}
                  aria-label={`Reject ${participant.name}`}
                >
                  <FontAwesomeIcon icon={faBan} />
                </button>
              </ModernTooltip>
            </div>
          </div>
        ))
      )}
    </div>
  );

  // For sidebar/inline mode, render content directly without modal wrapper
  if (renderMode === 'sidebar' || renderMode === 'inline') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {headerContent}
        {searchContent}
        {listContent}
      </div>
    );
  }

  return (
    <>
      <div style={overlayStyle} onClick={onWaitingRoomClose} />
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
        {headerContent}
        {searchContent}
        {listContent}
      </GlassmorphicContainer>
    </>
  );
};

export default ModernWaitingModal;
