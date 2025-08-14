
import React, { useEffect } from "react";
import { ComponentSizes } from "../../@types/types";

export interface MainScreenComponentOptions {
  children: React.ReactNode;
  mainSize: number;
  doStack: boolean;
  containerWidthFraction?: number;
  containerHeightFraction?: number;
  updateComponentSizes: (sizes: ComponentSizes) => void;
  defaultFraction?: number;
  showControls: boolean;
  componentSizes: ComponentSizes;
}

interface ResizableChildOptions {
  mainSize: number;
  isWideScreen: boolean;
  style?: React.CSSProperties;
}

export type MainScreenComponentType = (
  options: MainScreenComponentOptions
) => React.JSX.Element;

/**
 * MainScreenComponent is a React functional component that dynamically adjusts the layout
 * and dimensions of its child components based on props and the window size.
 *
 * @component
 * @param {MainScreenComponentOptions} props - The properties for MainScreenComponent.
 * @param {React.ReactNode} props.children - The child components to render within the main screen.
 * @param {number} props.mainSize - Percentage size of the main component when stacking.
 * @param {boolean} props.doStack - Flag indicating whether components should be stacked.
 * @param {number} [props.containerWidthFraction=1] - Fraction of window width used for the container.
 * @param {number} [props.containerHeightFraction=1] - Fraction of window height used for the container.
 * @param {Function} props.updateComponentSizes - Callback to update component sizes.
 * @param {number} [props.defaultFraction=0.94] - Default fraction applied to container height when controls are shown.
 * @param {boolean} props.showControls - Flag indicating if controls are shown, affecting container height.
 * @param {ComponentSizes} props.componentSizes - Current sizes of components (main and other dimensions).
 *
 * @returns {React.JSX.Element} The rendered main screen component.
 * 
 * @example
 * ```tsx
 * import React from 'react';
 * import { MainScreenComponent } from 'mediasfu-reactjs';
 *
 * function App() {
 *   return (
 *     <MainScreenComponent
 *       mainSize={70}
 *       doStack={true}
 *       containerWidthFraction={0.5}
 *       containerHeightFraction={0.5}
 *       updateComponentSizes={(sizes) => console.log('Component sizes:', sizes)}
 *       defaultFraction={0.9}
 *       showControls={true}
 *       componentSizes={{ mainHeight: 100, otherHeight: 100, mainWidth: 100, otherWidth: 100 }}
 *     >
 *       <ChildComponent />
 *     </MainScreenComponent>
 *   );
 * }
 *
 * export default App;
 * ```
 */

const MainScreenComponent: React.FC<MainScreenComponentOptions> = ({
  children,
  mainSize,
  doStack,
  containerWidthFraction = 1,
  containerHeightFraction = 1,
  updateComponentSizes,
  defaultFraction = 0.94,
  showControls,
  componentSizes,
}) => {
  const parentWidth = window.innerWidth * containerWidthFraction;
  const parentHeight = showControls
    ? window.innerHeight * containerHeightFraction * defaultFraction
    : window.innerHeight * containerHeightFraction;

  let isWideScreen = parentWidth >= 768;

  if (!isWideScreen && parentWidth > 1.5 * parentHeight) {
    isWideScreen = true;
  }

  const computeDimensions = () => {
    if (doStack) {
      return isWideScreen
        ? {
            mainHeight: parentHeight,
            otherHeight: parentHeight,
            mainWidth: Math.floor((mainSize / 100) * parentWidth),
            otherWidth: Math.floor(((100 - mainSize) / 100) * parentWidth),
          }
        : {
            mainHeight: Math.floor((mainSize / 100) * parentHeight),
            otherHeight: Math.floor(((100 - mainSize) / 100) * parentHeight),
            mainWidth: parentWidth,
            otherWidth: parentWidth,
          };
    } else {
      return {
        mainHeight: parentHeight,
        otherHeight: parentHeight,
        mainWidth: parentWidth,
        otherWidth: parentWidth,
      };
    }
  };

  useEffect(() => {
    const { mainHeight, otherHeight, mainWidth, otherWidth } =
      computeDimensions();
    updateComponentSizes({ mainHeight, otherHeight, mainWidth, otherWidth });
  }, [parentWidth, parentHeight, mainSize, doStack]);

  const { mainHeight, otherHeight, mainWidth, otherWidth } = componentSizes;

  // Type guard to ensure child has the right props
  const isResizableChild = (child: any): child is React.ReactElement<ResizableChildOptions> => {
    return child && typeof child.props === 'object';
  };

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: isWideScreen ? "row" : "column",
        width: parentWidth,
        height: parentHeight,
        padding: 0,
        margin: 0,
      }}
    >
      {/* Render child components with updated dimensions */}
      {React.Children.map(children, (child, index) => {
        if (isResizableChild(child)) {
          const childStyle = doStack
            ? {
                height: index === 0 ? mainHeight : otherHeight,
                width: index === 0 ? mainWidth : otherWidth,
              }
            : {
                height: mainHeight,
                width: mainWidth,
              };

          return React.cloneElement(child, {
            mainSize,
            isWideScreen,
            style: { ...childStyle, ...child.props.style },
            key: index,
          });
        }
        return null;
      })}
    </div>
  );
};

export default MainScreenComponent;
