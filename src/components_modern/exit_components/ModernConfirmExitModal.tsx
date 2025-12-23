/**
 * Modern Confirm Exit Modal with glassmorphic design.
 *
 * A premium-styled confirmation modal for exiting the meeting,
 * featuring glassmorphic effects and smooth animations.
 * Uses the same ConfirmExitModalOptions as the original component.
 *
 * @example
 * ```tsx
 * <ModernConfirmExitModal
 *   isConfirmExitModalVisible={showExit}
 *   onConfirmExitClose={() => setShowExit(false)}
 *   member="user123"
 *   roomName="room1"
 *   socket={socket}
 *   isDarkMode={true}
 * />
 * ```
 */

import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faSignOutAlt,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { ConfirmExitModalOptions } from '../../components/exitComponents/ConfirmExitModal';
import { confirmExit, ConfirmExitOptions } from '../../methods/exitMethods/confirmExit';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';
import { MediasfuAnimations } from '../core/theme/MediasfuAnimations';
import { MediasfuBorders } from '../core/theme/MediasfuBorders';
import { GlassmorphicContainer } from '../core/widgets/GlassmorphicContainer';
import { PremiumButton } from '../core/widgets/PremiumButton';

export interface ModernConfirmExitModalProps extends ConfirmExitModalOptions {
  /** Use dark mode styling */
  isDarkMode?: boolean;
  /** Enable glassmorphism effects */
  enableGlassmorphism?: boolean;
  /** Enable glow effects */
  enableGlow?: boolean;
}

export type ModernConfirmExitModalType = (
  options: ModernConfirmExitModalProps
) => React.JSX.Element;

/**
 * ModernConfirmExitModal displays an exit confirmation with premium styling.
 */
export const ModernConfirmExitModal: React.FC<ModernConfirmExitModalProps> = ({
  isConfirmExitModalVisible,
  onConfirmExitClose,
  position = 'center',
  exitEventOnConfirm = confirmExit,
  member,
  ban = false,
  roomName,
  socket,
  islevel,
  title,
  confirmLabel,
  cancelLabel,
  message,
  // Modern-specific props
  isDarkMode = true,
  enableGlassmorphism = true,
  enableGlow = true,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  // Mount animation
  useEffect(() => {
    if (isConfirmExitModalVisible) {
      const timer = setTimeout(() => setIsMounted(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsMounted(false);
    }
  }, [isConfirmExitModalVisible]);

  // Handle confirm
  const handleConfirm = useCallback(() => {
    exitEventOnConfirm({
      socket,
      member,
      roomName,
      ban,
    } as ConfirmExitOptions);
    onConfirmExitClose();
  }, [exitEventOnConfirm, socket, member, roomName, ban, onConfirmExitClose]);

  // Get resolved message
  const getResolvedMessage = () => {
    if (typeof message === 'function') {
      return message({ islevel });
    }
    if (message) {
      return message;
    }
    return islevel === '2'
      ? 'Are you sure you want to end the meeting for everyone?'
      : 'Are you sure you want to leave the meeting?';
  };

  // Position styles
  const getPositionStyles = (): React.CSSProperties => {
    const positions: Record<string, React.CSSProperties> = {
      topRight: { top: MediasfuSpacing.lg, right: MediasfuSpacing.lg },
      topLeft: { top: MediasfuSpacing.lg, left: MediasfuSpacing.lg },
      bottomRight: { bottom: MediasfuSpacing.lg, right: MediasfuSpacing.lg },
      bottomLeft: { bottom: MediasfuSpacing.lg, left: MediasfuSpacing.lg },
      center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
    };
    return positions[position] || positions.center;
  };

  if (!isConfirmExitModalVisible) return null;

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
    width: 'min(380px, calc(100vw - 32px))',
    opacity: isMounted ? 1 : 0,
    transform: isMounted
      ? position === 'center'
        ? 'translate(-50%, -50%) scale(1)'
        : 'scale(1)'
      : position === 'center'
        ? 'translate(-50%, -50%) scale(0.95)'
        : 'scale(0.95)',
    transition: `all ${MediasfuAnimations.normal}ms ${MediasfuAnimations.snappy}`,
    zIndex: 1001,
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
    color: '#EF4444',
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
    padding: `${MediasfuSpacing.lg}px ${MediasfuSpacing.md}px`,
    textAlign: 'center',
  };

  const iconContainerStyle: React.CSSProperties = {
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: 'rgba(239, 68, 68, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    marginBottom: MediasfuSpacing.md,
  };

  const messageStyle: React.CSSProperties = {
    ...MediasfuTypography.getBodyLarge(isDarkMode),
    color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
    margin: 0,
  };

  const footerStyle: React.CSSProperties = {
    display: 'flex',
    gap: `${MediasfuSpacing.sm}px`,
    padding: `${MediasfuSpacing.md}px`,
    borderTop: `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`,
  };

  return (
    <>
      <div style={overlayStyle} onClick={onConfirmExitClose} />
      <GlassmorphicContainer
        isDarkMode={isDarkMode}
        borderRadius={MediasfuBorders.xl}
        blur={enableGlassmorphism ? 20 : 0}
        padding={0}
        elevation={4}
        style={{
          ...modalStyle,
          boxShadow: enableGlow
            ? `${MediasfuColors.elevation(4, isDarkMode)}, 0 0 20px rgba(239, 68, 68, 0.15)`
            : MediasfuColors.elevation(4, isDarkMode),
        }}
      >
        {/* Header */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            {title || (islevel === '2' ? 'End Meeting' : 'Leave Meeting')}
          </h2>
          <button style={closeButtonStyle} onClick={onConfirmExitClose}>
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {/* Body */}
        <div style={bodyStyle}>
          <div style={iconContainerStyle}>
            <FontAwesomeIcon icon={faExclamationTriangle} size="2x" color="#EF4444" />
          </div>
          <p style={messageStyle}>{getResolvedMessage()}</p>
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          <PremiumButton
            variant="outlined"
            size="md"
            onPress={onConfirmExitClose}
            isDarkMode={isDarkMode}
            style={{ flex: 1 }}
          >
            {cancelLabel || 'Cancel'}
          </PremiumButton>
          <PremiumButton
            variant="filled"
            size="md"
            onPress={handleConfirm}
            isDarkMode={isDarkMode}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #EF4444, #DC2626)',
            }}
          >
            {confirmLabel || (islevel === '2' ? 'End Meeting' : 'Leave')}
          </PremiumButton>
        </div>
      </GlassmorphicContainer>
    </>
  );
};

export default ModernConfirmExitModal;
