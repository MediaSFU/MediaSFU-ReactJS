/**
 * A neumorphic container with soft shadow effects creating a 3D raised appearance.
 *
 * Supports:
 * - Light and dark mode adaptive shadows
 * - Pressed/inset state
 * - Customizable depth and blur
 * - Interactive press animations
 *
 * @example
 * ```tsx
 * <NeumorphicContainer
 *   depth={2}
 *   isInteractive={true}
 *   onTap={() => console.log('Clicked!')}
 *   isDarkMode={true}
 * >
 *   <p>Raised content</p>
 * </NeumorphicContainer>
 * ```
 */

import React, { useState, useCallback, useEffect } from 'react';
import { MediasfuSpacing } from '../theme/MediasfuSpacing';
import { MediasfuAnimations } from '../theme/MediasfuAnimations';
import { injectModernAnimations } from '../../utils/injectAnimations';

export interface NeumorphicContainerProps {
  /** Child content */
  children: React.ReactNode;
  /** Background color */
  backgroundColor?: string;
  /** Border radius */
  borderRadius?: number;
  /** Padding */
  padding?: string | number | React.CSSProperties;
  /** Margin */
  margin?: string | number;
  /** Depth of the neumorphic effect (1-3) */
  depth?: number;
  /** Whether the container appears pressed/inset */
  isPressed?: boolean;
  /** Whether the container is interactive */
  isInteractive?: boolean;
  /** Click handler */
  onTap?: () => void;
  /** Long press handler */
  onLongPress?: () => void;
  /** Width */
  width?: number | string;
  /** Height */
  height?: number | string;
  /** Whether to use dark mode styling */
  isDarkMode?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Animation on mount */
  animateOnMount?: boolean;
}

export const NeumorphicContainer: React.FC<NeumorphicContainerProps> = ({
  children,
  backgroundColor,
  borderRadius = 16,
  padding,
  margin,
  depth = 2,
  isPressed: isPressedProp = false,
  isInteractive = false,
  onTap,
  onLongPress,
  width,
  height,
  isDarkMode = true,
  className,
  style,
  animateOnMount = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isMounted, setIsMounted] = useState(!animateOnMount);
  const longPressTimeout = React.useRef<NodeJS.Timeout | null>(null);

  // Inject animations on mount
  useEffect(() => {
    injectModernAnimations();
    if (animateOnMount) {
      const timer = setTimeout(() => setIsMounted(true), 10);
      return () => clearTimeout(timer);
    }
  }, [animateOnMount]);

  // Calculate background color
  const bgColor = backgroundColor || (isDarkMode ? '#1E1E2E' : '#E0E5EC');

  // Build neumorphic shadows based on state and mode
  const buildShadows = (pressed: boolean): string => {
    const clampedDepth = Math.max(1, Math.min(3, depth));
    const baseOffset = 4 * clampedDepth;
    const baseBlur = 8 * clampedDepth;

    if (pressed || isPressedProp) {
      // Inset/pressed state - inverted shadows
      if (isDarkMode) {
        return `
          inset ${-baseOffset / 2}px ${-baseOffset / 2}px ${baseBlur / 2}px rgba(0, 0, 0, 0.4),
          inset ${baseOffset / 2}px ${baseOffset / 2}px ${baseBlur / 2}px rgba(45, 58, 79, 0.2)
        `;
      } else {
        return `
          inset ${-baseOffset / 2}px ${-baseOffset / 2}px ${baseBlur / 2}px rgba(0, 0, 0, 0.08),
          inset ${baseOffset / 2}px ${baseOffset / 2}px ${baseBlur / 2}px rgba(255, 255, 255, 0.5)
        `;
      }
    }

    // Normal raised state
    if (isDarkMode) {
      return `
        ${baseOffset}px ${baseOffset}px ${baseBlur}px rgba(0, 0, 0, 0.5),
        ${-baseOffset}px ${-baseOffset}px ${baseBlur}px rgba(45, 58, 79, 0.3)
      `;
    } else {
      return `
        ${baseOffset}px ${baseOffset}px ${baseBlur}px rgba(163, 177, 198, 0.6),
        ${-baseOffset}px ${-baseOffset}px ${baseBlur}px rgba(255, 255, 255, 0.8)
      `;
    }
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
    boxShadow: buildShadows(isPressed),
    cursor: isInteractive || onTap ? 'pointer' : 'default',
    opacity: isMounted ? 1 : 0,
    transform: isMounted
      ? isPressed
        ? 'scale(0.98)'
        : 'scale(1)'
      : 'scale(0.98)',
    transition: `all ${MediasfuAnimations.fast}ms ${MediasfuAnimations.snappy}`,
    userSelect: 'none',
    ...style,
  };

  const handleMouseDown = useCallback(() => {
    if (isInteractive || onTap) {
      setIsPressed(true);
      
      // Long press detection
      if (onLongPress) {
        longPressTimeout.current = setTimeout(() => {
          onLongPress();
        }, 500);
      }
    }
  }, [isInteractive, onTap, onLongPress]);

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
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
    if ((isInteractive || onTap) && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setIsPressed(true);
    }
  }, [isInteractive, onTap]);

  const handleKeyUp = useCallback((e: React.KeyboardEvent) => {
    if ((isInteractive || onTap) && (e.key === 'Enter' || e.key === ' ')) {
      setIsPressed(false);
      if (onTap) onTap();
    }
  }, [isInteractive, onTap]);

  return (
    <div
      className={className}
      style={containerStyle}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      role={isInteractive || onTap ? 'button' : undefined}
      tabIndex={isInteractive || onTap ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export default NeumorphicContainer;
