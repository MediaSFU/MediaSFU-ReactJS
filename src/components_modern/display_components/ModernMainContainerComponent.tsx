/**
 * Modern main container with premium styling and responsive design.
 *
 * A premium-styled container that adapts to window size with smooth
 * animations and optional glassmorphic/gradient backgrounds.
 * Uses the same MainContainerComponentOptions as the original component.
 *
 * @example
 * ```tsx
 * <ModernMainContainerComponent
 *   containerWidthFraction={0.9}
 *   containerHeightFraction={0.85}
 * >
 *   <VideoGrid />
 * </ModernMainContainerComponent>
 * ```
 */

import React, { useState, useEffect } from 'react';
import { MainContainerComponentOptions } from '../../components/displayComponents/MainContainerComponent';
import { MediasfuColors } from '../core/theme/MediasfuColors';
import { MediasfuAnimations } from '../core/theme/MediasfuAnimations';

export interface ModernMainContainerComponentOptions extends MainContainerComponentOptions {
  /** Use dark mode styling */
  isDarkMode?: boolean;
  /** Enable glassmorphism effects */
  enableGlassmorphism?: boolean;
  /** Enable animated gradient background */
  enableGradientBackground?: boolean;
  /** Border radius for the container */
  borderRadius?: number;
  /** Show subtle border */
  showBorder?: boolean;
  /** Enable shadow effects */
  enableShadow?: boolean;
}

export type ModernMainContainerComponentType = (
  options: ModernMainContainerComponentOptions
) => React.JSX.Element;

/**
 * ModernMainContainerComponent renders a responsive container with premium styling.
 */
export const ModernMainContainerComponent: React.FC<ModernMainContainerComponentOptions> = ({
  backgroundColor,
  children,
  containerWidthFraction = 1,
  containerHeightFraction = 1,
  marginLeft = 0,
  marginRight = 0,
  marginTop = 0,
  marginBottom = 0,
  padding = 0,
  containerProps,
  renderContent,
  renderContainer,
  // Modern-specific props
  isDarkMode = true,
  enableGlassmorphism = false,
  enableGradientBackground = false,
  borderRadius = 0,
  showBorder = false,
  enableShadow = false,
}) => {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth * containerWidthFraction : 800,
    height: typeof window !== 'undefined' ? window.innerHeight * containerHeightFraction : 600,
  });
  const [isMounted, setIsMounted] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth * containerWidthFraction,
        height: window.innerHeight * containerHeightFraction,
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [containerWidthFraction, containerHeightFraction]);

  // Mount animation
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Determine background
  const getBackground = (): string => {
    if (backgroundColor) return backgroundColor;
    
    if (enableGradientBackground) {
      return isDarkMode
        ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)'
        : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 50%, #F8FAFC 100%)';
    }
    
    if (enableGlassmorphism) {
      return MediasfuColors.glassBackground(isDarkMode);
    }
    
    return isDarkMode ? '#0F172A' : '#F8FAFC';
  };

  // Container styles
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: dimensions.width - marginLeft - marginRight,
    height: dimensions.height - marginTop - marginBottom,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    padding,
    borderRadius: borderRadius > 0 ? `${borderRadius}px` : undefined,
    background: getBackground(),
    backdropFilter: enableGlassmorphism ? 'blur(20px)' : undefined,
    WebkitBackdropFilter: enableGlassmorphism ? 'blur(20px)' : undefined,
    border: showBorder
      ? `1px solid ${enableGlassmorphism
          ? MediasfuColors.glassBorder(isDarkMode)
          : isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
      : undefined,
    boxShadow: enableShadow ? MediasfuColors.elevation(3, isDarkMode) : undefined,
    overflow: 'hidden',
    opacity: isMounted ? 1 : 0,
    transition: `opacity ${MediasfuAnimations.normal}ms ${MediasfuAnimations.smooth}`,
  };

  // Default content
  const defaultContent = <>{children}</>;

  // Rendered content
  const content = renderContent
    ? renderContent({ defaultContent, dimensions })
    : defaultContent;

  // Default container
  const defaultContainer = (
    <div
      style={containerStyle}
      {...containerProps}
    >
      {content}
    </div>
  );

  // Custom container rendering
  if (renderContainer) {
    return <>{renderContainer({ defaultContainer, dimensions })}</>;
  }

  return defaultContainer;
};

export default ModernMainContainerComponent;
