/**
 * Modern Control Buttons Component
 *
 * A FAB-style glassmorphic control bar with micro-animated icon buttons,
 * glow effects, and premium styling. Used for meeting controls (mic, camera, etc.).
 *
 * @example
 * ```tsx
 * <ModernControlButtonsComponent
 *   buttons={[
 *     { icon: <MicIcon />, name: 'mic', onPress: toggleMic, active: micOn },
 *     { icon: <CameraIcon />, name: 'camera', onPress: toggleCamera, active: cameraOn },
 *   ]}
 *   isDarkMode={true}
 * />
 * ```
 */

import React, { useState, useEffect, useCallback } from 'react';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuSpacing } from '../core/theme/MediasfuSpacing';
import { MediasfuAnimations } from '../core/theme/MediasfuAnimations';
import { GlassmorphicContainer } from '../core/widgets/GlassmorphicContainer';
import { injectModernAnimations } from '../utils/injectAnimations';

/** Single control button configuration */
export interface ControlButton {
  /** Icon element */
  icon: React.ReactNode;
  /** Alternate icon when active */
  alternateIcon?: React.ReactNode;
  /** Button name/id */
  name: string;
  /** Click handler */
  onPress?: () => void;
  /** Whether button is active */
  active?: boolean;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Whether to show the button */
  show?: boolean;
  /** Tooltip text */
  tooltip?: string;
  /** Custom active color */
  activeColor?: string;
  /** Custom inactive color */
  inactiveColor?: string;
  /** Custom background color */
  backgroundColor?: string;
  /** Custom component override */
  customComponent?: React.ReactNode;
}

export interface ModernControlButtonsComponentOptions {
  /** Array of control buttons */
  buttons: ControlButton[];
  /** Button arrangement direction */
  direction?: 'horizontal' | 'vertical';
  /** Main axis alignment */
  alignment?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
  /** Active icon color */
  activeIconColor?: string;
  /** Inactive icon color */
  inactiveIconColor?: string;
}

export interface ModernControlButtonsComponentProps {
  /** Control buttons options */
  options?: ModernControlButtonsComponentOptions;
  /** Array of control buttons (shorthand) */
  buttons?: ControlButton[];
  /** Button arrangement direction (shorthand) */
  direction?: 'horizontal' | 'vertical';
  /** Main axis alignment (shorthand) */
  alignment?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
  /** Whether to use dark mode */
  isDarkMode?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Size of icon buttons */
  iconSize?: number;
  /** Animation on mount */
  animateOnMount?: boolean;
}

/** Premium control button with glow effects and animations */
interface PremiumControlButtonProps {
  button: ControlButton;
  isDarkMode: boolean;
  iconSize: number;
  activeIconColor?: string;
  inactiveIconColor?: string;
  index: number;
}

const PremiumControlButton: React.FC<PremiumControlButtonProps> = ({
  button,
  isDarkMode,
  iconSize,
  activeIconColor,
  inactiveIconColor,
  // index - reserved for staggered animation
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (button.customComponent) {
    return <>{button.customComponent}</>;
  }

  const isActive = button.active ?? false;
  const isDisabled = button.disabled ?? false;
  const effectiveIcon = isActive && button.alternateIcon ? button.alternateIcon : button.icon;
  const activeColor = button.activeColor || activeIconColor || MediasfuColors.primary;
  const inactiveColor = button.inactiveColor || inactiveIconColor || (isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)');

  // Determine background and glow based on state
  const bgColor = button.backgroundColor || (isActive
    ? activeColor
    : isDarkMode
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.06)');

  const glowColor = isActive ? activeColor : 'transparent';

  // Button container styles
  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: iconSize + 16,
    height: iconSize + 16,
    borderRadius: '50%',
    background: isActive ? MediasfuColors.brandGradient(isDarkMode) : bgColor,
    boxShadow: isActive
      ? `0 0 15px ${MediasfuColors.hexToRgba(glowColor, 0.4)}, ${MediasfuColors.elevation(2, isDarkMode)}`
      : isHovered
        ? MediasfuColors.elevation(1, isDarkMode)
        : 'none',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.5 : 1,
    transform: isPressed ? 'scale(0.9)' : isHovered ? 'scale(1.05)' : 'scale(1)',
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.snappy}`,
    border: 'none',
    outline: 'none',
    padding: 0,
    position: 'relative',
  };

  // Icon styles
  const iconStyle: React.CSSProperties = {
    width: iconSize,
    height: iconSize,
    color: isActive ? '#FFFFFF' : inactiveColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // Tooltip styles
  const tooltipText = button.tooltip || button.name;
  const tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: '8px',
    padding: '4px 8px',
    background: isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',
    color: isDarkMode ? '#FFFFFF' : '#1F2937',
    fontSize: '12px',
    borderRadius: '6px',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    opacity: isHovered && tooltipText ? 1 : 0,
    visibility: isHovered && tooltipText ? 'visible' : 'hidden',
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
    boxShadow: MediasfuColors.elevation(2, isDarkMode),
    zIndex: 1000,
  };

  const handleClick = useCallback(() => {
    if (!isDisabled && button.onPress) {
      button.onPress();
    }
  }, [isDisabled, button]);

  return (
    <button
      type="button"
      style={buttonStyle}
      onClick={handleClick}
      onMouseDown={() => !isDisabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseEnter={() => !isDisabled && setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      disabled={isDisabled}
      aria-label={button.tooltip || button.name}
      aria-pressed={isActive}
    >
      <span style={iconStyle}>{effectiveIcon}</span>
      {/* Tooltip shows button.tooltip or button.name as fallback */}
      {(button.tooltip || button.name) && (
        <span style={tooltipStyle}>{button.tooltip || button.name}</span>
      )}
    </button>
  );
};

export const ModernControlButtonsComponent: React.FC<ModernControlButtonsComponentProps> = ({
  options,
  buttons: buttonsProp,
  direction: directionProp,
  alignment: alignmentProp,
  isDarkMode = true,
  className,
  style,
  iconSize = 24,
  animateOnMount = true,
}) => {
  // Merge options with individual props
  const buttons = options?.buttons ?? buttonsProp ?? [];
  const direction = options?.direction ?? directionProp ?? 'horizontal';
  const alignment = options?.alignment ?? alignmentProp ?? 'center';
  const activeIconColor = options?.activeIconColor;
  const inactiveIconColor = options?.inactiveIconColor;

  const [isMounted, setIsMounted] = useState(!animateOnMount);

  // Inject animations on mount
  useEffect(() => {
    injectModernAnimations();
    if (animateOnMount) {
      const timer = setTimeout(() => setIsMounted(true), 10);
      return () => clearTimeout(timer);
    }
  }, [animateOnMount]);

  // Filter visible buttons
  const visibleButtons = buttons.filter((b) => b.show !== false);

  if (visibleButtons.length === 0) {
    return null;
  }

  // Alignment mapping
  const alignmentMap: Record<string, string> = {
    'start': 'flex-start',
    'center': 'center',
    'end': 'flex-end',
    'space-between': 'space-between',
    'space-around': 'space-around',
  };

  // Wrapper styles
  const wrapperStyle: React.CSSProperties = {
    opacity: isMounted ? 1 : 0,
    transform: isMounted ? 'scale(1)' : 'scale(0.8)',
    transition: `all ${MediasfuAnimations.normal}ms ${MediasfuAnimations.snappy}`,
    boxShadow: `0 0 20px ${MediasfuColors.hexToRgba(MediasfuColors.primary, 0.15)}`,
    borderRadius: 32,
  };

  // Content styles
  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: direction === 'vertical' ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: alignmentMap[alignment] || 'center',
    gap: `${MediasfuSpacing.sm}px`,
  };

  return (
    <div className={className} style={{ ...wrapperStyle, ...style }}>
      <GlassmorphicContainer
        borderRadius={32}
        blur={20}
        padding={{ paddingLeft: MediasfuSpacing.md, paddingRight: MediasfuSpacing.md, paddingTop: MediasfuSpacing.sm, paddingBottom: MediasfuSpacing.sm }}
        isDarkMode={isDarkMode}
      >
        <div style={contentStyle}>
          {visibleButtons.map((button, index) => (
            <PremiumControlButton
              key={button.name}
              button={button}
              isDarkMode={isDarkMode}
              iconSize={iconSize}
              activeIconColor={activeIconColor}
              inactiveIconColor={inactiveIconColor}
              index={index}
            />
          ))}
        </div>
      </GlassmorphicContainer>
    </div>
  );
};

export default ModernControlButtonsComponent;
