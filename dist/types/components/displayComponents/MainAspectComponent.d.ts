import React from "react";
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
export type MainAspectComponentType = (options: MainAspectComponentOptions) => JSX.Element;
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
declare const MainAspectComponent: React.FC<MainAspectComponentOptions>;
export default MainAspectComponent;
//# sourceMappingURL=MainAspectComponent.d.ts.map