/**
 * A container with customizable glowing effects.
 *
 * Supports:
 * - Static glow
 * - Animated pulsing glow
 * - Hover glow intensity changes
 * - Neon-style intense glow
 *
 * @example
 * ```tsx
 * <GlowContainer
 *   glowColor="#6366F1"
 *   glowIntensity={0.5}
 *   isPulsing={true}
 *   isDarkMode={true}
 * >
 *   <p>Glowing content</p>
 * </GlowContainer>
 * ```
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { MediasfuColors } from '../theme/MediasfuColors';
import { MediasfuSpacing } from '../theme/MediasfuSpacing';
import { MediasfuAnimations } from '../theme/MediasfuAnimations';
import { injectModernAnimations } from '../../utils/injectAnimations';

export interface GlowContainerProps {
  /** Child content */
  children: React.ReactNode;
  /** Glow color */
  glowColor?: string;
  /** Intensity of the glow (0.0 - 1.0) */
  glowIntensity?: number;
  /** Background color */
  backgroundColor?: string;
  /** Border radius */
  borderRadius?: number;
  /** Padding */
  padding?: string | number | React.CSSProperties;
  /** Margin */
  margin?: string | number;
  /** Whether the glow should pulse/animate */
  isPulsing?: boolean;
  /** Duration of pulse animation in ms */
  pulseDuration?: number;
  /** Whether to use neon-style intense glow */
  isNeon?: boolean;
  /** Width */
  width?: number | string;
  /** Height */
  height?: number | string;
  /** Whether to show glow on hover only */
  glowOnHover?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Whether to use dark mode styling */
  isDarkMode?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Animation on mount */
  animateOnMount?: boolean;
}

export const GlowContainer: React.FC<GlowContainerProps> = ({
  children,
  glowColor,
  glowIntensity = 0.5,
  backgroundColor,
  borderRadius = 16,
  padding,
  margin,
  isPulsing = false,
  pulseDuration = 1500,
  isNeon = false,
  width,
  height,
  glowOnHover = false,
  onClick,
  isDarkMode = true,
  className,
  style,
  animateOnMount = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [pulsePhase, setPulsePhase] = useState(0);
  const [isMounted, setIsMounted] = useState(!animateOnMount);
  const animationRef = useRef<number | null>(null);

  // Inject animations on mount
  useEffect(() => {
    injectModernAnimations();
    if (animateOnMount) {
      const timer = setTimeout(() => setIsMounted(true), 10);
      return () => clearTimeout(timer);
    }
  }, [animateOnMount]);

  // Pulse animation
  useEffect(() => {
    if (!isPulsing) {
      setPulsePhase(0);
      return;
    }

    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % pulseDuration) / pulseDuration;
      // Use easeInOut for smooth pulse
      const easedProgress = Math.sin(progress * Math.PI);
      setPulsePhase(easedProgress);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPulsing, pulseDuration]);

  // Calculate colors
  const color = glowColor || (isDarkMode ? MediasfuColors.primaryDark : MediasfuColors.primary);
  const bgColor = backgroundColor || (isDarkMode ? MediasfuColors.surfaceDark : MediasfuColors.surface);

  // Calculate effective intensity
  const effectiveIntensity = glowOnHover
    ? (isHovered ? glowIntensity : 0)
    : glowIntensity;

  // Build glow shadows
  const buildGlowShadow = (): string => {
    if (isNeon) {
      // Neon glow - multiple layered shadows
      return `
        0 0 5px ${MediasfuColors.hexToRgba(color, 0.8)},
        0 0 10px ${MediasfuColors.hexToRgba(color, 0.6)},
        0 0 20px ${MediasfuColors.hexToRgba(color, 0.4)},
        0 0 40px ${MediasfuColors.hexToRgba(color, 0.2)}
      `;
    }

    if (isPulsing) {
      // Pulse glow - intensity varies with animation
      const intensity = effectiveIntensity * (0.3 + pulsePhase * 0.7);
      return `
        0 0 ${10 + pulsePhase * 20}px ${MediasfuColors.hexToRgba(color, intensity * 0.6)},
        0 0 ${20 + pulsePhase * 40}px ${MediasfuColors.hexToRgba(color, intensity * 0.3)}
      `;
    }

    // Static glow
    const blurRadius = 15 * effectiveIntensity;
    const spreadRadius = 5 * effectiveIntensity;
    return `0 0 ${blurRadius}px ${spreadRadius}px ${MediasfuColors.hexToRgba(color, effectiveIntensity * 0.5)}`;
  };

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
    width,
    height,
    margin: typeof margin === 'number' ? `${margin}px` : margin,
    background: bgColor,
    borderRadius: `${borderRadius}px`,
    border: `1px solid ${MediasfuColors.hexToRgba(color, 0.3)}`,
    boxShadow: buildGlowShadow(),
    cursor: onClick ? 'pointer' : 'default',
    opacity: isMounted ? 1 : 0,
    transform: isMounted ? 'scale(1)' : 'scale(0.98)',
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
    ...style,
  };

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

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
      style={containerStyle}
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

export default GlowContainer;
