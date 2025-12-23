/**
 * A versatile styled container that integrates all premium visual effects.
 *
 * [StyledContainer] provides a unified API for applying:
 * - Neumorphism effects
 * - Glow effects
 * - Glassmorphism (backdrop blur)
 * - Pulse borders
 * - Gradient backgrounds
 * - Animated state transitions
 *
 * It can be configured via [ModernStyleOptions] or individual properties.
 *
 * @example
 * ```tsx
 * <StyledContainer
 *   enableGlow={true}
 *   enableGlassmorphism={true}
 *   isDarkMode={true}
 * >
 *   <p>Premium styled content</p>
 * </StyledContainer>
 * ```
 */

import React, { useState, useCallback, useEffect } from 'react';
import { MediasfuColors } from '../theme/MediasfuColors';
import { MediasfuSpacing } from '../theme/MediasfuSpacing';
import { MediasfuAnimations } from '../theme/MediasfuAnimations';
import { ModernStyleOptions, styleOptionsToCSS } from '../theme/ModernStyleOptions';
import { injectModernAnimations } from '../../utils/injectAnimations';

export interface StyledContainerProps {
  /** Child content */
  children: React.ReactNode;
  /** Style configuration. Takes precedence over individual properties. */
  styleOptions?: ModernStyleOptions;
  /** Custom decoration styles */
  decoration?: React.CSSProperties;
  /** Padding */
  padding?: string | number | React.CSSProperties;
  /** Margin */
  margin?: string | number;
  /** Width */
  width?: number | string;
  /** Height */
  height?: number | string;
  /** Border radius */
  borderRadius?: number;
  /** Enable glow effect */
  enableGlow?: boolean;
  /** Glow intensity (0.0 to 1.0) */
  glowIntensity?: number;
  /** Custom glow color */
  glowColor?: string;
  /** Enable neumorphism */
  enableNeumorphism?: boolean;
  /** Neumorphic depth level (1, 2, or 3) */
  neumorphicDepth?: number;
  /** Enable glassmorphism (backdrop blur) */
  enableGlassmorphism?: boolean;
  /** Blur amount for glassmorphism */
  blurAmount?: number;
  /** Enable pulsing border */
  enablePulseBorder?: boolean;
  /** Pulse border color */
  pulseBorderColor?: string;
  /** Background color */
  backgroundColor?: string;
  /** Background gradient */
  gradient?: string;
  /** Custom box shadow */
  shadows?: string;
  /** Animation duration for state transitions in ms */
  animationDuration?: number;
  /** Whether animations are enabled */
  animationsEnabled?: boolean;
  /** Click handler */
  onTap?: () => void;
  /** Long press handler */
  onLongPress?: () => void;
  /** Whether the container is in pressed state */
  isPressed?: boolean;
  /** Whether the container is in hover state */
  isHovered?: boolean;
  /** Whether to use dark mode styling */
  isDarkMode?: boolean;
  /** Scale factor when pressed */
  pressedScale?: number;
  /** Scale factor when hovered */
  hoveredScale?: number;
  /** Content alignment */
  alignment?: 'start' | 'center' | 'end' | 'stretch';
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

export const StyledContainer: React.FC<StyledContainerProps> = ({
  children,
  styleOptions,
  decoration,
  padding,
  margin,
  width,
  height,
  borderRadius = 16,
  enableGlow = false,
  glowIntensity = 0.3,
  glowColor,
  enableNeumorphism = false,
  neumorphicDepth = 1,
  enableGlassmorphism = false,
  blurAmount = 10,
  enablePulseBorder = false,
  pulseBorderColor,
  backgroundColor,
  gradient,
  shadows,
  animationDuration = 200,
  animationsEnabled = true,
  onTap,
  onLongPress,
  isPressed: isPressedProp = false,
  isHovered: isHoveredProp = false,
  isDarkMode = true,
  pressedScale = 0.98,
  hoveredScale = 1.02,
  alignment,
  className,
  style,
}) => {
  const [isPressed, setIsPressed] = useState(isPressedProp);
  const [isHovered, setIsHovered] = useState(isHoveredProp);
  const [pulseValue, setPulseValue] = useState(0);
  const longPressTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const pulseRef = React.useRef<number | null>(null);

  // Inject animations on mount
  useEffect(() => {
    injectModernAnimations();
  }, []);

  // Sync prop states
  useEffect(() => {
    setIsPressed(isPressedProp);
  }, [isPressedProp]);

  useEffect(() => {
    setIsHovered(isHoveredProp);
  }, [isHoveredProp]);

  // Pulse animation
  useEffect(() => {
    if (!enablePulseBorder) return;

    let startTime: number | null = null;
    const duration = 1500;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration;
      setPulseValue(progress);
      pulseRef.current = requestAnimationFrame(animate);
    };

    pulseRef.current = requestAnimationFrame(animate);

    return () => {
      if (pulseRef.current) {
        cancelAnimationFrame(pulseRef.current);
      }
    };
  }, [enablePulseBorder]);

  // Apply styleOptions if provided
  const optionsStyles = styleOptions ? styleOptionsToCSS(styleOptions, isDarkMode) : {};

  // Calculate padding
  const getPadding = (): React.CSSProperties => {
    if (!padding) {
      return { padding: `${MediasfuSpacing.md}px` };
    }
    if (typeof padding === 'number') {
      return { padding: `${padding}px` };
    }
    if (typeof padding === 'string') {
      return { padding };
    }
    return padding as React.CSSProperties;
  };

  // Build neumorphic shadows
  const buildNeumorphicShadows = (): string => {
    if (!enableNeumorphism) return '';
    
    const depth = Math.max(1, Math.min(3, neumorphicDepth));
    const baseOffset = 4 * depth;
    const baseBlur = 8 * depth;

    if (isPressed) {
      if (isDarkMode) {
        return `inset ${-baseOffset / 2}px ${-baseOffset / 2}px ${baseBlur / 2}px rgba(0, 0, 0, 0.4), inset ${baseOffset / 2}px ${baseOffset / 2}px ${baseBlur / 2}px rgba(45, 58, 79, 0.2)`;
      }
      return `inset ${-baseOffset / 2}px ${-baseOffset / 2}px ${baseBlur / 2}px rgba(0, 0, 0, 0.08), inset ${baseOffset / 2}px ${baseOffset / 2}px ${baseBlur / 2}px rgba(255, 255, 255, 0.5)`;
    }

    if (isDarkMode) {
      return `${baseOffset}px ${baseOffset}px ${baseBlur}px rgba(0, 0, 0, 0.5), ${-baseOffset}px ${-baseOffset}px ${baseBlur}px rgba(45, 58, 79, 0.3)`;
    }
    return `${baseOffset}px ${baseOffset}px ${baseBlur}px rgba(163, 177, 198, 0.6), ${-baseOffset}px ${-baseOffset}px ${baseBlur}px rgba(255, 255, 255, 0.8)`;
  };

  // Build glow shadow
  const buildGlowShadow = (): string => {
    if (!enableGlow) return '';
    
    const color = glowColor || MediasfuColors.primary;
    const intensity = isHovered ? glowIntensity * 1.2 : glowIntensity;
    const blurRadius = 15 * intensity;
    const spreadRadius = 5 * intensity;
    return `0 0 ${blurRadius}px ${spreadRadius}px ${MediasfuColors.hexToRgba(color, intensity * 0.5)}`;
  };

  // Build pulse border shadow
  const buildPulseBorderShadow = (): string => {
    if (!enablePulseBorder) return '';
    
    const color = pulseBorderColor || MediasfuColors.primary;
    const pulseIntensity = Math.sin(pulseValue * Math.PI * 2) * 0.5 + 0.5;
    const glowSize = 3 + pulseIntensity * 8;
    return `0 0 ${glowSize}px ${MediasfuColors.hexToRgba(color, pulseIntensity * 0.6)}`;
  };

  // Combine all shadows
  const combineShadows = (): string => {
    const allShadows: string[] = [];
    
    if (shadows) allShadows.push(shadows);
    if (enableNeumorphism) allShadows.push(buildNeumorphicShadows());
    if (enableGlow) allShadows.push(buildGlowShadow());
    if (enablePulseBorder) allShadows.push(buildPulseBorderShadow());
    
    return allShadows.filter(Boolean).join(', ') || 'none';
  };

  // Calculate background
  const getBackground = (): string => {
    if (gradient) return gradient;
    if (enableGlassmorphism) {
      return MediasfuColors.glassBackground(isDarkMode);
    }
    if (enableNeumorphism) {
      return isDarkMode ? '#1E1E2E' : '#E0E5EC';
    }
    return backgroundColor || (isDarkMode ? MediasfuColors.surfaceDark : MediasfuColors.surface);
  };

  // Get alignment styles
  const getAlignmentStyle = (): React.CSSProperties => {
    if (!alignment) return {};
    const alignMap = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      stretch: 'stretch',
    };
    return {
      display: 'flex',
      alignItems: alignMap[alignment],
      justifyContent: alignMap[alignment],
    };
  };

  // Calculate transform
  const getTransform = (): string => {
    if (!animationsEnabled) return 'none';
    if (isPressed) return `scale(${pressedScale})`;
    if (isHovered && (onTap || onLongPress)) return `scale(${hoveredScale})`;
    return 'scale(1)';
  };

  // Container styles
  const containerStyle: React.CSSProperties = {
    ...getPadding(),
    ...getAlignmentStyle(),
    width,
    height,
    margin: typeof margin === 'number' ? `${margin}px` : margin,
    background: getBackground(),
    borderRadius: `${borderRadius}px`,
    boxShadow: combineShadows(),
    backdropFilter: enableGlassmorphism ? `blur(${blurAmount}px)` : undefined,
    WebkitBackdropFilter: enableGlassmorphism ? `blur(${blurAmount}px)` : undefined,
    border: enableGlassmorphism ? `1px solid ${MediasfuColors.glassBorder(isDarkMode)}` : 
            enablePulseBorder ? `2px solid ${MediasfuColors.hexToRgba(pulseBorderColor || MediasfuColors.primary, 0.3 + Math.sin(pulseValue * Math.PI * 2) * 0.25 + 0.25)}` :
            undefined,
    cursor: onTap || onLongPress ? 'pointer' : 'default',
    transform: getTransform(),
    transition: animationsEnabled ? `all ${animationDuration}ms ${MediasfuAnimations.smooth}` : 'none',
    userSelect: 'none',
    ...optionsStyles,
    ...decoration,
    ...style,
  };

  const handleMouseDown = useCallback(() => {
    if (onTap || onLongPress) {
      setIsPressed(true);
      
      if (onLongPress) {
        longPressTimeout.current = setTimeout(() => {
          onLongPress();
        }, 500);
      }
    }
  }, [onTap, onLongPress]);

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false);
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
  }, []);

  const handleClick = useCallback(() => {
    if (onTap) onTap();
  }, [onTap]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((onTap || onLongPress) && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setIsPressed(true);
    }
  }, [onTap, onLongPress]);

  const handleKeyUp = useCallback((e: React.KeyboardEvent) => {
    if ((onTap || onLongPress) && (e.key === 'Enter' || e.key === ' ')) {
      setIsPressed(false);
      if (onTap) onTap();
    }
  }, [onTap, onLongPress]);

  return (
    <div
      className={className}
      style={containerStyle}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      role={onTap || onLongPress ? 'button' : undefined}
      tabIndex={onTap || onLongPress ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export default StyledContainer;
