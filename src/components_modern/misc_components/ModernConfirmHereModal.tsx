/**
 * ModernConfirmHereModal - Modern glassmorphic presence confirmation modal.
 *
 * A premium redesigned modal with circular countdown progress, glassmorphism effects,
 * and dark/light mode support. Confirms user presence to prevent idle disconnection.
 *
 * @module ModernConfirmHereModal
 */

import React, { useState, useEffect, useCallback, useRef, CSSProperties } from 'react';
import { Socket } from 'socket.io-client';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';

export interface ModernConfirmHereModalOptions {
  isConfirmHereModalVisible: boolean;
  onConfirmHereClose: () => void;
  countdownDuration?: number;
  socket: Socket;
  localSocket?: Socket;
  roomName: string;
  member: string;
  position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center';
  onTimeout?: () => void;
  // Modern UI props
  isDarkMode?: boolean;
}

export type ModernConfirmHereModalType = (options: ModernConfirmHereModalOptions) => React.JSX.Element;

/**
 * ModernConfirmHereModal component
 *
 * Displays a premium glassmorphic modal with circular countdown timer.
 * Users must confirm their presence before the countdown expires.
 */
const ModernConfirmHereModal: React.FC<ModernConfirmHereModalOptions> = ({
  isConfirmHereModalVisible,
  onConfirmHereClose,
  countdownDuration = 120,
  socket,
  localSocket,
  roomName,
  member,
  onTimeout,
  isDarkMode = false,
}) => {
  const [counter, setCounter] = useState(countdownDuration);
  const [isMounted, setIsMounted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const handleTimeoutRef = useRef<() => void>(() => {});

  // Calculate progress for circular indicator
  const progress = counter / countdownDuration;
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference * (1 - progress);

  const clearCountdown = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const emitDisconnect = useCallback(() => {
    socket?.emit('disconnectUser', {
      member,
      roomName,
      ban: false,
    });

    try {
      if (localSocket?.id) {
        localSocket.emit('disconnectUser', {
          member,
          roomName,
          ban: false,
        });
      }
    } catch {
      // Ignore local socket errors
    }
  }, [socket, localSocket, member, roomName]);

  const confirmAndClose = useCallback(() => {
    clearCountdown();
    onConfirmHereClose();
  }, [clearCountdown, onConfirmHereClose]);

  // Keep handleTimeoutRef updated with latest callbacks
  useEffect(() => {
    handleTimeoutRef.current = () => {
      emitDisconnect();
      onTimeout?.();
      confirmAndClose();
    };
  }, [emitDisconnect, onTimeout, confirmAndClose]);

  const handleConfirm = useCallback(() => {
    confirmAndClose();
  }, [confirmAndClose]);

  // Reset counter when duration changes or modal opens
  useEffect(() => {
    setCounter(countdownDuration);
  }, [countdownDuration, isConfirmHereModalVisible]);

  // Start/stop countdown based on visibility - matches non-modern logic exactly
  useEffect(() => {
    if (!isConfirmHereModalVisible) {
      setIsMounted(false);
      clearCountdown();
      return;
    }

    setIsMounted(true);
    clearCountdown();

    let timeRemaining = countdownDuration;
    setCounter(countdownDuration);

    timerRef.current = setInterval(() => {
      timeRemaining -= 1;
      setCounter(Math.max(timeRemaining, 0));

      if (timeRemaining <= 0) {
        clearCountdown();
        handleTimeoutRef.current();
      }
    }, 1000);

    return () => {
      clearCountdown();
    };
  }, [clearCountdown, countdownDuration, isConfirmHereModalVisible]);

  if (!isConfirmHereModalVisible) {
    return null;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STYLES
  // ─────────────────────────────────────────────────────────────────────────
  const overlayStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    opacity: isMounted ? 1 : 0,
    transition: 'opacity 0.3s ease-out',
  };

  const contentStyle: CSSProperties = {
    width: 360,
    padding: MediasfuSpacing.xl,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: MediasfuSpacing.lg,
    transform: isMounted ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    background: isDarkMode 
      ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(241, 245, 249, 0.95))',
    borderRadius: 20,
    border: isDarkMode 
      ? '1px solid rgba(255, 255, 255, 0.1)' 
      : '1px solid rgba(0, 0, 0, 0.08)',
    boxShadow: isDarkMode 
      ? '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
      : '0 20px 60px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
  };

  const progressContainerStyle: CSSProperties = {
    position: 'relative',
    width: 100,
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const counterTextStyle: CSSProperties = {
    position: 'absolute',
    ...MediasfuTypography.getHeadlineLarge(isDarkMode),
    fontSize: 28,
    fontWeight: 700,
    color: counter <= 30
      ? MediasfuColors.danger
      : counter <= 60
        ? MediasfuColors.warning
        : (isDarkMode ? MediasfuColors.textPrimaryDark : MediasfuColors.textPrimary),
  };

  const titleStyle: CSSProperties = {
    ...MediasfuTypography.getTitleLarge(isDarkMode),
    textAlign: 'center',
    marginBottom: MediasfuSpacing.xs,
  };

  const messageStyle: CSSProperties = {
    ...MediasfuTypography.getBodyMedium(isDarkMode),
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 1.5,
  };

  const buttonStyle: CSSProperties = {
    width: '100%',
    padding: `${MediasfuSpacing.md}px ${MediasfuSpacing.lg}px`,
    borderRadius: 12,
    border: 'none',
    background: `linear-gradient(135deg, ${MediasfuColors.success} 0%, ${MediasfuColors.successDark} 100%)`,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.3s ease',
    boxShadow: `0 4px 20px ${MediasfuColors.success}40`,
  };

  const warningStyle: CSSProperties = {
    ...MediasfuTypography.getBodySmall(isDarkMode),
    color: counter <= 30 ? MediasfuColors.danger : (isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'),
    textAlign: 'center',
    marginTop: MediasfuSpacing.sm,
  };

  // Get stroke color based on time remaining
  const getStrokeColor = (): string => {
    if (counter <= 30) return MediasfuColors.danger;
    if (counter <= 60) return MediasfuColors.warning;
    return MediasfuColors.primary;
  };

  const handleOverlayClick = () => {
    handleConfirm();
  };

  return (
    <div style={overlayStyle} onClick={handleOverlayClick}>
      <div onClick={(e) => e.stopPropagation()} style={contentStyle}>
        {/* Circular Progress */}
        <div style={progressContainerStyle}>
          <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
              strokeWidth="6"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={getStrokeColor()}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease',
                filter: `drop-shadow(0 0 6px ${getStrokeColor()}80)`,
              }}
            />
          </svg>
          <span style={counterTextStyle}>{counter}</span>
        </div>

        <h3 style={titleStyle}>Are You Still Here?</h3>

        <p style={messageStyle}>
          Please confirm your presence to stay connected to the meeting.
        </p>

        <button
          onClick={handleConfirm}
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 6px 24px ${MediasfuColors.success}50`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 4px 20px ${MediasfuColors.success}40`;
          }}
        >
          I&apos;m Here
        </button>

        <p style={warningStyle}>
          {counter <= 30
            ? '⚠️ You will be disconnected soon!'
            : 'Time remaining before automatic disconnect'}
        </p>
      </div>
    </div>
  );
};

export default ModernConfirmHereModal;
export { ModernConfirmHereModal };