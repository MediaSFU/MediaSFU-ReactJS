
/**
 * MainAspectComponent is a component that displays a scrollable area with specific aspect ratio.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.backgroundColor - Background color of the aspect container.
 * @param {ReactNode} props.children - Content to be displayed inside the scrollable area.
 * @param {boolean} props.showControls - Determines whether controls are shown or not.
 * @param {number} props.containerWidthFraction - Fraction of the window width for the aspect container.
 * @param {number} props.containerHeightFraction - Fraction of the window height for the aspect container.
 * @param {number} props.defaultFraction - Default fraction for height calculation if showControls is true.
 *
 * @returns {JSX.Element} - Main aspect component.
 */

import React, { useState, useEffect } from 'react';

const MainAspectComponent = ({
  backgroundColor,
  children,
  showControls = true,
  containerWidthFraction = 1,
  containerHeightFraction = 1,
  defaultFraction = 0.94,
  updateIsWideScreen,
  updateIsMediumScreen,
  updateIsSmallScreen,
}) => {
  const [aspectStyles, setAspectStyles] = useState({
    height: showControls
      ? containerHeightFraction * window.innerHeight * defaultFraction
      : containerHeightFraction * window.innerHeight,
    width: containerWidthFraction * window.innerWidth,
  });

  useEffect(() => {
    const updateAspectStyles = () => {
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      const parentWidth = containerWidthFraction * windowWidth;

      const isWideScreen = parentWidth > 768;
      const isMediumScreen = parentWidth > 576 && parentWidth <= 768;
      const isSmallScreen = parentWidth <= 576;

      updateIsWideScreen(isWideScreen);
      updateIsMediumScreen(isMediumScreen);
      updateIsSmallScreen(isSmallScreen);

      setAspectStyles({
        height: showControls
          ? containerHeightFraction * windowHeight * defaultFraction
          : containerHeightFraction * windowHeight,
        width: containerWidthFraction * windowWidth,
      });
    };

    // Initial setup
    updateAspectStyles();

    // Listen for resize events
    window.addEventListener('resize', updateAspectStyles);
    window.addEventListener('orientationchange', updateAspectStyles);

    return () => {
      // Remove event listener for dimension changes (window resize)
      window.removeEventListener('resize', updateAspectStyles);
      window.removeEventListener('orientationchange', updateAspectStyles);
    }


  }, [showControls, containerHeightFraction, containerWidthFraction, defaultFraction]);

  return (
    <div style={{ backgroundColor, height: aspectStyles.height, width: aspectStyles.width, overflow: 'hidden' }}>
      {children}
    </div>
  );
};

export default MainAspectComponent;
