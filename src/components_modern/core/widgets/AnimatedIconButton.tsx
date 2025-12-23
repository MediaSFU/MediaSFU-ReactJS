/**
 * Micro-animated icon button used for control surfaces (mic, camera, etc.).
 *
 * A premium icon button with press animation, active state styling,
 * and optional tooltip support.
 *
 * @example
 * ```tsx
 * <AnimatedIconButton
 *   icon={<MicIcon />}
 *   onPress={() => toggleMic()}
 *   isActive={isMicActive}
 *   tooltip="Toggle microphone"
 *   isDarkMode={true}
 * />
 * ```
 */

import React, { useState, useCallback, useEffect } from 'react';
import { MediasfuColors } from '../theme/MediasfuColors';
import { MediasfuSpacing } from '../theme/MediasfuSpacing';
import { MediasfuAnimations } from '../theme/MediasfuAnimations';
import { injectModernAnimations } from '../../utils/injectAnimations';

export interface AnimatedIconButtonProps {
  /** Icon element to display */
  icon: React.ReactNode;
  /** Click handler */
  onPress: () => void;
  /** Whether button is in active state */
  isActive?: boolean;
  /** Tooltip text */
  tooltip?: string;
  /** Icon size in pixels */
  size?: number;
  /** Animation duration in ms */
  duration?: number;
  /** Background color override */
  backgroundColor?: string;
  /** Active state color override */
  activeColor?: string;
  /** Whether to use dark mode styling */
  isDarkMode?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Disabled state */
  disabled?: boolean;
  /** Show as circular button */
  circular?: boolean;
  /** Animation on mount */
  animateOnMount?: boolean;
}

export const AnimatedIconButton: React.FC<AnimatedIconButtonProps> = ({
  icon,
  onPress,
  isActive = false,
  tooltip,
  size = 24,
  duration = 220,
  backgroundColor,
  activeColor,
  isDarkMode = true,
  className,
  style,
  disabled = false,
  circular = true,
  animateOnMount = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  // Track hover for tooltip delay timing
  const isHoveredRef = React.useRef(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMounted, setIsMounted] = useState(!animateOnMount);

  // Inject animations on mount
  useEffect(() => {
    injectModernAnimations();
    if (animateOnMount) {
      const timer = setTimeout(() => setIsMounted(true), 10);
      return () => clearTimeout(timer);
    }
  }, [animateOnMount]);

  // Calculate colors
  const baseColor = activeColor || MediasfuColors.primary;
  const iconColor = isActive
    ? '#FFFFFF'
    : isDarkMode
      ? 'rgba(255, 255, 255, 0.8)'
      : 'rgba(0, 0, 0, 0.8)';
  
  const bgColor = backgroundColor || (isActive
    ? baseColor
    : isDarkMode
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.06)');

  // Container styles
  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${MediasfuSpacing.sm}px`,
    background: isActive ? MediasfuColors.brandGradient(isDarkMode) : bgColor,
    borderRadius: circular ? '9999px' : `${MediasfuSpacing.sm}px`,
    boxShadow: isActive ? MediasfuColors.elevation(2, isDarkMode) : 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : isMounted ? 1 : 0,
    transform: isMounted
      ? isPressed
        ? 'scale(0.94)'
        : 'scale(1)'
      : 'scale(0.9)',
    transition: `all ${duration}ms ${MediasfuAnimations.smooth}`,
    outline: 'none',
    border: 'none',
    position: 'relative',
    ...style,
  };

  // Icon wrapper styles
  const iconWrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: `${size}px`,
    height: `${size}px`,
    color: isActive ? '#FFFFFF' : iconColor,
    transition: `color ${duration}ms ${MediasfuAnimations.smooth}`,
  };

  // Tooltip styles
  const tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: `${MediasfuSpacing.xs}px`,
    padding: `${MediasfuSpacing.xs}px ${MediasfuSpacing.sm}px`,
    background: isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',
    color: isDarkMode ? '#FFFFFF' : '#1F2937',
    fontSize: '12px',
    borderRadius: `${MediasfuSpacing.xs}px`,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    opacity: showTooltip ? 1 : 0,
    visibility: showTooltip ? 'visible' : 'hidden',
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
    boxShadow: MediasfuColors.elevation(2, isDarkMode),
    zIndex: 1000,
  };

  const handleMouseDown = useCallback(() => {
    if (!disabled) setIsPressed(true);
  }, [disabled]);

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!disabled) {
      isHoveredRef.current = true;
      if (tooltip) {
        const timer = setTimeout(() => setShowTooltip(true), 500);
        return () => clearTimeout(timer);
      }
    }
  }, [disabled, tooltip]);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    setIsPressed(false);
    setShowTooltip(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled) {
      onPress();
    }
  }, [disabled, onPress]);

  return (
    <button
      type="button"
      className={className}
      style={containerStyle}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      aria-label={tooltip}
      aria-pressed={isActive}
    >
      <span style={iconWrapperStyle}>{icon}</span>
      {tooltip && <span style={tooltipStyle}>{tooltip}</span>}
    </button>
  );
};

export default AnimatedIconButton;
