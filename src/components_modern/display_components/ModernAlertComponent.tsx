/**
 * Modern Alert Component
 *
 * A redesigned alert/toast component with glassmorphic styling, premium animations,
 * and glow effects for success/error/warning states.
 *
 * @example
 * ```tsx
 * <ModernAlertComponent
 *   visible={showAlert}
 *   message="Operation successful!"
 *   type="success"
 *   duration={3000}
 *   onHide={() => setShowAlert(false)}
 *   isDarkMode={true}
 * />
 * ```
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';
import { MediasfuAnimations } from '../core/theme/MediasfuAnimations';
import { GlassmorphicContainer } from '../core/widgets/GlassmorphicContainer';
import { injectModernAnimations } from '../utils/injectAnimations';

// Import classic AlertComponentOptions for withOverride compatibility
import { AlertComponentOptions } from '../../components/displayComponents/AlertComponent';
import type { AlertPosition } from '../../@types/types';

/** Alert type determines the color and icon */
export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'danger';

export interface ModernAlertComponentOptions {
  /** Whether the alert is visible */
  visible: boolean;
  /** Alert message */
  message: string;
  /** Alert type */
  type?: AlertType;
  /** Duration in ms before auto-dismiss (0 = no auto-dismiss) */
  duration?: number;
  /** Callback when alert is hidden */
  onHide?: () => void;
  /** Callback when alert content is tapped */
  onContentTap?: () => boolean | void;
  /** Whether tapping content dismisses the alert */
  contentDismissible?: boolean;
  /** Position of the alert */
  position?: AlertPosition;
}

// Props interface extends AlertComponentOptions for withOverride compatibility
// Pick required props and make others optional for flexibility
export interface ModernAlertComponentProps extends Omit<Partial<AlertComponentOptions>, 'visible' | 'message'> {
  /** Whether the alert is visible (required for compatibility) */
  visible: boolean;
  /** Alert message (required for compatibility) */
  message: string;
  /** Alert options (alternative to direct props) */
  options?: ModernAlertComponentOptions;
  /** Position (shorthand) */
  position?: AlertPosition;
  /** Whether to use dark mode */
  isDarkMode?: boolean;
  /** Custom icon component */
  icon?: React.ReactNode;
  /** Custom action button */
  action?: React.ReactNode;
}

// Normalize alert type - map 'danger' to 'error' for consistent internal handling
const normalizeAlertType = (type: AlertType | 'danger' | undefined): 'success' | 'error' | 'warning' | 'info' => {
  if (type === 'danger') return 'error';
  if (type === 'success' || type === 'error' || type === 'warning' || type === 'info') return type;
  return 'success'; // default
};

// Icons for different alert types (simple SVG-based)
const AlertIcons: Record<'success' | 'error' | 'warning' | 'info', React.ReactNode> = {
  success: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M16.667 5L7.5 14.167L3.333 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M15 5L5 15M5 5L15 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 6V10M10 14H10.01M18 10C18 14.418 14.418 18 10 18C5.582 18 2 14.418 2 10C2 5.582 5.582 2 10 2C14.418 2 18 5.582 18 10Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 14V10M10 6H10.01M18 10C18 14.418 14.418 18 10 18C5.582 18 2 14.418 2 10C2 5.582 5.582 2 10 2C14.418 2 18 5.582 18 10Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

// Color mapping for alert types (uses normalized types - no 'danger')
const getAlertColors = (type: 'success' | 'error' | 'warning' | 'info', isDarkMode: boolean) => {
  const colors: Record<'success' | 'error' | 'warning' | 'info', { bg: string; border: string; glow: string; icon: string }> = {
    success: {
      bg: isDarkMode ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.1)',
      border: isDarkMode ? 'rgba(34, 197, 94, 0.4)' : 'rgba(34, 197, 94, 0.3)',
      glow: 'rgba(34, 197, 94, 0.3)',
      icon: '#22C55E',
    },
    error: {
      bg: isDarkMode ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)',
      border: isDarkMode ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.3)',
      glow: 'rgba(239, 68, 68, 0.3)',
      icon: '#EF4444',
    },
    warning: {
      bg: isDarkMode ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)',
      border: isDarkMode ? 'rgba(245, 158, 11, 0.4)' : 'rgba(245, 158, 11, 0.3)',
      glow: 'rgba(245, 158, 11, 0.3)',
      icon: '#F59E0B',
    },
    info: {
      bg: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)',
      border: isDarkMode ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.3)',
      glow: 'rgba(59, 130, 246, 0.3)',
      icon: '#3B82F6',
    },
  };
  return colors[type];
};

export const ModernAlertComponent: React.FC<ModernAlertComponentProps> = ({
  options,
  visible: visibleProp,
  message: messageProp,
  type: typeProp,
  duration: durationProp,
  onHide: onHideProp,
  position: positionProp,
  isDarkMode = true,
  icon: customIcon,
  action,
}) => {
  // Merge options with individual props
  const visible = options?.visible ?? visibleProp ?? false;
  const message = options?.message ?? messageProp ?? '';
  // Normalize type to handle 'danger' -> 'error' mapping for classic compatibility
  const type = normalizeAlertType(options?.type ?? typeProp);
  const duration = options?.duration ?? durationProp ?? 3000;
  const onHide = options?.onHide ?? onHideProp;
  const position = options?.position ?? positionProp ?? 'top-right';
  const contentDismissible = options?.contentDismissible ?? true;
  const onContentTap = options?.onContentTap;

  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [glowValue, setGlowValue] = useState(0.2);
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);
  const glowRef = useRef<number | null>(null);

  // Inject animations on mount
  useEffect(() => {
    injectModernAnimations();
  }, []);

  // Handle visibility transitions
  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 250);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  // Auto-dismiss timer
  useEffect(() => {
    if (visible && duration > 0) {
      dismissTimerRef.current = setTimeout(() => {
        onHide?.();
      }, duration);
    }

    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
    };
  }, [visible, duration, onHide]);

  // Glow animation
  useEffect(() => {
    if (!visible) return;

    let startTime: number | null = null;
    const animDuration = 2000;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % animDuration) / animDuration;
      const eased = Math.sin(progress * Math.PI);
      setGlowValue(0.2 + eased * 0.2);
      glowRef.current = requestAnimationFrame(animate);
    };

    glowRef.current = requestAnimationFrame(animate);

    return () => {
      if (glowRef.current) {
        cancelAnimationFrame(glowRef.current);
      }
    };
  }, [visible]);

  const handleDismiss = useCallback(() => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    onHide?.();
  }, [onHide]);

  const handleContentClick = useCallback(() => {
    let shouldDismiss = true;
    if (onContentTap) {
      const result = onContentTap();
      if (result === false) shouldDismiss = false;
    }
    if (shouldDismiss && contentDismissible) {
      handleDismiss();
    }
  }, [onContentTap, contentDismissible, handleDismiss]);

  if (!shouldRender) return null;

  const colors = getAlertColors(type, isDarkMode);

  // Position styles
  const getPositionStyle = (): React.CSSProperties => {
    const positions: Record<AlertPosition, React.CSSProperties> = {
      'top': { top: 20, left: '50%', transform: 'translateX(-50%)' },
      'bottom': { bottom: 20, left: '50%', transform: 'translateX(-50%)' },
      'top-right': { top: 20, right: 20 },
      'top-left': { top: 20, left: 20 },
      'bottom-right': { bottom: 20, right: 20 },
      'bottom-left': { bottom: 20, left: 20 },
      'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
    };
    return positions[position];
  };

  // Animation transform based on position
  const getAnimationTransform = (): string => {
    if (!isAnimating) {
      if (position === 'center') return 'scale(0.8)';
      if (position.includes('right')) return 'translateX(100px)';
      if (position.includes('left')) return 'translateX(-100px)';
      if (position.includes('top')) return 'translateY(-100px)';
      return 'translateY(100px)';
    }
    return 'translate(0, 0)';
  };

  // Container styles
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 10000,
    ...getPositionStyle(),
  };

  // Alert wrapper styles
  const alertWrapperStyle: React.CSSProperties = {
    transform: `${getAnimationTransform()} scale(${isAnimating ? 1 : 0.95})`,
    opacity: isAnimating ? 1 : 0,
    transition: `all 250ms ${MediasfuAnimations.snappy}`,
    boxShadow: `0 0 20px ${colors.glow.replace(/[\d.]+\)$/, `${glowValue})`)}`,
    borderRadius: 16,
    cursor: contentDismissible ? 'pointer' : 'default',
  };

  // Content styles
  const contentStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: `${MediasfuSpacing.sm}px`,
    minWidth: 200,
    maxWidth: 400,
  };

  // Icon container styles
  const iconContainerStyle: React.CSSProperties = {
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: colors.bg,
    color: colors.icon,
    flexShrink: 0,
  };

  // Message styles - adapt to background mode
  const messageStyle: React.CSSProperties = {
    ...MediasfuTypography.getBodyMedium(isDarkMode),
    flex: 1,
    color: isDarkMode ? '#FFFFFF' : '#1F2937',
  };

  // Close button styles - adapt to background mode
  const closeButtonStyle: React.CSSProperties = {
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)',
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
    flexShrink: 0,
  };

  return (
    <div style={containerStyle}>
      <div 
        style={alertWrapperStyle}
        onClick={handleContentClick}
        role="alert"
      >
        <GlassmorphicContainer
          borderRadius={16}
          blur={20}
          padding={MediasfuSpacing.md}
          isDarkMode={isDarkMode}
          borderColor={colors.border}
        >
          <div style={contentStyle}>
            <div style={iconContainerStyle}>
              {customIcon || AlertIcons[type]}
            </div>
            <span style={messageStyle}>{message}</span>
            {action}
            <button
              style={closeButtonStyle}
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss();
              }}
              aria-label="Close alert"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M12 4L4 12M4 4L12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </GlassmorphicContainer>
      </div>
    </div>
  );
};

export default ModernAlertComponent;
