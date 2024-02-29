/**
 * MainContainerComponent is a flexible container component with adjustable width
 * and height based on window dimensions and specified fractions. It supports
 * custom margins and background color.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.backgroundColor - Background color of the container.
 * @param {ReactNode} props.children - Child components to be rendered inside the container.
 * @param {number} props.containerWidthFraction - Fraction of window width to be used for width calculation.
 * @param {number} props.containerHeightFraction - Fraction of window height to be used for height calculation.
 * @param {number} props.marginLeft - Left margin of the container.
 * @param {number} props.marginRight - Right margin of the container.
 * @param {number} props.marginTop - Top margin of the container.
 * @param {number} props.marginBottom - Bottom margin of the container.
 *
 * @returns {JSX.Element} - Flexible container component with adjustable width and height.
 */

import React, { useEffect, useState } from 'react';

const MainContainerComponent = ({
  backgroundColor,
  children,
  containerWidthFraction,
  containerHeightFraction,
  marginLeft = 0,
  marginRight = 0,
  marginTop = 0,
  marginBottom = 0,
}) => {
  // State to store calculated aspect styles
  const [aspectStyles, setAspectStyles] = useState({
    height: containerHeightFraction
      ? containerHeightFraction * window.innerHeight
      : window.innerHeight,
    width: containerWidthFraction
      ? containerWidthFraction * window.innerWidth
      : window.innerWidth,
  });

  // Effect to update aspect styles on dimension changes
  useEffect(() => {
    const updateAspectStyles = () => {
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      setAspectStyles({
        height: containerHeightFraction
          ? containerHeightFraction * windowHeight
          : windowHeight,
        width: containerWidthFraction ? containerWidthFraction * windowWidth : windowWidth,
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

  }, [containerHeightFraction, containerWidthFraction]);

  return (
    <div
      style={{
        backgroundColor,
        marginLeft,
        marginRight,
        marginTop,
        marginBottom,
        ...aspectStyles,
      }}
    >
      {children}
    </div>
  );
};

export default MainContainerComponent;
