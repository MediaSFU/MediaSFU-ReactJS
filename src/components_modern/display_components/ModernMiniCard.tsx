/**
 * Modern Mini Card Component
 *
 * A modern compact avatar/badge widget with glassmorphic styling.
 * Features premium gradient backgrounds, glow effects, and smooth animations.
 * Displays a circular centered avatar area with initials and theme-aware background.
 *
 * @example
 * ```tsx
 * <ModernMiniCard
 *   initials="JD"
 *   imageSource="https://example.com/avatar.jpg"
 *   fontSize={14}
 *   isDarkMode={true}
 * />
 * ```
 */

import React, { useState, useEffect } from 'react';
import { MiniCardOptions } from '../../components/displayComponents/MiniCard';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuTypography } from '../core/theme/MediasfuTypography';
import { MediasfuAnimations } from '../core/theme/MediasfuAnimations';

export interface ModernMiniCardOptions extends Partial<MiniCardOptions> {
  /** Initials to display when no image */
  initials?: string;
  /** URL of the image to display */
  imageSource?: string;
  /** Font size for initials */
  fontSize?: number;
  /** Custom background color */
  backgroundColor?: string;
  /** Whether to use dark mode */
  isDarkMode?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Click handler */
  onClick?: () => void;
  /** Whether to use rounded image/container */
  roundedImage?: boolean;
  /** Show gradient background (like Flutter's showGradientBackground) */
  showGradientBackground?: boolean;
  /** Enable glow effects */
  enableGlow?: boolean;
  /** Show border */
  showBorder?: boolean;
  /** Fixed size for the card (max 140px when roundedImage=true) */
  size?: number;
}

export type ModernMiniCardType = (options: ModernMiniCardOptions) => React.JSX.Element;

export const ModernMiniCard: React.FC<ModernMiniCardOptions> = ({
  initials = '',
  imageSource,
  fontSize = 14,
  backgroundColor,
  isDarkMode = true,
  className,
  style,
  customStyle,
  onClick,
  roundedImage = true, // Default to circular like Flutter
  showGradientBackground = true,
  enableGlow = false,
  showBorder = true,
  size, // Optional fixed size
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const hasImage = !!imageSource && !imageError;
  const mergedStyle = { ...style, ...customStyle };

  // Mount animation
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Get gradient for initials background (matches Flutter's premium gradient)
  const getInitialsGradient = (): string => {
    if (backgroundColor) return backgroundColor;
    // Premium brand gradient like Flutter
    return `linear-gradient(135deg, ${MediasfuColors.primary} 0%, ${MediasfuColors.secondary} 50%, ${MediasfuColors.accent} 100%)`;
  };

  // Get solid background color when not using gradient (theme-aware like Flutter)
  const getSolidBackground = (): string => {
    if (backgroundColor) return backgroundColor;
    // Flutter: primaryDark with 0.3 alpha for dark, surfaceElevated for light
    return isDarkMode
      ? 'rgba(79, 70, 229, 0.3)' // primaryDark with alpha
      : '#F8FAFC'; // surfaceElevated
  };

  // Get border style (theme-aware like Flutter)
  const getBorderStyle = (): string => {
    if (!showBorder && !isDarkMode) return 'none';
    
    // Flutter adds subtle border in dark mode for visual separation
    if (isDarkMode) {
      return showBorder 
        ? `1px solid rgba(99, 102, 241, 0.4)` // brand primary with alpha
        : `1px solid rgba(255, 255, 255, 0.1)`; // subtle white border
    }
    
    return showBorder 
      ? `1px solid rgba(0, 0, 0, 0.15)`
      : 'none';
  };

  // Calculate effective size for the inner circle (when roundedImage=true)
  const innerCircleSize = size ? Math.min(size, 140) : 140;

  // OUTER container - fills parent 100% like original MiniCard
  // Centers the inner avatar circle
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    // When NOT using roundedImage, apply background/border to outer container
    ...(!roundedImage && {
      background: hasImage 
        ? (isDarkMode ? '#1E293B' : '#E2E8F0')
        : (showGradientBackground ? getInitialsGradient() : getSolidBackground()),
      border: hasImage ? 'none' : getBorderStyle(),
      borderRadius: '12px',
    }),
    fontFamily: 'Nunito, sans-serif',
    color: '#FFFFFF',
    opacity: isMounted ? 1 : 0,
    transform: isMounted ? 'scale(1)' : 'scale(0.8)',
    transition: `all ${MediasfuAnimations.normal}ms ${MediasfuAnimations.smooth}`,
    cursor: onClick ? 'pointer' : 'default',
    ...mergedStyle,
  };

  // INNER circle styles - when roundedImage=true, this is the circular avatar
  const innerCircleStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: `${innerCircleSize}px`,
    height: `${innerCircleSize}px`,
    maxWidth: '80%',
    maxHeight: '80%',
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
    background: hasImage 
      ? (isDarkMode ? '#1E293B' : '#E2E8F0')
      : (showGradientBackground ? getInitialsGradient() : getSolidBackground()),
    border: hasImage ? 'none' : getBorderStyle(),
    boxShadow: enableGlow && !hasImage
      ? `0 0 16px ${MediasfuColors.primary}40, 0 4px 8px rgba(0, 0, 0, 0.3)`
      : (isDarkMode ? '0 2px 8px rgba(0, 0, 0, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.1)'),
  };

  // Image container styles
  const imageContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  };

  // Image styles - full size for circular avatar
  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: roundedImage ? '50%' : '12px',
    opacity: imageLoaded ? 1 : 0,
    transition: `opacity ${MediasfuAnimations.fast}ms ${MediasfuAnimations.smooth}`,
  };

  // Initials container styles - centered
  const initialsContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%',
    height: '100%',
  };

  // Initials text styles (matches Flutter)
  const initialsTextStyle: React.CSSProperties = {
    ...MediasfuTypography.getLabelMedium(isDarkMode),
    fontSize: `${fontSize}px`,
    fontWeight: 700,
    color: '#FFFFFF',
    letterSpacing: '1px',
    textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)', // Flutter shadow effect
  };

  // Glass overlay styles for premium effect
  const glassOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)',
    pointerEvents: 'none',
    borderRadius: roundedImage ? '50%' : '12px',
  };

  const handleImageError = () => setImageError(true);
  const handleImageLoad = () => setImageLoaded(true);
  const handleClick = () => onClick?.();

  // Display name (truncate to 10 chars like Flutter)
  const displayName = initials.trim().length > 10 
    ? initials.trim().substring(0, 10) 
    : initials.trim();

  // Build the content (image or initials)
  const contentElement = hasImage ? (
    <div style={imageContainerStyle}>
      <img
        src={imageSource}
        alt={initials || 'Profile'}
        style={imageStyle}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  ) : (
    <div style={initialsContainerStyle}>
      <span style={initialsTextStyle}>{displayName || '?'}</span>
    </div>
  );

  // Glass overlay for premium effect (only for the inner circle when roundedImage=true)
  const glassOverlay = (
    <div style={glassOverlayStyle} />
  );

  return (
    <div
      className={className}
      style={containerStyle}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {roundedImage ? (
        // Rounded image mode: wrap content in centered inner circle
        <div style={innerCircleStyle}>
          {contentElement}
          {glassOverlay}
        </div>
      ) : (
        // Non-rounded mode: content fills the container directly
        <>
          {contentElement}
          {glassOverlay}
        </>
      )}
    </div>
  );
};

export default ModernMiniCard;
