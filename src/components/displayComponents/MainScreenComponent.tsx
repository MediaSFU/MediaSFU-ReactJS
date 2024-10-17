
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
) => JSX.Element;

/**
 * MainScreenComponent is a React functional component that dynamically adjusts the layout
 * and dimensions of its child components based on the provided props and the window size.
 *
 * @param {React.ReactNode} children - The child components to be rendered within the main screen.
 * @param {number} mainSize - The size percentage of the main component when stacking is enabled.
 * @param {boolean} doStack - A flag indicating whether the components should be stacked.
 * @param {number} [containerWidthFraction=1] - The fraction of the window width to be used for the container.
 * @param {number} [containerHeightFraction=1] - The fraction of the window height to be used for the container.
 * @param {Function} updateComponentSizes - A callback function to update the sizes of the components.
 * @param {number} [defaultFraction=0.94] - The default fraction to be applied to the container height when controls are shown.
 * @param {boolean} showControls - A flag indicating whether controls are shown, affecting the container height.
 * @param {Object} componentSizes - An object containing the current sizes of the components.
 *
 * @returns {JSX.Element} The rendered main screen component with its children.
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
