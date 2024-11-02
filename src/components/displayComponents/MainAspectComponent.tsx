
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
 * MainAspectComponent is a React functional component that dynamically adjusts its dimensions based on window size and specified fractions, while updating screen size states (wide, medium, small) based on container width.
 *
 * This component provides an adaptive container that resizes according to the window’s height and width, factoring in control visibility, and offers real-time updates for screen size breakpoints.
 *
 * @component
 * @param {MainAspectComponentOptions} props - The properties for the MainAspectComponent.
 * @param {string} [props.backgroundColor='transparent'] - Background color of the component.
 * @param {React.ReactNode} props.children - The child elements to render inside the component.
 * @param {boolean} [props.showControls=true] - Determines if controls are shown, impacting height calculation.
 * @param {number} [props.containerWidthFraction=1] - Fraction of the window width for container width.
 * @param {number} [props.containerHeightFraction=1] - Fraction of the window height for container height.
 * @param {number} [props.defaultFraction=0.94] - Default height fraction adjustment when controls are visible.
 * @param {Function} props.updateIsWideScreen - Callback to update wide screen state.
 * @param {Function} props.updateIsMediumScreen - Callback to update medium screen state.
 * @param {Function} props.updateIsSmallScreen - Callback to update small screen state.
 *
 * @returns {JSX.Element} The rendered MainAspectComponent with adaptive dimensions.
 * 
 * @example
 * ```tsx
 * import React, { useState } from 'react';
 * import { MainAspectComponent } from 'mediasfu-reactjs';
 *
 * function App() {
 *   const [isWideScreen, setIsWideScreen] = useState(false);
 *   const [isMediumScreen, setIsMediumScreen] = useState(false);
 *   const [isSmallScreen, setIsSmallScreen] = useState(false);
 *
 *   return (
 *     <MainAspectComponent
 *       backgroundColor="black"
 *       showControls={true}
 *       containerWidthFraction={0.5}
 *       containerHeightFraction={0.5}
 *       defaultFraction={0.9}
 *       updateIsWideScreen={setIsWideScreen}
 *       updateIsMediumScreen={setIsMediumScreen}
 *       updateIsSmallScreen={setIsSmallScreen}
 *     >
 *       <div>Responsive Content</div>
 *     </MainAspectComponent>
 *   );
 * }
 *
 * export default App;
 * ```
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
