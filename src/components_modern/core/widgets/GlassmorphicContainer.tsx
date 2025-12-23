/**
 * Reusable frosted glass surface used for overlays and floating UI.
 *
 * A glassmorphic container that provides a modern frosted-glass effect
 * with backdrop blur, semi-transparent backgrounds, and subtle borders.
 *
 * @example
 * ```tsx
 * <GlassmorphicContainer isDarkMode={true} borderRadius={24} blur={16}>
 *   <h2>Modal Content</h2>
 *   <p>This has a frosted glass background</p>
 * </GlassmorphicContainer>
 * ```
 */

import React, { useState, useCallback, useEffect } from 'react';
import { MediasfuColors } from '../theme/MediasfuColors';
import { MediasfuSpacing } from '../theme/MediasfuSpacing';
import { MediasfuAnimations } from '../theme/MediasfuAnimations';
import { injectModernAnimations } from '../../utils/injectAnimations';

export interface GlassmorphicContainerProps {
  /** Child content */
  children: React.ReactNode;
  /** Border radius in pixels */
  borderRadius?: number;
  /** Blur amount in pixels */
  blur?: number;
  /** Custom padding */
  padding?: string | number | React.CSSProperties;
  /** Custom gradient background (overrides default glass gradient) */
  gradient?: string;
  /** Click handler */
  onClick?: () => void;
  /** Whether to use dark mode styling */
  isDarkMode?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Enable hover effect */
  hoverEffect?: boolean;
  /** Custom background color (overrides default glass background) */
  backgroundColor?: string;
  /** Custom border color */
  borderColor?: string;
  /** Border width */
  borderWidth?: number;
  /** Elevation level (1-5) */
  elevation?: number;
  /** Animation on mount */
  animateOnMount?: boolean;
  /** Animation duration in ms */
  animationDuration?: number;
}

export const GlassmorphicContainer: React.FC<GlassmorphicContainerProps> = ({
  children,
  borderRadius = 24,
  blur = 16,
  padding,
  gradient,
  onClick,
  isDarkMode = true,
  className,
  style,
  hoverEffect = true,
  backgroundColor,
  borderColor,
  borderWidth = 1,
  elevation = 1,
  animateOnMount = false,
  animationDuration = MediasfuAnimations.normal,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(!animateOnMount);

  // Inject animations on mount
  useEffect(() => {
    injectModernAnimations();
    if (animateOnMount) {
      const timer = setTimeout(() => setIsMounted(true), 10);
      return () => clearTimeout(timer);
    }
  }, [animateOnMount]);

  // Calculate glass background
  const glassBackground = backgroundColor || (gradient
    ? undefined
    : `linear-gradient(135deg, ${MediasfuColors.glassBackground(isDarkMode)}, ${MediasfuColors.hexToRgba(
        isDarkMode ? '#FFFFFF' : '#000000',
        isDarkMode ? 0.024 : 0.024
      )})`);

  // Calculate border color
  const glassBorder = borderColor || MediasfuColors.glassBorder(isDarkMode);

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

  // Container styles
  const containerStyle: React.CSSProperties = {
    ...getPadding(),
    background: gradient || glassBackground,
    backgroundColor: gradient ? undefined : backgroundColor,
    borderRadius: `${borderRadius}px`,
    border: `${borderWidth}px solid ${glassBorder}`,
    boxShadow: MediasfuColors.elevation(elevation, isDarkMode),
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    transition: `all ${animationDuration}ms ${MediasfuAnimations.smooth}`,
    cursor: onClick ? 'pointer' : 'default',
    opacity: isMounted ? 1 : 0,
    transform: isMounted 
      ? (isHovered && hoverEffect && onClick ? 'scale(1.01)' : 'scale(1)')
      : 'scale(0.98)',
    ...style,
  };

  // Hover styles
  const hoverStyles: React.CSSProperties = isHovered && hoverEffect && onClick
    ? {
        boxShadow: MediasfuColors.elevation(Math.min(elevation + 1, 5), isDarkMode),
        border: `${borderWidth}px solid ${isDarkMode
          ? 'rgba(255, 255, 255, 0.15)'
          : 'rgba(255, 255, 255, 0.5)'}`,
      }
    : {};

  const handleMouseEnter = useCallback(() => {
    if (hoverEffect) setIsHovered(true);
  }, [hoverEffect]);

  const handleMouseLeave = useCallback(() => {
    if (hoverEffect) setIsHovered(false);
  }, [hoverEffect]);

  const handleClick = useCallback(() => {
    if (onClick) onClick();
  }, [onClick]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  }, [onClick]);

  return (
    <div
      className={className}
      style={{ ...containerStyle, ...hoverStyles }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={onClick ? handleKeyDown : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export default GlassmorphicContainer;
