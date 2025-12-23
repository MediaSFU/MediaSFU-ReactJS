/**
 * Elevated card with the brand gradient used for highlights.
 *
 * A gradient card component that provides a visually prominent surface
 * with brand gradient background, optional title and subtitle, and elevation shadows.
 *
 * @example
 * ```tsx
 * <GradientCard 
 *   title="Premium Feature" 
 *   subtitle="Unlock advanced capabilities"
 *   isDarkMode={true}
 * >
 *   <p>Card content goes here</p>
 * </GradientCard>
 * ```
 */

import React, { useState, useCallback, useEffect } from 'react';
import { MediasfuColors } from '../theme/MediasfuColors';
import { MediasfuSpacing } from '../theme/MediasfuSpacing';
import { MediasfuTypography } from '../theme/MediasfuTypography';
import { MediasfuAnimations } from '../theme/MediasfuAnimations';
import { injectModernAnimations } from '../../utils/injectAnimations';

export interface GradientCardProps {
  /** Child content */
  children?: React.ReactNode;
  /** Card title */
  title?: string;
  /** Card subtitle */
  subtitle?: string;
  /** Border radius in pixels */
  borderRadius?: number;
  /** Custom padding */
  padding?: string | number | React.CSSProperties;
  /** Custom gradient (overrides brand gradient) */
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
  /** Elevation level (1-5) */
  elevation?: number;
  /** Animation on mount */
  animateOnMount?: boolean;
  /** Animation duration in ms */
  animationDuration?: number;
  /** Title style override */
  titleStyle?: React.CSSProperties;
  /** Subtitle style override */
  subtitleStyle?: React.CSSProperties;
  /** Content alignment */
  alignment?: 'start' | 'center' | 'end';
}

export const GradientCard: React.FC<GradientCardProps> = ({
  children,
  title,
  subtitle,
  borderRadius = 20,
  padding,
  gradient,
  onClick,
  isDarkMode = true,
  className,
  style,
  hoverEffect = true,
  elevation = 2,
  animateOnMount = false,
  animationDuration = MediasfuAnimations.normal,
  titleStyle,
  subtitleStyle,
  alignment = 'start',
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

  // Get alignment styles
  const getAlignmentStyle = (): React.CSSProperties => {
    const alignMap = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
    };
    return { alignItems: alignMap[alignment] };
  };

  // Container styles
  const containerStyle: React.CSSProperties = {
    ...getPadding(),
    ...getAlignmentStyle(),
    background: gradient || MediasfuColors.brandGradient(isDarkMode),
    borderRadius: `${borderRadius}px`,
    boxShadow: MediasfuColors.elevation(elevation, isDarkMode),
    display: 'flex',
    flexDirection: 'column',
    transition: `all ${animationDuration}ms ${MediasfuAnimations.smooth}`,
    cursor: onClick ? 'pointer' : 'default',
    opacity: isMounted ? 1 : 0,
    transform: isMounted 
      ? (isHovered && hoverEffect && onClick ? 'scale(1.02) translateY(-2px)' : 'scale(1)')
      : 'scale(0.98) translateY(10px)',
    ...style,
  };

  // Hover styles
  const hoverStyles: React.CSSProperties = isHovered && hoverEffect && onClick
    ? {
        boxShadow: MediasfuColors.elevation(Math.min(elevation + 1, 5), isDarkMode),
      }
    : {};

  // Title styles
  const baseTitleStyle: React.CSSProperties = {
    ...MediasfuTypography.toStyle(MediasfuTypography.titleMedium),
    color: '#FFFFFF',
    marginBottom: subtitle || children ? `${MediasfuSpacing.xs}px` : 0,
    ...titleStyle,
  };

  // Subtitle styles
  const baseSubtitleStyle: React.CSSProperties = {
    ...MediasfuTypography.toStyle(MediasfuTypography.bodyMedium),
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: children ? `${MediasfuSpacing.sm}px` : 0,
    ...subtitleStyle,
  };

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
      {title && <div style={baseTitleStyle}>{title}</div>}
      {subtitle && <div style={baseSubtitleStyle}>{subtitle}</div>}
      {children}
    </div>
  );
};

export default GradientCard;
