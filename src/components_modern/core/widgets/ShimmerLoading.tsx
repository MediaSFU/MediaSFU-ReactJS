/**
 * Shimmer loading placeholder used while data is loading.
 *
 * A shimmer effect component that displays an animated gradient
 * to indicate loading state.
 *
 * @example
 * ```tsx
 * <ShimmerLoading width={200} height={16} isDarkMode={true} />
 * 
 * // Card-style shimmer
 * <ShimmerCard isDarkMode={true} />
 * ```
 */

import React, { useEffect, useRef, useState } from 'react';
import { MediasfuSpacing } from '../theme/MediasfuSpacing';

export interface ShimmerLoadingProps {
  /** Width of the shimmer element */
  width?: number | string;
  /** Height of the shimmer element */
  height?: number;
  /** Border radius */
  borderRadius?: number;
  /** Whether to use dark mode styling */
  isDarkMode?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

export const ShimmerLoading: React.FC<ShimmerLoadingProps> = ({
  width,
  height = 16,
  borderRadius = 8,
  isDarkMode = true,
  className,
  style,
}) => {
  const [animationValue, setAnimationValue] = useState(0);
  const animationRef = useRef<number | null>(null);

  // Colors for shimmer effect
  const baseColor = isDarkMode ? '#334155' : '#E2E8F0';
  const highlightColor = isDarkMode ? '#475569' : '#F1F5F9';

  // Animation loop
  useEffect(() => {
    let startTime: number | null = null;
    const duration = 1200;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration;
      setAnimationValue(progress);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Calculate gradient stops
  const stop1 = Math.max(0, animationValue - 0.3);
  const stop2 = animationValue;
  const stop3 = Math.min(1, animationValue + 0.3);

  const containerStyle: React.CSSProperties = {
    width: width ?? '100%',
    height: `${height}px`,
    borderRadius: `${borderRadius}px`,
    background: `linear-gradient(90deg, ${baseColor} ${stop1 * 100}%, ${highlightColor} ${stop2 * 100}%, ${baseColor} ${stop3 * 100}%)`,
    ...style,
  };

  return (
    <div className={className} style={containerStyle} role="presentation" aria-hidden="true" />
  );
};

export interface ShimmerCardProps {
  /** Whether to use dark mode styling */
  isDarkMode?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Custom aspect ratio for the image area */
  imageHeight?: number;
}

/**
 * Card-style shimmer skeleton for video grid placeholders.
 */
export const ShimmerCard: React.FC<ShimmerCardProps> = ({
  isDarkMode = true,
  className,
  style,
  imageHeight = 140,
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    ...style,
  };

  return (
    <div className={className} style={containerStyle}>
      <ShimmerLoading height={imageHeight} borderRadius={16} isDarkMode={isDarkMode} />
      <div style={{ height: `${MediasfuSpacing.sm}px` }} />
      <ShimmerLoading width={100} height={14} isDarkMode={isDarkMode} />
      <div style={{ height: `${MediasfuSpacing.xs}px` }} />
      <ShimmerLoading width={60} height={12} isDarkMode={isDarkMode} />
    </div>
  );
};

export interface ShimmerTextProps {
  /** Number of text lines to show */
  lines?: number;
  /** Whether to use dark mode styling */
  isDarkMode?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Line height */
  lineHeight?: number;
  /** Gap between lines */
  gap?: number;
}

/**
 * Multi-line text shimmer placeholder.
 */
export const ShimmerText: React.FC<ShimmerTextProps> = ({
  lines = 3,
  isDarkMode = true,
  className,
  style,
  lineHeight = 14,
  gap = 8,
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: `${gap}px`,
    ...style,
  };

  // Generate lines with varying widths
  const lineWidths = [100, 95, 85, 90, 75, 80, 70];

  return (
    <div className={className} style={containerStyle}>
      {Array.from({ length: lines }).map((_, index) => (
        <ShimmerLoading
          key={index}
          width={`${lineWidths[index % lineWidths.length]}%`}
          height={lineHeight}
          isDarkMode={isDarkMode}
        />
      ))}
    </div>
  );
};

export interface ShimmerAvatarProps {
  /** Size of the avatar */
  size?: number;
  /** Whether to use dark mode styling */
  isDarkMode?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * Circular avatar shimmer placeholder.
 */
export const ShimmerAvatar: React.FC<ShimmerAvatarProps> = ({
  size = 48,
  isDarkMode = true,
  className,
  style,
}) => {
  return (
    <ShimmerLoading
      width={size}
      height={size}
      borderRadius={9999}
      isDarkMode={isDarkMode}
      className={className}
      style={style}
    />
  );
};

export default ShimmerLoading;
