

import React, { useState, useEffect } from "react";

export interface SubAspectComponentOptions {
  backgroundColor: string;
  children: React.ReactNode;
  showControls?: boolean;
  containerWidthFraction?: number;
  containerHeightFraction?: number;
  defaultFractionSub?: number;
}

export type SubAspectComponentType = (
  options: SubAspectComponentOptions
) => JSX.Element;

/**
 * SubAspectComponent is a React functional component that renders a sub-aspect
 * of a media display with optional controls. The component adjusts its width
 * based on the window size and provided fractions.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.backgroundColor - The background color of the component.
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the component.
 * @param {boolean} [props.showControls=true] - Flag to show or hide the controls.
 * @param {number} props.containerWidthFraction - The fraction of the window width to be used for the component's width.
 * @param {number} props.containerHeightFraction - The fraction of the window height to be used for the component's height.
 * @param {number} [props.defaultFractionSub=0.0] - The default sub-aspect fraction to be used if controls are shown.
 *
 * @returns {JSX.Element} The rendered sub-aspect component.
 */
const SubAspectComponent: React.FC<SubAspectComponentOptions> = ({
  backgroundColor,
  children,
  showControls = true,
  containerWidthFraction,
  containerHeightFraction,
  defaultFractionSub = 0.0,
}) => {
  // Default sub-aspect fraction if not provided
  const subAspectFraction = !showControls ? 0 : defaultFractionSub;

  // State to store calculated aspect styles
  const [aspectStyles, setAspectStyles] = useState<React.CSSProperties>({
    height: showControls ? "40px" : "0px",
    width: containerWidthFraction
      ? containerWidthFraction * window.innerWidth
      : window.innerWidth,
  });

  // Effect to update aspect styles on dimension changes
  useEffect(() => {
    const updateAspectStyles = () => {
      const windowWidth = window.innerWidth;

      setAspectStyles({
        height: showControls ? "40px" : "0px",
        width: containerWidthFraction
          ? containerWidthFraction * windowWidth
          : windowWidth,
      });
    };

    // Initial setup
    updateAspectStyles();

    // Listen for resize events
    window.addEventListener("resize", updateAspectStyles);
    window.addEventListener("orientationchange", updateAspectStyles);

    return () => {
      // Remove event listener for dimension changes (window resize)
      window.removeEventListener("resize", updateAspectStyles);
      window.removeEventListener("orientationchange", updateAspectStyles);
    };
  }, [
    showControls,
    containerHeightFraction,
    containerWidthFraction,
    subAspectFraction,
  ]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        margin: 0,
        backgroundColor,
        ...aspectStyles,
        display: showControls ? "flex" : "none",
      }}
    >
      {children}
    </div>
  );
};

export default SubAspectComponent;
