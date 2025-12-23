/**
 * An animated gradient background that smoothly transitions between colors.
 *
 * Supports:
 * - Multiple gradient types (linear, radial, sweep)
 * - Smooth color transitions
 * - Rotation animations
 * - Wave effects
 *
 * @example
 * ```tsx
 * <AnimatedGradientBackground
 *   animationType="rotate"
 *   duration={5000}
 *   isDarkMode={true}
 * >
 *   <div>Content on animated background</div>
 * </AnimatedGradientBackground>
 * ```
 */

import React, { useEffect, useRef, useState } from 'react';
import { MediasfuColors } from '../theme/MediasfuColors';
import { injectModernAnimations } from '../../utils/injectAnimations';

/** Types of gradient animation */
export type GradientAnimationType = 
  | 'colorShift'
  | 'rotate'
  | 'wave'
  | 'radialPulse'
  | 'sweep';

export interface AnimatedGradientBackgroundProps {
  /** Child content */
  children?: React.ReactNode;
  /** List of colors for the gradient */
  colors?: string[];
  /** Duration for one complete animation cycle in ms */
  duration?: number;
  /** Type of gradient animation */
  animationType?: GradientAnimationType;
  /** Whether the animation should run */
  animate?: boolean;
  /** Border radius for the container */
  borderRadius?: number;
  /** Custom gradient stops (0-1 values) */
  stops?: number[];
  /** Whether to use dark mode styling */
  isDarkMode?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

export const AnimatedGradientBackground: React.FC<AnimatedGradientBackgroundProps> = ({
  children,
  colors,
  duration = 5000,
  animationType = 'colorShift',
  animate = true,
  borderRadius,
  stops,
  isDarkMode = true,
  className,
  style,
}) => {
  const [animationValue, setAnimationValue] = useState(0);
  const animationRef = useRef<number | null>(null);

  // Inject animations on mount
  useEffect(() => {
    injectModernAnimations();
  }, []);

  // Default gradient colors
  const gradientColors = colors ?? (isDarkMode
    ? [MediasfuColors.primaryDark, MediasfuColors.accentDark, MediasfuColors.secondaryDark]
    : [MediasfuColors.primary, MediasfuColors.accent, MediasfuColors.secondary]);

  // Animation loop
  useEffect(() => {
    if (!animate) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    let startTime: number | null = null;

    const animateFrame = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration;
      setAnimationValue(progress);
      animationRef.current = requestAnimationFrame(animateFrame);
    };

    animationRef.current = requestAnimationFrame(animateFrame);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, duration]);

  // Build gradient based on animation type
  const buildGradient = (): string => {
    switch (animationType) {
      case 'colorShift':
        return buildColorShiftGradient();
      case 'rotate':
        return buildRotatingGradient();
      case 'wave':
        return buildWaveGradient();
      case 'radialPulse':
        return buildRadialPulseGradient();
      case 'sweep':
        return buildSweepGradient();
      default:
        return buildColorShiftGradient();
    }
  };

  // Interpolate between colors based on progress
  const interpolateColor = (color1: string, color2: string, progress: number): string => {
    // Simple hex color interpolation
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');
    
    const r1 = parseInt(hex1.substring(0, 2), 16);
    const g1 = parseInt(hex1.substring(2, 4), 16);
    const b1 = parseInt(hex1.substring(4, 6), 16);
    
    const r2 = parseInt(hex2.substring(0, 2), 16);
    const g2 = parseInt(hex2.substring(2, 4), 16);
    const b2 = parseInt(hex2.substring(4, 6), 16);
    
    const r = Math.round(r1 + (r2 - r1) * progress);
    const g = Math.round(g1 + (g2 - g1) * progress);
    const b = Math.round(b1 + (b2 - b1) * progress);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  const buildColorShiftGradient = (): string => {
    const shift = Math.floor(animationValue * gradientColors.length);
    const localProgress = (animationValue * gradientColors.length) % 1;
    
    const interpolatedColors = gradientColors.map((_, i) => {
      const currentIndex = (i + shift) % gradientColors.length;
      const nextIndex = (i + shift + 1) % gradientColors.length;
      return interpolateColor(
        gradientColors[currentIndex],
        gradientColors[nextIndex],
        localProgress
      );
    });

    const colorStops = stops
      ? interpolatedColors.map((c, i) => `${c} ${stops[i] * 100}%`).join(', ')
      : interpolatedColors.join(', ');

    return `linear-gradient(135deg, ${colorStops})`;
  };

  const buildRotatingGradient = (): string => {
    const angle = animationValue * 360;
    const colorStops = stops
      ? gradientColors.map((c, i) => `${c} ${stops[i] * 100}%`).join(', ')
      : gradientColors.join(', ');

    return `linear-gradient(${angle}deg, ${colorStops})`;
  };

  const buildWaveGradient = (): string => {
    const wave = Math.sin(animationValue * Math.PI * 2);
    const offsetPercent = wave * 25;
    
    const colorStops = stops
      ? gradientColors.map((c, i) => `${c} ${stops[i] * 100}%`).join(', ')
      : gradientColors.join(', ');

    return `linear-gradient(${135 + offsetPercent}deg, ${colorStops})`;
  };

  const buildRadialPulseGradient = (): string => {
    const pulse = 30 + Math.sin(animationValue * Math.PI * 2) * 20;
    const colorStops = stops
      ? gradientColors.map((c, i) => `${c} ${stops[i] * 100}%`).join(', ')
      : gradientColors.join(', ');

    return `radial-gradient(circle at center, transparent 0%, transparent ${pulse}%, ${colorStops})`;
  };

  const buildSweepGradient = (): string => {
    const rotation = animationValue * 360;
    const sweepColors = [...gradientColors, gradientColors[0]];
    const sweepStops = stops ?? sweepColors.map((_, i) => i / (sweepColors.length - 1));
    
    const colorStops = sweepColors
      .map((c, i) => `${c} ${sweepStops[i] * 100}%`)
      .join(', ');

    return `conic-gradient(from ${rotation}deg at center, ${colorStops})`;
  };

  const containerStyle: React.CSSProperties = {
    background: buildGradient(),
    borderRadius: borderRadius != null ? `${borderRadius}px` : undefined,
    ...style,
  };

  return (
    <div className={className} style={containerStyle}>
      {children}
    </div>
  );
};

export default AnimatedGradientBackground;
