/**
 * Modern meeting progress timer with glassmorphic styling.
 *
 * A premium-styled timer badge that displays the elapsed time of a meeting
 * with smooth animations and glassmorphic effects.
 * Uses the same MeetingProgressTimerOptions as the original component.
 *
 * @example
 * ```tsx
 * <ModernMeetingProgressTimer
 *   meetingProgressTime="10:30"
 *   position="topRight"
 * />
 * ```
 */

import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { MeetingProgressTimerOptions } from '../../components/displayComponents/MeetingProgressTimer';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';
import { MediasfuAnimations } from '../core/theme/MediasfuAnimations';
import { MediasfuBorders } from '../core/theme/MediasfuBorders';

export interface ModernMeetingProgressTimerOptions extends MeetingProgressTimerOptions {
  /** Use dark mode styling */
  isDarkMode?: boolean;
  /** Enable glassmorphism effects */
  enableGlassmorphism?: boolean;
  /** Enable glow effects */
  enableGlow?: boolean;
  /** Show recording indicator */
  isRecording?: boolean;
  /** Timer variant */
  variant?: 'badge' | 'pill' | 'minimal';
  /** Show icon before time */
  showIcon?: boolean;
}

export type ModernMeetingProgressTimerType = (
  options: ModernMeetingProgressTimerOptions
) => React.JSX.Element;

/**
 * ModernMeetingProgressTimer displays meeting duration with premium styling.
 */
export const ModernMeetingProgressTimer: React.FC<ModernMeetingProgressTimerOptions> = ({
  meetingProgressTime,
  initialBackgroundColor,
  position = 'topLeft',
  textStyle,
  showTimer = true,
  // containerProps - reserved for future wrapper customization
  badgeProps,
  textProps,
  renderBadge,
  renderContainer,
  // Modern-specific props
  isDarkMode = true,
  enableGlassmorphism = true,
  enableGlow = false,
  isRecording = false,
  variant = 'badge',
  showIcon = true,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [pulse, setPulse] = useState(false);

  // Mount animation
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Recording pulse animation
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setPulse((prev) => !prev);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRecording]);

  // Parse time for visual indication
  const timeValue = useMemo(() => {
    const parts = meetingProgressTime.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return 0;
  }, [meetingProgressTime]);

  // Determine color based on time (warning after 45min, danger after 55min)
  const statusColor = useMemo(() => {
    if (isRecording) return MediasfuColors.danger;
    if (timeValue > 55 * 60) return MediasfuColors.danger;
    if (timeValue > 45 * 60) return MediasfuColors.warning;
    return initialBackgroundColor || MediasfuColors.success;
  }, [timeValue, isRecording, initialBackgroundColor]);

  // Position styles
  const getPositionStyle = (): React.CSSProperties => {
    const styles: React.CSSProperties = {
      position: 'absolute',
      zIndex: 10,
    };

    switch (position) {
      case 'topLeft':
        styles.top = MediasfuSpacing.md;
        styles.left = MediasfuSpacing.md;
        break;
      case 'topRight':
        styles.top = MediasfuSpacing.md;
        styles.right = MediasfuSpacing.md;
        break;
      case 'bottomLeft':
        styles.bottom = MediasfuSpacing.md;
        styles.left = MediasfuSpacing.md;
        break;
      case 'bottomRight':
        styles.bottom = MediasfuSpacing.md;
        styles.right = MediasfuSpacing.md;
        break;
    }

    return styles;
  };

  // Get variant styles
  const getVariantStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: `${MediasfuSpacing.xs}px`,
      transition: `all ${MediasfuAnimations.normal}ms ${MediasfuAnimations.smooth}`,
    };

    switch (variant) {
      case 'pill':
        return {
          ...baseStyles,
          padding: `${MediasfuSpacing.xs}px ${MediasfuSpacing.md}px`,
          borderRadius: `${MediasfuBorders.full}px`,
        };
      case 'minimal':
        return {
          ...baseStyles,
          padding: `${MediasfuSpacing.xs}px ${MediasfuSpacing.sm}px`,
          borderRadius: `${MediasfuBorders.sm}px`,
          background: 'transparent !important',
          backdropFilter: 'none',
        };
      case 'badge':
      default:
        return {
          ...baseStyles,
          padding: `${MediasfuSpacing.xs}px ${MediasfuSpacing.sm}px`,
          borderRadius: `${MediasfuBorders.sm}px`,
        };
    }
  };

  // Badge styles
  const badgeStyle: React.CSSProperties = {
    ...getPositionStyle(),
    ...getVariantStyles(),
    background: enableGlassmorphism
      ? MediasfuColors.glassBackground(isDarkMode)
      : isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: enableGlassmorphism ? 'blur(12px)' : 'none',
    WebkitBackdropFilter: enableGlassmorphism ? 'blur(12px)' : 'none',
    border: enableGlassmorphism
      ? `1px solid ${MediasfuColors.glassBorder(isDarkMode)}`
      : `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
    boxShadow: enableGlow
      ? `0 0 12px ${MediasfuColors.hexToRgba(statusColor, 0.4)}, ${MediasfuColors.elevation(2, isDarkMode)}`
      : isDarkMode ? MediasfuColors.elevation(2, isDarkMode) : '0 2px 8px rgba(0, 0, 0, 0.12)',
    transform: isMounted ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(-10px)',
    opacity: isMounted ? 1 : 0,
  };

  // Icon container styles - bright colors work well on dark badge background
  const iconContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 18,
    height: 18,
    borderRadius: '50%',
    backgroundColor: MediasfuColors.hexToRgba(statusColor, 0.25),
    color: statusColor,
    fontSize: '10px',
    animation: isRecording && pulse ? 'modernTimerPulse 1s ease-in-out' : 'none',
    boxShadow: `0 0 6px ${MediasfuColors.hexToRgba(statusColor, 0.3)}`,
  };

  // Time text styles - adapt to background mode
  const timeStyle: React.CSSProperties = {
    ...MediasfuTypography.toStyle(MediasfuTypography.labelMedium),
    fontFamily: MediasfuTypography.monoFontFamily,
    fontWeight: 600,
    color: isDarkMode ? '#FFFFFF' : '#1F2937',
    letterSpacing: '0.5px',
    fontSize: '16px', // Increased size
    ...textStyle,
  };

  // Recording indicator styles
  const recordingDotStyle: React.CSSProperties = {
    width: 10, // Increased size
    height: 10, // Increased size
    borderRadius: '50%',
    backgroundColor: MediasfuColors.danger,
    boxShadow: `0 0 8px ${MediasfuColors.danger}`,
    opacity: pulse ? 1 : 0.5,
    transition: 'opacity 0.3s ease',
  };

  if (!showTimer) {
    return <></>;
  }

  const defaultBadge = (
    <div 
      style={badgeStyle} 
      {...badgeProps}
      title={isRecording ? "Recording in progress" : "Meeting duration"} // Simple tooltip
    >
      {/* Icon or Recording Indicator */}
      {showIcon && (
        <div style={{...iconContainerStyle, width: 24, height: 24}}> {/* Increased size */}
          {isRecording ? (
            <div style={recordingDotStyle} />
          ) : (
            <FontAwesomeIcon icon={faClock} style={{ fontSize: '12px' }} />
          )}
        </div>
      )}

      {/* Time Display */}
      <span style={timeStyle} {...textProps}>
        {meetingProgressTime}
      </span>

      {/* Recording Label */}
      {isRecording && (
        <span
          style={{
            ...MediasfuTypography.toStyle(MediasfuTypography.labelSmall),
            color: MediasfuColors.danger,
            fontWeight: 600,
            marginLeft: MediasfuSpacing.xs,
            fontSize: '12px', // Increased size
          }}
        >
          REC
        </span>
      )}
    </div>
  );

  // Custom badge rendering
  const badge = renderBadge
    ? renderBadge({ defaultBadge, showTimer })
    : defaultBadge;

  const defaultContainer = (
    <>
      <style>
        {`
          @keyframes modernTimerPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
        `}
      </style>
      {badge}
    </>
  );

  // Custom container rendering
  if (renderContainer) {
    return <>{renderContainer({ defaultContainer })}</>;
  }

  return <>{defaultContainer}</>;
};

export default ModernMeetingProgressTimer;
