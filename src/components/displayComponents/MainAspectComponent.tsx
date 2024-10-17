
import React, { useState, useEffect } from "react";

export interface MainAspectComponentOptions {
  backgroundColor?: string;
  children: React.ReactNode;
  showControls?: boolean;
  containerWidthFraction?: number;
  containerHeightFraction?: number;
  defaultFraction?: number;
  updateIsWideScreen: (isWide: boolean) => void;
  updateIsMediumScreen: (isMedium: boolean) => void;
  updateIsSmallScreen: (isSmall: boolean) => void;
}

export type MainAspectComponentType = (
  options: MainAspectComponentOptions
) => JSX.Element;

/**
 * MainAspectComponent is a React functional component that adjusts its dimensions
 * based on the window size and specified fractions. It also updates screen size
 * states (wide, medium, small) based on the container's width.
 *
 * @param {string} backgroundColor - The background color of the component. Defaults to "transparent".
 * @param {React.ReactNode} children - The child elements to be rendered inside the component.
 * @param {boolean} showControls - Flag to determine if controls are shown, affecting the height calculation. Defaults to true.
 * @param {number} containerWidthFraction - Fraction of the window width to be used for the container's width. Defaults to 1.
 * @param {number} containerHeightFraction - Fraction of the window height to be used for the container's height. Defaults to 1.
 * @param {number} defaultFraction - Default fraction to adjust the height when controls are shown. Defaults to 0.94.
 * @param {Function} updateIsWideScreen - Callback function to update the wide screen state.
 * @param {Function} updateIsMediumScreen - Callback function to update the medium screen state.
 * @param {Function} updateIsSmallScreen - Callback function to update the small screen state.
 *
 * @returns {JSX.Element} The rendered component with adjusted dimensions and background color.
 */
const MainAspectComponent: React.FC<MainAspectComponentOptions> = ({
  backgroundColor = "transparent",
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
      ? Math.floor(containerHeightFraction * window.innerHeight * defaultFraction)
      : Math.floor(containerHeightFraction * window.innerHeight),
    width: Math.floor(containerWidthFraction * window.innerWidth),
  });

  useEffect(() => {
    const updateAspectStyles = () => {
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      const parentWidth = Math.floor(containerWidthFraction * windowWidth);
      const parentHeight = showControls
        ? Math.floor(containerHeightFraction * windowHeight * defaultFraction)
        : Math.floor(containerHeightFraction * windowHeight);

      let isWideScreen = parentWidth >= 768;
      const isMediumScreen = parentWidth >= 576 && parentWidth < 768;
      const isSmallScreen = parentWidth < 576;

      if (!isWideScreen && parentWidth > 1.5 * parentHeight) {
        isWideScreen = true;
      }

      updateIsWideScreen(isWideScreen);
      updateIsMediumScreen(isMediumScreen);
      updateIsSmallScreen(isSmallScreen);

      setAspectStyles({
        height: showControls
          ? Math.floor(containerHeightFraction * windowHeight * defaultFraction)
          : Math.floor(containerHeightFraction * windowHeight),
        width: Math.floor(containerWidthFraction * windowWidth),
      });
    };

    // Initial setup
    updateAspectStyles();

    // Listen for resize and orientation change events
    window.addEventListener("resize", updateAspectStyles);
    window.addEventListener("orientationchange", updateAspectStyles);

    return () => {
      // Remove event listeners
      window.removeEventListener("resize", updateAspectStyles);
      window.removeEventListener("orientationchange", updateAspectStyles);
    };
  }, [
    showControls,
    containerHeightFraction,
    containerWidthFraction,
    defaultFraction,
    updateIsWideScreen,
    updateIsMediumScreen,
    updateIsSmallScreen,
  ]);

  return (
    <div
      style={{
        backgroundColor,
        height: aspectStyles.height,
        width: aspectStyles.width,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};

export default MainAspectComponent;
