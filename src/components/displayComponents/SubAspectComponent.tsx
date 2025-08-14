

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
) => React.JSX.Element;

/**
 * SubAspectComponent is a responsive media sub-component that scales with the viewport and includes optional controls.
 *
 * @param {Object} props - Properties for the SubAspectComponent.
 * @param {string} props.backgroundColor - The background color of the component.
 * @param {React.ReactNode} props.children - Elements to render within the sub-aspect component.
 * @param {boolean} [props.showControls=true] - Option to display controls.
 * @param {number} props.containerWidthFraction - Fraction of the viewport width used for component width.
 * @param {number} props.containerHeightFraction - Fraction of the viewport height used for component height.
 * @param {number} [props.defaultFractionSub=0.0] - Default height fraction for the component if controls are visible.
 *
 * @returns {React.JSX.Element} A responsive sub-aspect media display component.
 * 
 * @example
 * ```tsx
 * import React from 'react';
 * import { SubAspectComponent } from 'mediasfu-reactjs';
 * 
 * function App() {
 *   return (
 *     <SubAspectComponent
 *       backgroundColor="black"
 *       showControls={true}
 *       containerWidthFraction={0.5}
 *       containerHeightFraction={0.5}
 *       defaultFractionSub={0.4}
 *     >
 *       <div>Content goes here</div>
 *     </SubAspectComponent>
 *   );
 * }
 * 
 * export default App;
 * ```
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
